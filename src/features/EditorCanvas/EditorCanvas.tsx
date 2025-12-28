// src/features/EditorCanvas/EditorCanvas.tsx
import { useRef, useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useDroppable } from '@dnd-kit/core';
import {
  overDndIdAtom,
  selectedCanvasComponentIdsAtom,
  copyAnimationStateAtom,
  canvasInteractionAtom,
} from '../../data/atoms';
import { rootComponentIdAtom } from '../../data/promptStateAtoms';
import { useAutoScroller } from '../../data/useAutoScroller';

import { CanvasNode } from './CanvasNode';
import { FloatingMultiSelectToolbar } from './CanvasUI';
import { CanvasContextMenu } from './CanvasContextMenu';

import styles from './EditorCanvas.module.css';

const CANVAS_BACKGROUND_ID = '--canvas-background--';

const CanvasView = () => {
  const rootId = useAtomValue(rootComponentIdAtom);
  const overId = useAtomValue(overDndIdAtom);
  const selectedIds = useAtomValue(selectedCanvasComponentIdsAtom);
  const setInteractionState = useSetAtom(canvasInteractionAtom);
  const { setNodeRef: setBackgroundNodeRef } = useDroppable({ id: CANVAS_BACKGROUND_ID });

  // Click on background deselects all, but ignore clicks inside Radix portals or toolbar
  const handleCanvasClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isInsideOverlay = target.closest(
      '[data-radix-popper-content-wrapper], [data-radix-select-content], [data-radix-portal], .menu-popover, [data-floating-ui-portal], [data-toolbar]'
    );
    if (isInsideOverlay) return;

    setInteractionState({ mode: 'idle' });
  };

  const isOverBackground = overId === CANVAS_BACKGROUND_ID;
  const isRootSelected = selectedIds.length === 1 && selectedIds[0] === rootId;

  const promptCardClasses = [
    styles.promptCard,
    isOverBackground ? styles.isBackgroundTarget : '',
    isRootSelected ? styles.isRootSelected : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.canvasContainer}>
      <div className={styles.canvasScrollContent}>
        <div className={styles.promptCardHeader}>
          <h2 className={styles.panelTitle}>Prompt Builder</h2>
        </div>
        <CanvasContextMenu>
          <div
            ref={setBackgroundNodeRef}
            className={promptCardClasses}
            onClick={handleCanvasClick}
          >
            {rootId && <CanvasNode componentId={rootId} />}
          </div>
        </CanvasContextMenu>
      </div>
      <FloatingMultiSelectToolbar />
    </div>
  );
}

export const EditorCanvas = () => {
  const [copyAnimState, setCopyAnimState] = useAtom(copyAnimationStateAtom);
  const setInteractionState = useSetAtom(canvasInteractionAtom);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll capability for drag-and-drop
  useAutoScroller(editorContainerRef);

  // Handle the "Copy Success" animation timeout
  useEffect(() => {
    if (copyAnimState === 'running') {
      const timer = setTimeout(() => {
        setCopyAnimState('idle');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [copyAnimState, setCopyAnimState]);

  // Document-level click listener for reliable deselection
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if click is inside a selectable wrapper
      const isInsideSelectable = target.closest('[data-id]');
      // Check if click is inside a popover, menu, select, or toolbar
      const isInsideOverlay = target.closest(
        '[data-radix-popper-content-wrapper], [data-radix-select-content], [data-radix-portal], .menu-popover, [data-floating-ui-portal], [data-toolbar]'
      );

      if (!isInsideSelectable && !isInsideOverlay) {
        setInteractionState({ mode: 'idle' });
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [setInteractionState]);

  return (
    <div
      className={styles.editorViewContainer}
      data-copy-animation-state={copyAnimState}
      ref={editorContainerRef}
    >
      <CanvasView />
    </div>
  );
};