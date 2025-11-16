// src/data/historyAtoms.ts
import { atom } from 'jotai';
import { produce, Draft } from 'immer';
import { LayoutComponent, WidgetComponent, DynamicComponent, CanvasComponent, NormalizedCanvasComponents } from '../types';
import { 
  canvasInteractionAtom, 
  CanvasInteractionState, 
  scrollRequestAtom,
  isPropertiesPanelVisibleAtom,
  activeToolbarTabAtom,
  isComponentBrowserVisibleAtom,
} from './atoms';
import { createWidgetComponent, createLayoutComponent, createDynamicComponent } from './componentFactory';
import { templates, TemplateItem } from './templatesMock';

// 1. DEFINE THE CORE SHAPES
export interface UndoableState {
  promptName: string;
  rootComponentId: string;
  components: NormalizedCanvasComponents;
}

interface ActionMeta {
  message: string;
  interactionState: CanvasInteractionState;
}

type HistoryData = {
  past: UndoableState[];
  present: UndoableState;
  future: UndoableState[];
};

// 2. DEFINE THE ACTION CONTRACT (REDUCER PATTERN)
export type HistoryAction =
  | { type: 'COMPONENT_ADD'; payload: { 
      componentType: 'layout' | 'widget' | 'field' | 'dynamic'; 
      name: string;
      parentId: string; 
      index: number; 
      controlType?: WidgetComponent['properties']['controlType'];
      controlTypeProps?: Partial<WidgetComponent['properties']>;
      dynamicType?: DynamicComponent['dynamicType'];
    } }
  | { type: 'TEMPLATE_ADD'; payload: { templateId: string; parentId: string; index: number; } }
  | { type: 'COMPONENT_DELETE'; payload: { componentId: string } }
  | { type: 'COMPONENTS_DELETE_BULK'; payload: { componentIds: string[] } }
  | { type: 'COMPONENT_MOVE'; payload: { componentId: string; newParentId: string; oldParentId: string; newIndex: number; } }
  | { type: 'COMPONENT_REORDER'; payload: { componentId: string; parentId: string; oldIndex: number; newIndex: number; } }
  | { type: 'COMPONENTS_WRAP'; payload: { componentIds: string[]; parentId: string; } }
  | { type: 'COMPONENT_UNWRAP'; payload: { componentId: string; } }
  | { type: 'COMPONENT_UPDATE_PROPERTIES'; payload: { componentId: string; newProperties: Partial<LayoutComponent['properties']>; } }
  | { type: 'COMPONENT_UPDATE_WIDGET_PROPERTIES'; payload: { componentId: string; newProperties: Partial<WidgetComponent['properties']> } }
  | { type: 'COMPONENT_UPDATE_DYNAMIC_PROPERTIES'; payload: { componentId: string; newProperties: Partial<DynamicComponent['properties']> } }
  | { type: 'PROMPT_RENAME'; payload: { newName: string } };

// 3. CREATE THE CORE ATOMS
const historyAtom = atom<HistoryData>({
  past: [],
  present: {
    promptName: "New Prompt",
    rootComponentId: 'root',
    components: {
      'root': {
        id: 'root',
        parentId: '',
        name: 'Root',
        componentType: 'layout',
        children: [],
        properties: { 
          arrangement: 'stack',
        },
      }
    },
  },
  future: [],
});

export const actionMetaHistoryAtom = atom<{ past: ActionMeta[], future: ActionMeta[] }>({
  past: [],
  future: [],
});

const deleteComponentAndChildren = (
  components: Draft<NormalizedCanvasComponents>,
  componentId: string
) => {
  const componentToDelete = components[componentId];
  if (!componentToDelete) return;

  if ((componentToDelete.componentType === 'layout' || componentToDelete.componentType === 'dynamic') && componentToDelete.children) {
    [...componentToDelete.children].forEach(childId => {
      deleteComponentAndChildren(components, childId);
    });
  }

  const parent = components[componentToDelete.parentId];
  if (parent && (parent.componentType === 'layout' || parent.componentType === 'dynamic')) {
    parent.children = parent.children.filter(id => id !== componentId);
  }
  delete components[componentId];
};

