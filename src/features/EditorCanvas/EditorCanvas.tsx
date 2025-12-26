// src/features/EditorCanvas/EditorCanvas.tsx
import { useRef, useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { useDroppable } from '@dnd-kit/core';
import {
  overDndIdAtom,
  selectedCanvasComponentIdsAtom,
  isPreviewPaneVisibleAtom,
  copyAnimationStateAtom,
} from '../../data/atoms';
import { rootComponentIdAtom } from '../../data/promptStateAtoms';
import { useAutoScroller } from '../../data/useAutoScroller';

import { CanvasNode } from './CanvasNode';
import { FloatingMultiSelectToolbar } from './CanvasUI';
import { CanvasContextMenu } from './CanvasContextMenu';
import { PromptPreviewPanel } from './PromptPreviewPanel';
import { EditorControlsPill } from './EditorControlsPill';

import styles from './EditorCanvas.module.css';

const CANVAS_BACKGROUND_ID = '--canvas-background--';

const CanvasView = () => {
  const rootId = useAtomValue(rootComponentIdAtom);
  const overId = useAtomValue(overDndIdAtom);
  const selectedIds = useAtomValue(selectedCanvasComponentIdsAtom);
  const { setNodeRef: setBackgroundNodeRef } = useDroppable({ id: CANVAS_BACKGROUND_ID });

  // Event handlers for canvas background interactions
  const handleCanvasClick = () => {
    // Logic handled by interaction hooks, this is just a surface
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
      <FloatingMultiSelectToolbar />
    </div>
  );
}

export const EditorCanvas = () => {
  const isPreviewVisible = useAtomValue(isPreviewPaneVisibleAtom);
  const [copyAnimState, setCopyAnimState] = useAtom(copyAnimationStateAtom);
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

  return (
    <div
      className={styles.editorViewContainer}
      data-copy-animation-state={copyAnimState}
      ref={editorContainerRef}
    >
      {/* Floating Controls Pill - Positioned absolute top center */}
      <EditorControlsPill />

      {/* Main Split Layout */}
      <div
        className={styles.contentWrapper}
        data-preview-visible={isPreviewVisible}
      >
        <CanvasView />
        <div className={styles.previewGridCell}>
          <PromptPreviewPanel />
        </div>
      </div>
    </div>
  );
};