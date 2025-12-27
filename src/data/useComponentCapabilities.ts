// src/data/useComponentCapabilities.ts
import { useAtomValue } from 'jotai';
import { canvasComponentsByIdAtom, rootComponentIdAtom } from './promptStateAtoms';

/**
 * A hook that computes the possible actions for a given set of component IDs.
 * This centralizes the capability logic to be reused by the SelectionToolbar,
 * ContextMenu, and hotkeys.
 */
export const useComponentCapabilities = (selectedIds: string[]) => {
  const allComponents = useAtomValue(canvasComponentsByIdAtom);
  const rootId = useAtomValue(rootComponentIdAtom);

  const defaultState = {
    canRename: false, canDelete: false, canWrap: false, canUnwrap: false,
    canNudgeUp: false, canNudgeDown: false, canSelectParent: false, canUnlink: false,
    canCopySnippet: false,
  };

  if (selectedIds.length === 0) {
    return defaultState;
  }

  const isSingleSelection = selectedIds.length === 1;
  const primaryComponent = allComponents[selectedIds[0]];
  if (!primaryComponent) {
    return defaultState;
  }

  const isRootSelected = selectedIds.includes(rootId);
  const parent = allComponents[primaryComponent.parentId];

  // A locked component (like Template Container) can be deleted and moved,
  // but not renamed or structurally changed.
  if (isSingleSelection && primaryComponent.isLocked) {
    let canNudgeUp = false;
    let canNudgeDown = false;
    if (parent && parent.componentType === 'layout') {
      const index = parent.children.indexOf(primaryComponent.id);
      canNudgeUp = index > 0;
      canNudgeDown = index < parent.children.length - 1;
    }
    // Allow deletion and movement for locked items. Copy is always available.
    return { ...defaultState, canDelete: !isRootSelected, canNudgeUp, canNudgeDown, canCopySnippet: true };
  }

  // If any selected component is locked, bulk actions like wrap/delete are disabled.
  const anyLocked = selectedIds.some(id => allComponents[id]?.isLocked);
  if (anyLocked) {
    return defaultState;
  }

  const canDelete = !isRootSelected;
  const canWrap = !isRootSelected;
  // Copy snippet is always available for any non-root selection
  const canCopySnippet = !isRootSelected;

  const canUnwrap = isSingleSelection &&
    primaryComponent.componentType === 'layout' &&
    !isRootSelected &&
    primaryComponent.children.length > 0 &&
    !!parent;

  // canRename: false for root, snippet-instance (has fixed name from source)
  const canRename = isSingleSelection &&
    !isRootSelected &&
    primaryComponent.componentType !== 'snippet-instance';

  const canSelectParent = isSingleSelection && !!parent && parent.id !== rootId;

  let canNudgeUp = false;
  let canNudgeDown = false;
  if (isSingleSelection && parent && parent.componentType === 'layout') {
    const index = parent.children.indexOf(primaryComponent.id);
    canNudgeUp = index > 0;
    canNudgeDown = index < parent.children.length - 1;
  }

  const canUnlink = isSingleSelection && primaryComponent.componentType === 'snippet-instance';

  return {
    canRename,
    canDelete,
    canWrap,
    canUnwrap,
    canNudgeUp,
    canNudgeDown,
    canSelectParent,
    canUnlink,
    canCopySnippet,
  };
};
