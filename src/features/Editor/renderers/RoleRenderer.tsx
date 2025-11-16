// src/features/Editor/renderers/RoleRenderer.tsx
// FIX: Removed unused 'React' import. 'useRef' is imported directly.
import { useRef } from 'react';
import { useAtomValue } from 'jotai';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { overDndIdAtom, dropPlaceholderAtom, activeDndIdAtom } from '../../../data/atoms';
import { DynamicComponent } from '../../../types';
import { RendererProps } from './types';
import { CanvasNode } from '../CanvasNode';
import { DropPlaceholder } from '../CanvasUI';
import { useEditorInteractions } from '../useEditorInteractions';
import { CanvasSelectionToolbar } from '../CanvasSelectionToolbar';
import { roles } from '../../../data/rolesMock';
import styles from '../EditorCanvas.module.css';

// --- Unified Renderer ---
export const RoleRenderer = ({ component, mode }: RendererProps<DynamicComponent>) => {
  const { isSelected, isDragging, isOnlySelection, sortableProps, selectionProps, dndListeners } = useEditorInteractions(component);
  const overId = useAtomValue(overDndIdAtom);
  const dropPlaceholder = useAtomValue(dropPlaceholderAtom);
  const activeDndId = useAtomValue(activeDndIdAtom);
  const containerContentRef = useRef<HTMLDivElement>(null);
  const { setNodeRef: setDroppableRef } = useDroppable({ id: component.id });
  const wrapperRef = useRef<HTMLDivElement>(null);

  const roleInfo = roles[component.properties.roleType];

  if (mode === 'preview') {
    return (
      <div className={styles.roleContainer}>
        <div className={styles.roleHeader}>
          <span className="material-symbols-rounded">person</span>
          <h4>{roleInfo?.label || 'Role'}</h4>
        </div>
        <div className={styles.roleContent}>
          {component.children.map(childId => <CanvasNode key={childId} componentId={childId} />)}
        </div>
      </div>
    );
  }

  const isEmpty = component.children.length === 0;
  const isOverContainer = overId === component.id;
  const isDragActive = !!activeDndId;

  const setMergedRefsForSortable = (node: HTMLDivElement | null) => {
    wrapperRef.current = node;
    sortableProps.ref(node);
  };
  const setMergedRefsForDroppable = (node: HTMLDivElement | null) => {
    containerContentRef.current = node;
    setDroppableRef(node);
  };

  const wrapperClasses = `${styles.sortableItem} ${isDragging ? styles.isDragging : ''}`;
  const selectionClasses = `${styles.selectableWrapper} ${isSelected ? styles.selected : ''}`;
  const containerClasses = [
    styles.roleContainer,
    isOverContainer ? styles['is-over-container'] : '',
    isDragActive ? styles['drag-active'] : '',
  ].filter(Boolean).join(' ');

  const parentRect = containerContentRef.current?.getBoundingClientRect();
  const showLinePlaceholder = dropPlaceholder?.parentId === component.id && dropPlaceholder.viewportRect && parentRect;

  return (
    <div className={wrapperClasses} {...sortableProps} data-id={component.id} ref={setMergedRefsForSortable}>
      <div className={selectionClasses} {...selectionProps} {...dndListeners}>
        {isOnlySelection && <CanvasSelectionToolbar componentId={component.id} referenceElement={wrapperRef.current} dndListeners={dndListeners} />}
        <div className={containerClasses}>
          <div className={styles.roleHeader}>
            <span className="material-symbols-rounded">person</span>
            <h4>{roleInfo?.label || 'Role'}</h4>
          </div>
          <p className={styles.roleDescription}>{roleInfo?.description}</p>
          <div ref={setMergedRefsForDroppable} className={styles.roleContent}>
            {isEmpty ? (
              <span className={styles.emptyText}>Drag prompt elements here</span>
            ) : (
              <SortableContext items={component.children} strategy={verticalListSortingStrategy}>
                {component.children.map(childId => <CanvasNode key={childId} componentId={childId} />)}
              </SortableContext>
            )}
            {showLinePlaceholder && <DropPlaceholder placeholderProps={{ viewportRect: dropPlaceholder.viewportRect!, isGrid: dropPlaceholder.isGrid, parentRect: parentRect }} />}
          </div>
        </div>
      </div>
    </div>
  );
};