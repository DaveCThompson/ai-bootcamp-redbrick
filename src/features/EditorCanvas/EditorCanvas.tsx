// src/features/EditorCanvas/EditorCanvas.tsx
import React, { useRef, useEffect } from 'react'; // ⬅ Reverted import
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useDroppable } from '@dnd-kit/core';
import {
  canvasInteractionAtom,
  isPropertiesPanelVisibleAtom,
  selectionAnchorIdAtom,
  overDndIdAtom,
  selectedCanvasComponentIdsAtom,
  contextMenuTargetIdAtom,
  isContextMenuOpenAtom,
  contextMenuInstanceKeyAtom,
  isPreviewPaneVisibleAtom,
  copyAnimationStateAtom,
} from '../../data/atoms';
import { rootComponentIdAtom } from '../../data/promptStateAtoms';
import { useAutoScroller } from '../../data/useAutoScroller';
import { promptMarkdownAtom } from '../../data/markdownSelectors';
import { addToastAtom } from '../../data/toastAtoms';

import { CanvasNode } from './CanvasNode';
import { FloatingMultiSelectToolbar } from './CanvasUI';
import { CanvasContextMenu } from './CanvasContextMenu';
import { PromptPreviewPanel } from './PromptPreviewPanel';
import { Button } from '../../components/Button';
import { Switch } from '../../components/Switch';

import styles from './EditorCanvas.module.css';

const CANVAS_BACKGROUND_ID = '--canvas-background--';

const CanvasView = () => {
  const rootId = useAtomValue(rootComponentIdAtom);
  const [interactionState, setInteractionState] = useAtom(canvasInteractionAtom);
  const setIsPropertiesPanelVisible = useSetAtom(isPropertiesPanelVisibleAtom);
  const setAnchorId = useSetAtom(selectionAnchorIdAtom);
  const overId = useAtomValue(overDndIdAtom);
  const selectedIds = useAtomValue(selectedCanvasComponentIdsAtom);
  const setContextMenuTargetId = useSetAtom(contextMenuTargetIdAtom);
  const isMenuOpen = useAtomValue(isContextMenuOpenAtom);
  const setContextMenuInstanceKey = useSetAtom(contextMenuInstanceKeyAtom);
  const [isPreviewVisible, setIsPreviewVisible] = useAtom(isPreviewPaneVisibleAtom);

  const { setNodeRef: setBackgroundNodeRef } = useDroppable({ id: CANVAS_BACKGROUND_ID });
  
  const handleCanvasClick = (e: React.MouseEvent) => { /* ... (no changes) ... */ };
  const handleBackgroundClick = (e: React.MouseEvent) => { /* ... (no changes) ... */ };
  const handleCanvasContextMenu = (e: React.MouseEvent) => { /* ... (no changes) ... */ };

  const isOverBackground = overId === CANVAS_BACKGROUND_ID;
  const isRootSelected = selectedIds.length === 1 && selectedIds[0] === rootId;

  const promptCardClasses = [
    styles.promptCard,
    isOverBackground ? styles.isBackgroundTarget : '',
    isRootSelected ? styles.isRootSelected : '',
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={`${styles.canvasContainer} ${styles.panel}`} 
      onContextMenu={handleCanvasContextMenu}
    >
      <div className={styles.promptCardHeader}>
        <h2 className={styles.panelTitle}>Prompt Builder</h2>
        <div className={styles.previewToggleWrapper}>
          <span className={styles.previewToggleLabel}>Preview</span>
          <Switch 
            checked={isPreviewVisible}
            onCheckedChange={setIsPreviewVisible}
            aria-label="Toggle Preview Pane"
          />
        </div>
      </div>
      <CanvasContextMenu>
        <div ref={setBackgroundNodeRef} className={promptCardClasses} onClick={handleCanvasClick} onDoubleClick={handleBackgroundClick}>
          {rootId && <CanvasNode componentId={rootId} />}
        </div>
      </CanvasContextMenu>
      <FloatingMultiSelectToolbar />
    </div>
  );
}

export const EditorCanvas = () => {
  const isPreviewVisible = useAtomValue(isPreviewPaneVisibleAtom);
  const markdown = useAtomValue(promptMarkdownAtom);
  const addToast = useSetAtom(addToastAtom);
  const [copyAnimState, setCopyAnimState] = useAtom(copyAnimationStateAtom);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  
  useAutoScroller(editorContainerRef);

  useEffect(() => {
    if (copyAnimState === 'running') {
      const timer = setTimeout(() => {
        setCopyAnimState('idle');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [copyAnimState, setCopyAnimState]);

  const handleCopy = () => {
    void navigator.clipboard.writeText(markdown);
    addToast({ message: 'Prompt copied to clipboard', icon: 'content_copy' });
    setCopyAnimState('running');
  };

  return (
    <div className={styles.editorViewContainer} data-copy-animation-state={copyAnimState} ref={editorContainerRef}>
      <Button variant="primary" size="m" className={styles.floatingCopyButton} onClick={handleCopy}>
        <span className="material-symbols-rounded">content_copy</span>
        Copy Prompt
      </Button>
      <div 
        className={styles.contentWrapper} 
        data-preview-visible={isPreviewVisible}
      >
        <CanvasView />
        <PromptPreviewPanel />
      </div>
    </div>
  );
};