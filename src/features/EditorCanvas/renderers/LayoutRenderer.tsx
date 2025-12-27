// src/features/EditorCanvas/renderers/LayoutRenderer.tsx
import React, { useRef } from 'react';
import { useAtomValue } from 'jotai';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { overDndIdAtom, dropPlaceholderAtom, activeDndIdAtom } from '../../../data/atoms';
import { ContainerComponent } from '../../../types';
import { RendererProps } from './types';
import { CanvasNode } from '../CanvasNode';
import { CanvasEmptyState } from '../CanvasEmptyState';
import { DropPlaceholder } from '../CanvasUI';
import { useEditorInteractions } from '../useEditorInteractions';
import { CanvasSelectionToolbar } from '../CanvasSelectionToolbar';
import styles from '../EditorCanvas.module.css';

// --- Pure View Component ---
const LayoutView = React.memo(({ children }: { children?: React.ReactNode }) => {
  // Simplified: Always a vertical stack with a default gap.
  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-4)', // Use a consistent, non-configurable gap
  };

  return (
    <div>
      <div data-arrangement="stack">
        <div style={contentStyle} className="layout-content-wrapper">{children}</div>
      </div>
    </div>
  );
});

// --- Unified Renderer ---
export const LayoutRenderer = ({ component, mode }: RendererProps<ContainerComponent>) => {
  const { isSelected, isDragging, isOnlySelection, isRoot, sortableProps, selectionProps, contextMenuProps, dndListeners } = useEditorInteractions(component);
  const overId = useAtomValue(overDndIdAtom);
  const dropPlaceholder = useAtomValue(dropPlaceholderAtom);
  const activeDndId = useAtomValue(activeDndIdAtom);
  const containerContentRef = useRef<HTMLDivElement>(null);
  const { setNodeRef: setDroppableRef } = useDroppable({ id: component.id });
  const wrapperRef = useRef<HTMLDivElement>(null);

  if (mode === 'preview') {
    return (
      <LayoutView>
        {component.children.map(childId => <CanvasNode key={childId} componentId={childId} />)}
      </LayoutView>
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
  // Root should not have selectableWrapper class to prevent hover/selection styling
  const selectionClasses = isRoot ? '' : `${styles.selectableWrapper} ${isSelected ? styles.selected : ''}`;
  const containerClasses = [
    styles.formComponentWrapper, styles.layoutContainer,
    isEmpty ? styles.layoutContainerEmpty : '',
    isOverContainer ? styles['is-over-container'] : '',
    isDragActive ? styles['drag-active'] : '',
  ].filter(Boolean).join(' ');

  const parentRect = containerContentRef.current?.getBoundingClientRect();
  const showLinePlaceholder = dropPlaceholder?.parentId === component.id && dropPlaceholder.viewportRect && parentRect;

  return (
    <div className={wrapperClasses} {...sortableProps} data-id={component.id} ref={setMergedRefsForSortable}>
      <div className={selectionClasses} {...(isRoot ? {} : { ...selectionProps, ...contextMenuProps, ...dndListeners })}>
        {isOnlySelection && !isRoot && <CanvasSelectionToolbar componentId={component.id} referenceElement={wrapperRef.current} dndListeners={dndListeners} />}


        <div className={containerClasses} data-is-root={isRoot}>
          <div ref={setMergedRefsForDroppable} className={styles.layoutContainerContent}>
            <LayoutView>
              {isEmpty ? (isRoot ? <CanvasEmptyState /> : <span className={styles.emptyText}>Drag components here</span>) : (
                <SortableContext items={component.children} strategy={verticalListSortingStrategy}>
                  {component.children.map(childId => <CanvasNode key={childId} componentId={childId} />)}
                </SortableContext>
              )}
            </LayoutView>
            {showLinePlaceholder && <DropPlaceholder placeholderProps={{ viewportRect: dropPlaceholder.viewportRect!, isGrid: dropPlaceholder.isGrid, parentRect: parentRect }} />}
          </div>
        </div>
      </div>
    </div>
  );
};