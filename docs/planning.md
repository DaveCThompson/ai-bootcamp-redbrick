Of course. I have reviewed and synthesized all audio notes and contextual project files.

Here is the high-level Product Requirements Document (PRD) for the transformation of "Screen Studio" into the "AI Bootcamp" prompt builder.

---

## **PRD: AI Bootcamp - Visual Prompt Builder**

### 1. Overview

This document outlines the requirements for refactoring the existing "Screen Studio" application into a new, single-purpose tool called "AI Bootcamp." The new application will be a visual prompt builder designed to help participants in an AI bootcamp learn, construct, and experiment with structured prompts. It will leverage the core drag-and-drop canvas from the original project but replace the form-building data model and UI with a system for creating modular, copyable prompts.

### 2. Problem & Goals

**Problem:** Learning effective prompt engineering requires understanding structure and modularity (e.g., the CRAFT framework). A raw text editor is an intimidating and unforgiving environment for beginners. Bootcamp participants need a guided, visual tool to compose prompts from pre-defined and custom pieces, helping them internalize best practices.

**Goals:**

*   **Provide an Intuitive Visual Interface:** Enable users to build complex prompts via drag-and-drop, making the structure of a good prompt tangible and easy to manipulate.
*   **Refactor the Core Data Model:** Replace the form-centric `CanvasComponent` architecture with a new, simpler `PromptPiece` model tailored for text, headings, and simple inputs.
*   **Establish a Clear, Single-Purpose UX:** Remove all extraneous features from the original application (e.g., Preview/Settings modes, complex data navigation, component wrapping) to create a focused prompt-building experience.
*   **Rebrand the Application:** Update the application's identity to reflect its new purpose and the "redbrick" brand.

### 3. Scope & Key Initiatives

**In Scope:**

*   **Header Refactor:** Implement a new top-level header with tabs for different bootcamp topics.
*   **Prompt Library (Left Panel):** A context-aware panel displaying draggable prompt pieces relevant to the selected topic.
*   **Prompt Builder (Center Canvas):** A vertical canvas where users can arrange, reorder, edit, and delete prompt pieces.
*   **Prompt Preview (Right Panel):** A read-only panel that displays a live, raw Markdown preview of the composed prompt.
*   **Core Interactions:**
    *   Drag-and-drop prompt pieces from the library to the canvas.
    *   Reorder pieces on the canvas.
    *   Edit text content and labels inline.
    *   Duplicate and delete individual pieces.
    *   Copy the complete, formatted prompt to the clipboard.
    *   Clear the entire canvas.

**Out of Scope:**

*   User accounts, saving/loading prompts.
*   Backend integration.
*   The original "Preview" and "Settings" modes and pages.
*   The "wrap in container" functionality and any nested layout capabilities.
*   Advanced logic (e.g., conditional display of prompt pieces).

### 4. UX/UI Specification & Wireframes

The application will use a three-column layout: Prompt Library (left), Prompt Builder Canvas (center), and Prompt Preview (right).

**Header:**
The header is simplified to contain the app identity and the main topic navigation.

```plaintext
+--------------------------------------------------------------------------------------+
| [menu] | AI Bootcamp [redbrick]   |  <Prompting 101>  <Vibe Coding>  <Image Gen>     |
+--------------------------------------------------------------------------------------+
// [redbrick] is a static, non-clickable badge.
// <Topic> tabs use the existing AnimatedTabs component for style and interaction.
```

**Main Application Layout:**

```plaintext
+--------------------------------------------------------------------------------------+
| [ App Header                                                                       ] |
+----------------------+-------------------------------------+-------------------------+
| [ Prompt Library   ] | [ Prompt Builder Canvas           ] | [ Prompt Preview      ] |
|                      |                                     |                         |
|  - Draggable Item  | | +-------------------------------+ | | ## Context            |
|  - Draggable Item  | | | [drag] ## Context             | | |                       |
|  ...               | | | [ Enter context here...     ] | | | This is the context   |
|                      | | +-------------------------------+ | | the user entered.     |
|                      | |                                     | |                       |
|                      | | +-------------------------------+ | | ## Role               |
|                      | | | [drag] ## Role                | | |                       |
|                      | | | [ Dropdown: Expert Coder  v ] | | | You are an expert...  |
|                      | +-------------------------------+ | |                         |
|                      |                                     | | [ Copy ]              |
+----------------------+-------------------------------------+-------------------------+
// Layout uses var(--surface-bg-tertiary) for the background.
// Panels are separated by a 1px var(--surface-border-secondary) border.
```

**Prompt Piece on Canvas (Selected State):**

```plaintext
+------------------------------------------------------------------+
| [drag] ## Context                                                |
|                                                                  |
| [ This is the user-editable text area for the context.         ] |
|                                                                  |
+------------------------------------------------------------------+
// Wrapper uses a 1px border of var(--control-border-selected).
// Wrapper background is var(--control-bg-selected).
// Spacing between pieces uses a gap of var(--spacing-4).
```

### 5. Architecture & Implementation Plan

