// src/data/atoms.ts
import { atom } from 'jotai';
import { UniqueIdentifier, ClientRect } from '@dnd-kit/core';

// =================================================================
//                         App State
// =================================================================
export type AppViewMode = 'welcome' | 'editor' | 'references';
export type ToolbarTabId = 'lab-1' | 'lab-2' | 'lab-3' | 'lab-4';
export type SettingsLayoutMode = 'single-column' | 'two-column';

export const appViewModeAtom = atom<AppViewMode>('editor');
export const isSettingsMenuOpenAtom = atom(false);
export const activeToolbarTabAtom = atom<ToolbarTabId>('lab-1');
export const isComponentBrowserVisibleAtom = atom(false);
export const isPropertiesPanelVisibleAtom = atom(true);

// =================================================================
//                         View Preferences
// =================================================================
export const isToolbarCompactAtom = atom(false);

// =================================================================
//                         Settings State
// =================================================================
export const settingsLayoutModeAtom = atom<SettingsLayoutMode>('single-column');
export const focusIntentAtom = atom<string | null>(null);


// =================================================================
//                         Canvas State
// =================================================================

export type CanvasInteractionState =
  | { mode: 'idle' }
  | { mode: 'selecting'; ids: string[] }
  | { mode: 'editing'; id: string };

export const canvasInteractionAtom = atom<CanvasInteractionState>({ mode: 'idle' });

export const selectionAnchorIdAtom = atom<string | null>(null);

// --- Context Menu State ---
export const contextMenuTargetIdAtom = atom<string | null>(null);
export const isContextMenuOpenAtom = atom(false); 
export const contextMenuInstanceKeyAtom = atom(0);

// A write-only "action" atom to safely handle selection changes when a context menu is triggered.
export const updateSelectionOnContextMenuAtom = atom(
  null,
  (get, set) => {
    const targetId = get(contextMenuTargetIdAtom);
    if (!targetId) return;

    const currentInteraction = get(canvasInteractionAtom);
    const selectedIds = (currentInteraction.mode === 'selecting' ? currentInteraction.ids : (currentInteraction.mode === 'editing' ? [currentInteraction.id] : []));
        
    const isTargetAlreadySelected = selectedIds.includes(targetId);
    if (!isTargetAlreadySelected) {
      set(canvasInteractionAtom, { mode: 'selecting', ids: [targetId] });
      set(selectionAnchorIdAtom, targetId);
    }
  }
);
// --- End Context Menu State ---


export const selectedCanvasComponentIdsAtom = atom<string[]>((get) => {
  const state = get(canvasInteractionAtom);
  if (state.mode === 'selecting') return state.ids;
  if (state.mode === 'editing') return [state.id];
  return [];
});

export const activelyEditingComponentIdAtom = atom<string | null>((get) => {
  const state = get(canvasInteractionAtom);
  return state.mode === 'editing' ? state.id : null;
});

// Atoms to track the global state of a drag-and-drop operation.
export const activeDndIdAtom = atom<UniqueIdentifier | null>(null);
export const overDndIdAtom = atom<UniqueIdentifier | null>(null);

export const dropPlaceholderAtom = atom<{ parentId: string; index: number; viewportRect: ClientRect | null; isGrid: boolean; } | null>(null);

// Atom to signal a scroll-to-component request
export const scrollRequestAtom = atom<null | { componentId: string }>(null);