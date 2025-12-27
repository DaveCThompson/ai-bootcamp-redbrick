// src/features/EditorCanvas/useEditorInteractions.ts
import { useSortable } from '@dnd-kit/sortable';
import { useAtom, useAtomValue } from 'jotai';
import {
  appViewModeAtom,
  canvasInteractionAtom,
  selectionAnchorIdAtom,
  CanvasInteractionState,
} from '../../data/atoms';
import { canvasComponentsByIdAtom, rootComponentIdAtom } from '../../data/promptStateAtoms';
import { CanvasComponent, DndData } from '../../types';
import { getComponentName } from './canvasUtils';
import { CSS } from '@dnd-kit/utilities';

/**
 * A hook that encapsulates all logic for making a component interactive on the canvas.
 * It provides props for sorting (dnd-kit), selection handling, and state flags.
 */
export const useEditorInteractions = (component: CanvasComponent) => {
  const viewMode = useAtomValue(appViewModeAtom);
  const [interactionState, setInteractionState] = useAtom(canvasInteractionAtom);
  const [anchorId, setAnchorId] = useAtom(selectionAnchorIdAtom);
  const allComponents = useAtomValue(canvasComponentsByIdAtom);
  const rootId = useAtomValue(rootComponentIdAtom);


  const isRoot = component.id === rootId;
  const isSelected = (interactionState.mode === 'selecting' && interactionState.ids.includes(component.id)) || (interactionState.mode === 'editing' && interactionState.id === component.id);
  const isEditing = interactionState.mode === 'editing' && interactionState.id === component.id;
  const isMultiSelect = interactionState.mode === 'selecting' && interactionState.ids.length > 1;
  const isOnlySelection = isSelected && !isMultiSelect;

  const { listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: component.id,
    data: {
      id: component.id,
      name: getComponentName(component),
      type: component.componentType,
      // FIX: Only layout components have children.
      childrenCount: (component.componentType === 'layout') ? component.children.length : undefined,
      isNew: false,
      icon: '',
    } satisfies DndData,
    disabled: isRoot || viewMode !== 'editor',
  });

  const handleSelect = (e: React.MouseEvent) => {
    if (viewMode !== 'editor') return;

    if (isRoot) return;
    e.stopPropagation();


    const isEditableOnCanvas =
      (component.componentType === 'widget' || component.componentType === 'field') &&
      (component.properties.controlType === 'text-input' ||
        component.properties.controlType === 'plain-text');

    if ((e.altKey && isEditableOnCanvas) || (e.detail === 2 && isEditableOnCanvas)) {
      setInteractionState({ mode: 'editing', id: component.id });
      return;
    }

    const isCtrlClick = e.ctrlKey || e.metaKey;
    if (isCtrlClick) {
      const currentIds = interactionState.mode === 'selecting' ? interactionState.ids : [];
      const newIds = currentIds.includes(component.id) ? currentIds.filter(id => id !== component.id) : [...currentIds, component.id];
      const newInteractionState: CanvasInteractionState = newIds.length > 0 ? { mode: 'selecting', ids: newIds } : { mode: 'idle' };
      if (newIds.length === 0) {
        setAnchorId(null);
      } else {
        setAnchorId(component.id);
      }
      setInteractionState(newInteractionState);
    } else if (e.shiftKey && anchorId) {
      const parent = allComponents[component.parentId];
      const anchorComponent = allComponents[anchorId];
      // FIX: Only layout components can be parents for range selection.
      if (parent && parent.componentType === 'layout' && anchorComponent && anchorComponent.parentId === component.parentId) {
        const children = parent.children;
        const anchorIndex = children.indexOf(anchorId);
        const targetIndex = children.indexOf(component.id);
        const start = Math.min(anchorIndex, targetIndex);
        const end = Math.max(anchorIndex, targetIndex);
        const rangeIds = children.slice(start, end + 1);
        setInteractionState({ mode: 'selecting', ids: rangeIds });
      } else {
        setInteractionState({ mode: 'selecting', ids: [component.id] });
        setAnchorId(component.id);
      }
    } else {
      setInteractionState({ mode: 'selecting', ids: [component.id] });
      setAnchorId(component.id);
    }
  };

  const sortableStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  if (isRoot) sortableStyle.transform = 'none';

  return {
    isSelected,
    isEditing,
    isDragging,
    isOnlySelection,
    isRoot,
    sortableProps: {
      ref: setNodeRef,
      style: sortableStyle,
    },
    selectionProps: {
      onClick: handleSelect,
    },
    dndListeners: listeners,
  };
};