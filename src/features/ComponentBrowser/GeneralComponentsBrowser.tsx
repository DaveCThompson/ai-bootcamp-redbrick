// src/features/ComponentBrowser/GeneralComponentsBrowser.tsx
import { useSetAtom } from 'jotai';
import { useDraggable } from '@dnd-kit/core';
import { isComponentBrowserVisibleAtom } from '../../data/atoms';
import { promptElements } from '../../data/promptElementsMock';
// FIX: Removed unused 'DynamicComponent' import.
import { DraggableComponent, DndData, WidgetComponent } from '../../types';
import { PanelHeader } from '../../components/PanelHeader';
import panelStyles from '../../components/panel.module.css';

const DraggableListItem = ({ component }: { component: DraggableComponent }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `new-${component.id}`,
    data: {
      id: component.id,
      name: component.name,
      type: component.type,
      icon: component.icon,
      isNew: true,
      // FIX: 'origin' property removed to match DndData type.
      controlType: 
        (component.id === 'heading' || component.id === 'paragraph') ? 'plain-text' : 
        (component.type === 'widget') ? component.id as WidgetComponent['properties']['controlType'] : undefined,
      controlTypeProps: 
        component.id === 'heading' ? { textElement: 'h2', content: 'Section Header' } :
        component.id === 'paragraph' ? { textElement: 'p', content: 'This is a block of text.' } :
        undefined,
      dynamicType: component.type === 'dynamic' ? 'role' : undefined,
    } satisfies DndData,
  });

  // FIX: Removed iconColor logic as it's no longer in the type definition.
  const iconStyle = {};

  return (
    <li
      ref={setNodeRef}
      style={{ opacity: isDragging ? 0.4 : 1, touchAction: 'none' }}
      {...listeners}
      {...attributes}
      className={`menu-item ${panelStyles.dataNavItem}`}
    >
      <span className={`material-symbols-rounded ${panelStyles.componentIcon}`} style={iconStyle}>{component.icon}</span>
      <span className={panelStyles.componentName}>{component.name}</span>
    </li>
  );
};

export const GeneralComponentsBrowser = () => {
  const setIsPanelVisible = useSetAtom(isComponentBrowserVisibleAtom);

  const handleClosePanel = () => {
    setIsPanelVisible(false);
  }

  return (
    <div className={panelStyles.componentBrowserContainer}>
      <PanelHeader title="Prompt Elements" onClose={handleClosePanel} />
      <div className={panelStyles.componentListContainer}>
        <ul className={panelStyles.componentList}>
          {promptElements.map((group) => (
            <li key={group.title} className={panelStyles.componentListGroup}>
              <h5 className={panelStyles.listGroupTitle}>{group.title}</h5>
              <ul className={panelStyles.componentListGroupItems}>
                {group.components.map((component) => (
                  <DraggableListItem key={component.id} component={component} />
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};