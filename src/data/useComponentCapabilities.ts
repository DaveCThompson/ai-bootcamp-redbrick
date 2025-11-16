// src/data/useComponentCapabilities.ts
import { useAtomValue } from 'jotai';
import { canvasComponentsByIdAtom, rootComponentIdAtom } from './historyAtoms';
import { LayoutComponent } from '../types';

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
    canNudgeUp: false, canNudgeDown: false, canSelectParent: false,
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
  const parent = allComponents[primaryComponent.parentId] as LayoutComponent | undefined;

  // Universal lock check for single-selected items
  if (isSingleSelection && primaryComponent.isLocked) {
    // A locked component can only be nudged up/down. It cannot be renamed, deleted, or structurally changed.
    let canNudgeUp = false;
    let canNudgeDown = false;
    if (parent) {
      const index = parent.children.indexOf(primaryComponent.id);
      canNudgeUp = index > 0;
      canNudgeDown = index < parent.children.length - 1;
    }
    return { ...defaultState, canNudgeUp, canNudgeDown };
  }

  const canDelete = !isRootSelected && selectedIds.every(id => !allComponents[id]?.isLocked);
  const canWrap = !isRootSelected && selectedIds.every(id => !allComponents[id]?.isLocked);
  
  const canUnwrap = isSingleSelection &&
    primaryComponent.componentType === 'layout' &&
    !isRootSelected &&
    primaryComponent.children.length > 0 &&
    !!parent &&
    !primaryComponent.isLocked;

  const canRename = isSingleSelection && !isRootSelected && !primaryComponent.isLocked;

  const canSelectParent = isSingleSelection && !!parent && parent.id !== rootId;

  let canNudgeUp = false;
  let canNudgeDown = false;
  if (isSingleSelection && parent) {
    const index = parent.children.indexOf(primaryComponent.id);
    canNudgeUp = index > 0;
    canNudgeDown = index < parent.children.length - 1;
  }

  return {
    canRename,
    canDelete,
    canWrap,
    canUnwrap,
    canNudgeUp,
    canNudgeDown,
    canSelectParent,
  };
};