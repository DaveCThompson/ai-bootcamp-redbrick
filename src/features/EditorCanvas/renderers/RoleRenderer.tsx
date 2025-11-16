// src/features/EditorCanvas/renderers/RoleRenderer.tsx
import { useRef } from 'react';
import { DynamicComponent } from '../../../types';
import { RendererProps } from './types';
import { useEditorInteractions } from '../useEditorInteractions';
import { CanvasSelectionToolbar } from '../CanvasSelectionToolbar';
import { roles } from '../../../data/rolesMock';
import styles from '../EditorCanvas.module.css';

/**
 * Renders the "Role" component, which is a non-nestable, atomic variable.
 * This component is intentionally simple: it does not use `useDroppable` or
 * `SortableContext` because it cannot accept child components. Its purpose
 * is to display the selected role's information in a clear, top-down layout.
 */
export const RoleRenderer = ({ component, mode }: RendererProps<DynamicComponent>) => {
  const { isSelected, isDragging, isOnlySelection, sortableProps, selectionProps, dndListeners } = useEditorInteractions(component);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const roleInfo = roles[component.properties.roleType];

  const setMergedRefsForSortable = (node: HTMLDivElement | null) => {
    wrapperRef.current = node;
    sortableProps.ref(node);
  };

  // The core view logic is shared between the interactive canvas and the static preview.
  const RoleView = () => (
    <div className={styles.roleContainer}>
      <div className={styles.roleHeader}>
        <span className="material-symbols-rounded">person</span>
        <h4>{roleInfo?.label || 'Role'}</h4>
      </div>
      <p className={styles.roleDescription}>{roleInfo?.description}</p>
    </div>
  );

  if (mode === 'preview') {
    return <RoleView />;
  }

  // The interactive "canvas" mode adds selection, dragging, and toolbar capabilities.
  const wrapperClasses = `${styles.sortableItem} ${isDragging ? styles.isDragging : ''}`;
  const selectionClasses = `${styles.selectableWrapper} ${isSelected ? styles.selected : ''}`;

  return (
    <div className={wrapperClasses} {...sortableProps} data-id={component.id} ref={setMergedRefsForSortable}>
      <div className={selectionClasses} {...selectionProps} {...dndListeners}>
        {isOnlySelection && <CanvasSelectionToolbar componentId={component.id} referenceElement={wrapperRef.current} dndListeners={dndListeners} />}
        <RoleView />
      </div>
    </div>
  );
};