// 4. CREATE THE CENTRAL ACTION DISPATCHER (THE REDUCER)
export const commitActionAtom = atom(
  null,
  (get, set, action: { action: HistoryAction, message: string }) => {
    set(historyAtom, (currentHistory) => {
      const nextState = produce(currentHistory, (draft: Draft<HistoryData>) => {
        const presentState = draft.present;

        switch (action.action.type) {
          case 'COMPONENT_ADD': {
            const { componentType, parentId, index, ...rest } = action.action.payload;
            let newComponent: CanvasComponent;

            if (componentType === 'layout') {
              newComponent = createLayoutComponent(parentId, rest.name);
            } else if (componentType === 'dynamic' && rest.dynamicType) {
              newComponent = createDynamicComponent(parentId, rest.dynamicType);
            } else {
              newComponent = createWidgetComponent({ parentId, ...rest });
            }
            
            presentState.components[newComponent.id] = newComponent;
            const parent = presentState.components[parentId];
            if (parent && (parent.componentType === 'layout' || parent.componentType === 'dynamic')) {
              const childrenCountBefore = parent.children.length;
              parent.children.splice(index, 0, newComponent.id);
              if (parentId === presentState.rootComponentId && index === childrenCountBefore) {
                set(scrollRequestAtom, { componentId: newComponent.id });
              }
            }
            break;
          }
          case 'TEMPLATE_ADD': {
            const { templateId, parentId, index } = action.action.payload;
            const template = templates[templateId];
            if (!template) break;

            // Create the main container for the template form
            const templateContainer = createLayoutComponent(parentId, template.name);
            templateContainer.properties.isTemplateContainer = true;
            templateContainer.isLocked = true;
            presentState.components[templateContainer.id] = templateContainer;

            // Recursive function to create components from the template blueprint
            const createFromTemplate = (item: TemplateItem, currentParentId: string): string => {
              let newComponent: CanvasComponent;
              if (item.type === 'group') {
                // Groups within templates are flattened. We only care about their children.
                // We extract the Header and Input and create them as direct children of the container.
                const headerItem = item.children.find(c => c.type === 'Section Header');
                const inputItem = item.children.find(c => c.type === 'Text Input');
                
                if (headerItem && inputItem && headerItem.type === 'Section Header' && inputItem.type === 'Text Input') {
                  newComponent = createWidgetComponent({
                    parentId: currentParentId,
                    name: headerItem.content, // Use header content as the name/label
                    controlType: 'text-input',
                    controlTypeProps: {
                      ...inputItem.props,
                      label: headerItem.content, // Ensure label is set from header
                    },
                  });
                  newComponent.isLocked = item.isLocked;
                  presentState.components[newComponent.id] = newComponent;
                  return newComponent.id;
                }
              }
              // Handle standalone Text Blocks
              else if (item.type === 'Text Block') {
                newComponent = createWidgetComponent({
                  parentId: currentParentId,
                  name: 'Text Block',
                  controlType: 'plain-text',
                  controlTypeProps: { textElement: 'p', content: item.content },
                });
                newComponent.isLocked = item.isLocked;
                presentState.components[newComponent.id] = newComponent;
                return newComponent.id;
              }
              return ''; // Should not happen with valid template structure
            };

            const childrenIds = template.components.map(item => createFromTemplate(item, templateContainer.id)).filter(Boolean);
            templateContainer.children = childrenIds;

            const parent = presentState.components[parentId];
            if (parent && (parent.componentType === 'layout' || parent.componentType === 'dynamic')) {
              parent.children.splice(index, 0, templateContainer.id);
            }
            break;
          }
          case 'COMPONENT_DELETE': {
            const { componentId } = action.action.payload;
            deleteComponentAndChildren(presentState.components, componentId);
            break;
          }
          case 'COMPONENTS_DELETE_BULK': {
            const { componentIds } = action.action.payload;
            componentIds.forEach(id => {
              deleteComponentAndChildren(presentState.components, id);
            });
            break;
          }
          case 'COMPONENT_REORDER': {
            const { parentId, oldIndex, newIndex } = action.action.payload;
            const parent = presentState.components[parentId];
            if (parent && (parent.componentType === 'layout' || parent.componentType === 'dynamic')) {
              const [moved] = parent.children.splice(oldIndex, 1);
              parent.children.splice(newIndex, 0, moved);
            }
            break;
          }
          case 'COMPONENT_MOVE': {
            const { componentId, oldParentId, newParentId, newIndex } = action.action.payload;
            const oldParent = presentState.components[oldParentId];
            if (oldParent && (oldParent.componentType === 'layout' || oldParent.componentType === 'dynamic')) {
              oldParent.children = oldParent.children.filter(id => id !== componentId);
            }
            const newParent = presentState.components[newParentId];
            if (newParent && (newParent.componentType === 'layout' || newParent.componentType === 'dynamic')) {
              newParent.children.splice(newIndex, 0, componentId);
            }
            const component = presentState.components[componentId];
            if (component) {
              component.parentId = newParentId;
            }
            break;
          }
          case 'COMPONENTS_WRAP': {
            const { componentIds, parentId } = action.action.payload;
            const parent = presentState.components[parentId];
            if (!parent || (parent.componentType !== 'layout' && parent.componentType !== 'dynamic')) break;
            
            const newContainer = createLayoutComponent(parentId);
            newContainer.children = componentIds;

            presentState.components[newContainer.id] = newContainer;
            componentIds.forEach(id => {
              const child = presentState.components[id];
              if (child) child.parentId = newContainer.id;
            });
            const firstChildIndex = parent.children.indexOf(componentIds[0]);
            const remainingChildren = parent.children.filter(id => !componentIds.includes(id));
            remainingChildren.splice(firstChildIndex, 0, newContainer.id);
            parent.children = remainingChildren;
            break;
          }
          case 'COMPONENT_UNWRAP': {
            const { componentId } = action.action.payload;
            const container = presentState.components[componentId];
            if (!container || container.componentType !== 'layout') break;
            
            const parent = presentState.components[container.parentId];
            if (!parent || (parent.componentType !== 'layout' && parent.componentType !== 'dynamic')) break;

            const containerIndex = parent.children.indexOf(componentId);
            if (containerIndex === -1) break;

            container.children.forEach(childId => {
              const child = presentState.components[childId];
              if (child) child.parentId = parent.id;
            });

            parent.children.splice(containerIndex, 1, ...container.children);
            delete presentState.components[componentId];
            break;
          }
          case 'COMPONENT_UPDATE_PROPERTIES': {
            const { componentId, newProperties } = action.action.payload;
            const component = presentState.components[componentId];
            if (component && component.componentType === 'layout') {
              component.properties = { ...component.properties, ...newProperties };
            }
            break;
          }
          case 'COMPONENT_UPDATE_WIDGET_PROPERTIES': {
            const { componentId, newProperties } = action.action.payload;
            const component = presentState.components[componentId];
            if (component && (component.componentType === 'field' || component.componentType === 'widget')) {
              component.properties = { ...component.properties, ...newProperties };
            }
            break;
          }
          case 'COMPONENT_UPDATE_DYNAMIC_PROPERTIES': {
            const { componentId, newProperties } = action.action.payload;
            const component = presentState.components[componentId];
            if (component && component.componentType === 'dynamic') {
              component.properties = { ...component.properties, ...newProperties };
            }
            break;
          }
          case 'PROMPT_RENAME': {
            presentState.promptName = action.action.payload.newName;
            break;
          }
        }
        draft.past.push(currentHistory.present);
        draft.future = [];
      });
      return nextState;
    });
    const currentInteractionState = get(canvasInteractionAtom);
    const newMeta: ActionMeta = { message: action.message, interactionState: currentInteractionState };
    set(actionMetaHistoryAtom, (currentMetaHistory) => ({
      past: [...currentMetaHistory.past, newMeta],
      future: [],
    }));
  }
);

