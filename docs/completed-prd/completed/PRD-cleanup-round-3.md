Excellent. Based on your feedback and a thorough impact analysis of each proposed change, I have prepared a final, hardened refactoring plan.

Each step includes a check for unintended consequences and a definitive action plan to ensure a safe and effective update.

***

## Hardened Refactoring Plan: AI Bootcamp

This plan outlines a series of changes to align the codebase with the project's new vision, improve maintainability, and remove architectural vestiges.


### 2. Naming Conventions: Improve Clarity

These changes align the code's language with the project's current purpose.

*   **Change A: Rename the `LayoutComponent` type to `ContainerComponent`**
    *   **Impact Analysis:**
        *   **Files Affected:** `src/types.ts` and all files that import and use the `LayoutComponent` type.
        *   **Unintended Consequences Check:**
            *   **Check:** Does this require changing the `componentType` *value* in the data, which is currently `'layout'`?
            *   **Result:** No. The change should only apply to the TypeScript *type name* (e.g., `export interface ContainerComponent ...`). The underlying data `componentType: 'layout'` should **not** be changed to maintain compatibility and avoid breaking logic that uses string comparisons.
    *   **Conclusion:** A safe and valuable change for developer clarity.

*   **Change B: Rename `src/data/historyAtoms.ts` to `src/data/promptStateAtoms.ts`**
    *   **Impact Analysis:**
        *   **Files Affected:** The file itself and every file that imports from it.
        *   **Unintended Consequences Check:**
            *   **Check:** Does this create naming collisions or confusion?
            *   **Result:** No, it resolves confusion. `promptStateAtoms.ts` more accurately describes the file's role as the central manager of the prompt's data structure, not just the undo/redo history.
    *   **Conclusion:** A safe, purely organizational improvement.

*   **Action Plan:**
    1.  In `src/types.ts`, change `export interface LayoutComponent` to `export interface ContainerComponent`. Update all type annotations that use `LayoutComponent`.
    2.  Rename the file `src/data/historyAtoms.ts` to `src/data/promptStateAtoms.ts`.
    3.  Globally find and replace all import paths from `'./historyAtoms'` or `'../data/historyAtoms'` to `'./promptStateAtoms'` or `'../data/promptStateAtoms'`.

### 3. Folder Structure: Flatten Features

This change implements the "feature-based architecture" principle more strictly.

*   **Change:** Promote the primary sub-directories of `/src/features/Editor` to be top-level features.
*   **Impact Analysis:**
    *   **Files Affected:** This is a large-scale move of dozens of files and will require updating import paths across the entire application, especially in `App.tsx`.
    *   **Unintended Consequences Check:**
        *   **Check:** Will this break relative `../` imports within the moved files?
        *   **Result:** Yes. This is the primary risk. For example, a file moved from `Editor/PropertiesPanel/` to `PropertiesPanel/` will need its data hook imports changed from `../../data/atoms` to `../data/atoms`. This requires careful, systematic updates.
        *   **Check:** Will this affect CSS module imports?
        *   **Result:** Yes. Any relative imports of CSS modules between the moved features will also need path updates.
    *   **Conclusion:** This is a high-effort, medium-risk change that provides a significant long-term architectural benefit. It should be performed as a single, focused task.

*   **Action Plan:**
    1.  Create the following new directories in `/src/features/`: `EditorCanvas`, `MainToolbar`, `PropertiesPanel`.
    2.  Move the contents of `src/features/Editor/PropertiesPanel/` into `src/features/PropertiesPanel/`.
    3.  Move `MainToolbar.tsx` and `MainToolbar.module.css` into `src/features/MainToolbar/`.
    4.  Move all remaining files from `src/features/Editor/` (e.g., `EditorCanvas.tsx`, `CanvasNode.tsx`, the `renderers/` directory, etc.) into the new `src/features/EditorCanvas/`.
    5.  Delete the now-empty `/src/features/Editor/` directory.
    6.  Update all `import` statements across the entire project to reflect these new file locations.

### 4. Component & Logic Simplification

These actions remove unused and legacy code.

*   **Change A: Delete Vestigial `ScreenToolbar.tsx` and `HeaderMenu.tsx` Components**
    *   **Impact Analysis:**
        *   **Files Affected:** `src/components/ScreenToolbar.tsx` and `src/features/AppHeader/HeaderMenu.tsx`.
        *   **Unintended Consequences Check:**
            *   **Check:** Are these components imported or rendered anywhere?
            *   **Result:** A full-text search confirms `ScreenToolbar` is not used. `HeaderMenu.tsx` is also not used; its logic was consolidated directly into `AppHeader.tsx`. Both are safe to delete.
    *   **Conclusion:** Very safe, pure code cleanup.

*   **Change B: Remove `dropdown` and `radio-buttons` Variants**
    *   **Impact Analysis:**
        *   **Files Affected:** `WidgetEditor.tsx`, `DropdownRenderer.tsx`, `RadioButtonsRenderer.tsx`, `CanvasNode.tsx`, `DndDragOverlay.tsx`.
        *   **Unintended Consequences Check:**
            *   **Check:** Does removing the renderers and UI options break the core state logic?
            *   **Result:** No. The reducer logic in `promptStateAtoms.ts` handles component properties generically. By removing the ability for users to *create* these variants from the UI, we effectively deprecate them without breaking the system.
    *   **Conclusion:** A safe change that correctly aligns the component model with the project's simplified vision.

*   **Action Plan:**
    1.  Delete `src/components/ScreenToolbar.tsx`, `src/components/ScreenToolbar.module.css`, and `src/features/AppHeader/HeaderMenu.tsx`.
    2.  In `WidgetEditor.tsx`, remove the `IconToggleGroup` for "Display as" and any logic related to the `dropdown` and `radio-buttons` types.
    3.  Delete the files `DropdownRenderer.tsx` and `RadioButtonsRenderer.tsx`.
    4.  In `CanvasNode.tsx` and `DndDragOverlay.tsx`, remove the `case 'dropdown':` and `case 'radio-buttons':` blocks from the renderer routing logic.

### 5. Documentation & Styling Cleanup

Final cleanup to consolidate documentation and reduce CSS bundle size.


*   **Change A: Remove the Unused `appearance.css` System**
    *   **Impact Analysis:**
        *   **Files Affected:** `src/styles/appearance.css` and `src/styles/index.css`.
        *   **Unintended Consequences Check:**
            *   **Check:** Is the `data-appearance-type` attribute used by any component?
            *   **Result:** A full-text search of the project confirms this attribute is not in use. The system is a leftover from the previous project.
    *   **Conclusion:** Very safe change that removes dead code.

*   **Action Plan:**
    3.  Delete `src/styles/appearance.css`.
    4.  In `src/styles/index.css`, remove the line `@import url('./appearance.css') layer(components);`.