// src/features/EditorCanvas/renderers/RoleRenderer.tsx
import { useRef } from 'react';
import { DynamicComponent } from '../../../types';
import { RendererProps } from './types';
import { useEditorInteractions } from '../useEditorInteractions';
import { CanvasSelectionToolbar } from '../CanvasSelectionToolbar';
import { roles } from '../../../data/rolesMock';
import styles from '../EditorCanvas.module.css';

// --- Unified Renderer ---
export const RoleRenderer = ({ component, mode }: RendererProps<DynamicComponent>) => {
  // FIX: Removed container-specific hooks (useDroppable, etc.)
  const { isSelected, isDragging, isOnlySelection, sortableProps, selectionProps, dndListeners } = useEditorInteractions(component);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const roleInfo = roles[component.properties.roleType];

  const setMergedRefsForSortable = (node: HTMLDivElement | null) => {
    wrapperRef.current = node;
    sortableProps.ref(node);
  };

  // Common view logic for both canvas and preview
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