export const undoAtom = atom(null, (_get, set) => {
  set(historyAtom, (currentHistory) => {
    if (!currentHistory.past.length) return currentHistory;
    const newPresent = currentHistory.past[currentHistory.past.length - 1];
    const newPast = currentHistory.past.slice(0, -1);
    return {
      past: newPast,
      present: newPresent,
      future: [currentHistory.present, ...currentHistory.future],
    };
  });
  set(actionMetaHistoryAtom, (currentMetaHistory) => {
    if (!currentMetaHistory.past.length) return currentMetaHistory;
    const lastMeta = currentMetaHistory.past[currentMetaHistory.past.length - 1];
    const newPastMetas = currentMetaHistory.past.slice(0, -1);
    set(canvasInteractionAtom, lastMeta.interactionState);
    return {
      past: newPastMetas,
      future: [lastMeta, ...currentMetaHistory.future],
    };
  });
});

export const redoAtom = atom(null, (_get, set) => {
  set(historyAtom, (currentHistory) => {
    if (!currentHistory.future.length) return currentHistory;
    const newPresent = currentHistory.future[0];
    const newFuture = currentHistory.future.slice(1);
    return {
      past: [...currentHistory.past, currentHistory.present],
      present: newPresent,
      future: newFuture,
    };
  });
  set(actionMetaHistoryAtom, (currentMetaHistory) => {
    if (!currentMetaHistory.future.length) return currentMetaHistory;
    const nextMeta = currentMetaHistory.future[0];
    const newFutureMetas = currentMetaHistory.future.slice(1);
    set(canvasInteractionAtom, nextMeta.interactionState);
    return {
      past: [...currentMetaHistory.past, nextMeta],
      future: newFutureMetas,
    };
  });
});

// 5. CREATE DERIVED, READ-ONLY ATOMS FOR UI
export const undoableStateAtom = atom<UndoableState>((get) => get(historyAtom).present);
export const promptNameAtom = atom<string>((get) => get(undoableStateAtom).promptName);
export const canvasComponentsByIdAtom = atom<NormalizedCanvasComponents>((get) => get(undoableStateAtom).components);
export const rootComponentIdAtom = atom<string>((get) => get(undoableStateAtom).rootComponentId);
export const canUndoAtom = atom<boolean>((get) => get(historyAtom).past.length > 0);
export const canRedoAtom = atom<boolean>((get) => get(historyAtom).future.length > 0);

// --- User Flow Atom ---
export const startEditingOnEmptyCanvasAtom = atom(null, (get, set) => {
  const rootId = get(rootComponentIdAtom);
  set(canvasInteractionAtom, { mode: 'selecting', ids: [rootId] });
  set(isPropertiesPanelVisibleAtom, true);
  set(activeToolbarTabAtom, 'lab-1');
  set(isComponentBrowserVisibleAtom, true);
});