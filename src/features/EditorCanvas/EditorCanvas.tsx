// src/features/EditorCanvas/EditorCanvas.tsx
import React, { useRef, useEffect } from 'react';
import { useAtomValue, useSetAtom, useAtom } from 'jotai';
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
  editorLayoutModeAtom,
  EditorLayoutMode,
} from '../../data/atoms';
import { rootComponentIdAtom } from '../../data/promptStateAtoms';
import { useAutoScroller } from '../../data/useAutoScroller';

import { CanvasNode } from './CanvasNode';
import { FloatingMultiSelectToolbar } from './CanvasUI';
import { CanvasContextMenu } from './CanvasContextMenu';
import { ScreenToolbar } from './ScreenToolbar';
import { PromptPreviewPanel } from './PromptPreviewPanel';

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

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const { setNodeRef: setBackgroundNodeRef } = useDroppable({ id: CANVAS_BACKGROUND_ID });

  const setMergedRefs = (node: HTMLDivElement | null) => {
    canvasContainerRef.current = node;
    setBackgroundNodeRef(node);
  };
  
  useAutoScroller(canvasContainerRef);

  const handleCanvasClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (interactionState.mode !== 'selecting' || interactionState.ids[0] !== rootId || interactionState.ids.length > 1) {
      setInteractionState({ mode: 'selecting', ids: [rootId] });
      setIsPropertiesPanelVisible(true);
      setAnchorId(rootId);
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (interactionState.mode !== 'idle') {
        setInteractionState({ mode: 'idle' });
        setAnchorId(null);
      }
    }
  };

  const handleCanvasContextMenu = (e: React.MouseEvent) => {
    const targetElement = e.target as HTMLElement;
    const componentNode = targetElement.closest('[data-id]');
    const componentId = componentNode?.getAttribute('data-id') ?? null;
    
    setContextMenuTargetId(componentId);

    if (isMenuOpen) {
      setContextMenuInstanceKey(k => k + 1);
    }
  };

  const isOverBackground = overId === CANVAS_BACKGROUND_ID;
  const isRootSelected = selectedIds.length === 1 && selectedIds[0] === rootId;

  const promptCardClasses = [
    styles.promptCard,
    isOverBackground ? styles.isBackgroundTarget : '',
    isRootSelected ? styles.isRootSelected : '',
  ].filter(Boolean).join(' ');

  return (
    <CanvasContextMenu>
      <div 
        ref={setMergedRefs} 
        className={styles.canvasContainer} 
        onClick={handleBackgroundClick}
        onContextMenu={handleCanvasContextMenu}
      >
        <div className={promptCardClasses} onClick={handleCanvasClick}>
          <div className={styles.promptCardHeader}>
            {/* The main builder title is static to provide a consistent, symmetric UI with the preview panel. */}
            <h2 className={styles.panelTitle}>Prompt Builder</h2>
          </div>
          <div className={styles.canvasDroppableArea}>
            {rootId && <CanvasNode componentId={rootId} />}
          </div>
        </div>
        <FloatingMultiSelectToolbar />
      </div>
    </CanvasContextMenu>
  );
}

export const EditorCanvas = () => {
  const [layoutMode, setLayoutMode] = useAtom(editorLayoutModeAtom);
  const setIsPropertiesPanelVisible = useSetAtom(isPropertiesPanelVisibleAtom);

  // Sync properties panel visibility with the layout mode.
  useEffect(() => {
    if (layoutMode === 'preview') {
      setIsPropertiesPanelVisible(false);
    } else {
      // In split or builder mode, the properties panel is potentially visible.
      setIsPropertiesPanelVisible(true);
    }
  }, [layoutMode, setIsPropertiesPanelVisible]);
  
  const renderContent = () => {
    switch (layoutMode) {
      case 'builder':
        return <CanvasView />;
      case 'preview':
        return <PromptPreviewPanel isPrimaryView />;
      case 'split':
        return (
          <div className={styles.splitView}>
            <CanvasView />
            <PromptPreviewPanel isPrimaryView={false} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.editorViewContainer}>
      <ScreenToolbar
        layoutMode={layoutMode}
        onLayoutModeChange={(mode: EditorLayoutMode) => setLayoutMode(mode)}
      />
      <div className={styles.editorContent}>
        {renderContent()}
      </div>
    </div>
  );
};