*   **State Management:** The core change will be in `src/data/historyAtoms.ts`. The normalized `canvasComponentsByIdAtom` will be replaced by a single atom representing the canvas state: `promptPiecesAtom = atom<PromptPiece[]>`. This simplifies the data structure to a flat array, which is ideal for a vertical list. The undo/redo `commitActionAtom` will be refactored to operate on this new array with actions like `PIECE_ADD`, `PIECE_UPDATE`, `PIECE_REORDER`.
*   **Data Flow:**
    1.  The `AppHeader` tabs will update a new global atom, `activeBootcampTopicAtom`.
    2.  The `PromptLibrary` component will read this atom and display the corresponding list of draggable `PromptPiece` templates.
    3.  Dragging a piece to the canvas will add it to the `promptPiecesAtom` array.
    4.  The `EditorCanvas` will map over `promptPiecesAtom` and render each piece using a new set of renderer components.
    5.  The `PromptPreview` panel will also subscribe to `promptPiecesAtom` and use a new hook, `useGeneratedPrompt()`, to compute and display the final Markdown string in real-time.
*   **Component Architecture:** The existing renderer pattern will be adapted. New, simplified renderers will be created for each `PromptPiece` type (e.g., `HeadingRenderer`, `TextContentRenderer`). The `useEditorInteractions` hook will be simplified to remove logic related to wrapping and nesting.

### 6. File Manifest

*   **`/` (Root)**
    *   `package.json` `[MODIFIED]`
    *   `index.html` `[MODIFIED]`
*   **`/src`**
    *   `App.tsx` `[MODIFIED]`
    *   `types.ts` `[MODIFIED]`
*   **`/src/data`**
    *   `atoms.ts` `[MODIFIED]` (Remove view modes, add `activeBootcampTopicAtom`)
    *   `historyAtoms.ts` `[MODIFIED]` (Complete overhaul of core state)
    *   `useCanvasDnd.ts` `[MODIFIED]` (Simplify drop logic for a flat list)
    *   `useEditorHotkeys.ts` `[MODIFIED]` (Remove old hotkeys like wrap/unwrap)
    *   `navigator.js` `[DELETED]`
*   **`/src/features/AppHeader`**
    *   `AppHeader.tsx` `[MODIFIED]`
    *   `FormNameEditor.tsx` / `.module.css` `[DELETED]`
    *   `FormNameMenu.tsx` `[DELETED]`
    *   `ScreenTypeBadge.tsx` / `.module.css` `[DELETED]`
*   **`/src/features/ComponentBrowser`** (To be renamed to `/src/features/PromptLibrary`)
    *   `ComponentBrowser.tsx` -> `PromptLibrary.tsx` `[MODIFIED]`
    *   `DraggableListItem.tsx` `[MODIFIED]`
    *   `dataNavigatorAtoms.ts` `[DELETED]`
    *   ... (other files in this directory will be deleted or heavily refactored)
*   **`/src/features/DataNavigator`**
    *   (Entire Directory) `[DELETED]`
*   **`/src/features/Editor`**
    *   `EditorCanvas.tsx` `[MODIFIED]`
    *   `CanvasNode.tsx` -> `PromptPieceNode.tsx` `[MODIFIED]`
    *   `useCanvasActions.ts` `[MODIFIED]` (Remove wrap/unwrap actions)
    *   `useComponentCapabilities.ts` `[MODIFIED]` (Remove wrap/unwrap capabilities)
    *   `useEditorInteractions.ts` `[MODIFIED]`
    *   `MainToolbar.tsx` / `.module.css` `[DELETED]`
*   **`/src/features/Editor/PropertiesPanel`** (To be renamed to `/src/features/PromptPreview`)
    *   `PropertiesPanel.tsx` -> `PromptPreview.tsx` `[NEW]`
    *   (All other files in this directory) `[DELETED]`
*   **`/src/features/Settings`**
    *   (Entire Directory) `[DELETED]`
*   **`/src/features/Preview`**
    *   (Entire Directory) `[DELETED]`

### 7. Unintended Consequences Check

*   **`useEditorHotkeys.ts`:** This is a global hook. It must be carefully audited to remove any hotkeys that are no longer valid (e.g., `Cmd+G` for Wrap).
*   **`types.ts`:** The removal of `LayoutComponent` and modification of `FormComponent` will have cascading effects. A full project-wide type-check will be necessary after the changes.
*   **Global CSS (`index.css`, `semantics.css`, etc.):** While no direct changes are planned, a review is needed to ensure that styles previously targeting form elements don't unintentionally affect the new prompt piece components.

### 8. Risks & Mitigations

*   **Risk:** The refactor of `historyAtoms.ts` is significant and could break the undo/redo functionality.
    *   **Mitigation:** This should be the first major technical task. The new `PromptPiece[]` state model and its associated reducer logic must be fully functional and tested before building the new UI components that depend on it.
*   **Risk:** Drag-and-drop logic in `useCanvasDnd.ts` was designed for a nested tree structure and may be complex to adapt to a simple list.
    *   **Mitigation:** Simplify aggressively. The new logic only needs to handle reordering within a single flat list. All logic related to dropping *into* containers can be removed, which should significantly reduce complexity.

### 9. Definition of Done

*   [ ] All files and directories marked for deletion are removed from the project.
*   [ ] The application is rebranded to "AI Bootcamp" and "redbrick" in all user-facing areas.
*   [ ] The new header with topic tabs is implemented and functional.
*   [ ] The left panel correctly displays a list of draggable prompt pieces based on the selected topic.
*   [ ] Users can drag pieces to the canvas to build a prompt.
*   [ ] Users can reorder, edit, duplicate, and delete pieces on the canvas.
*   [ ] The right panel correctly displays a live Markdown preview of the canvas content.
*   [ ] The "Copy Prompt" and "Clear" buttons are fully functional.
*   [ ] Undo/Redo functionality works correctly with all new canvas actions.
*   [ ] The `README.md` is updated to reflect the new project's purpose and architecture.