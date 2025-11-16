Of course. Based on a thorough review of the project, here is a structured analysis of all remaining references to "screen" and "form". This document is intended to guide future refactoring efforts to fully align the codebase with the "AI Bootcamp" and "Prompt Builder" terminology.

---

# Audit of "Screen" and "Form" Terminology

This document identifies all files containing outdated terminology from the project's previous identity as "Screen Studio" and a generic "form builder." The goal is to replace these terms with "Prompt" and other more appropriate names to reflect the project's new focus on building AI prompts.

## 1. Core Type Definitions

The `FormComponent` type is a foundational element that needs to be renamed. This change will cascade to many other files.

### `src/types.ts`

-   **Line 18: `export interface FormComponent`**
    -   **Context:** This is the core interface for all input-style components.
    -   **Suggestion:** Rename to `WidgetComponent`. This is a more neutral term that covers both simple inputs ("Text Input") and content elements ("Section Header," "Text Block") that share the same underlying structure.
-   **Lines 42, 59, 60: `FormComponent`**
    -   **Context:** Usages of the `FormComponent` type in other type definitions (`CanvasComponent`) and interfaces (`DndData`).
    -   **Suggestion:** These will be resolved automatically when the primary interface is renamed.

## 2. State Management & Data Flow

State management atoms, actions, and data factories are deeply coupled to the old terminology.

### `src/data/historyAtoms.ts`

-   **Line 3: `import { ... FormComponent, ... }`**
    -   **Context:** Import of the outdated type.
    -   **Suggestion:** Update to import `WidgetComponent` after `types.ts` is changed.
-   **Line 8: `formName: string;`**
    -   **Context:** A key property in the `UndoableState` interface. This represents the title of the entire document being built.
    -   **Suggestion:** Rename to `promptName: string;`.
-   **Line 27 & 40: `COMPONENT_UPDATE_FORM_PROPERTIES`**
    -   **Context:** A history action type for updating widget properties.
    -   **Suggestion:** Rename to `COMPONENT_UPDATE_WIDGET_PROPERTIES`.
-   **Line 41: `FORM_RENAME`**
    -   **Context:** A history action type for renaming the entire prompt.
    -   **Suggestion:** Rename to `PROMPT_RENAME`.
-   **Line 46: `formName: "New Prompt"`**
    -   **Context:** The initial state value for the prompt's name.
    -   **Suggestion:** The key should be renamed to `promptName`.
-   **Lines 200 & 209: Usages in Reducer**
    -   **Context:** The `case` statements in the reducer for `COMPONENT_UPDATE_FORM_PROPERTIES` and `FORM_RENAME`.
    -   **Suggestion:** Update to match the new action type names.
-   **Line 247: `export const formNameAtom = ...`**
    -   **Context:** The exported Jotai atom used by the UI to display the prompt's name.
    -   **Suggestion:** Rename to `promptNameAtom`.

### `src/data/atoms.ts`

-   **Lines 21-22: `isFormNameEditingAtom`, `isFormNameMenuOpenAtom`**
    -   **Context:** Atoms controlling the UI state for editing the prompt's name.
    -   **Suggestion:** Rename to `isPromptNameEditingAtom` and `isPromptNameMenuOpenAtom`.

### `src/data/componentFactory.ts`

-   **Lines 3, 14, 18: `FormComponent`**
    -   **Context:** Type imports and usage.
    -   **Suggestion:** Rename to `WidgetComponent`.
-   **Line 12: `interface FormComponentOptions`**
    -   **Context:** The interface for the component creation function.
    -   **Suggestion:** Rename to `WidgetComponentOptions`.
-   **Line 17: `export const createFormComponent`**
    -   **Context:** The factory function for creating new widgets.
    -   **Suggestion:** Rename to `createWidgetComponent`.

## 3. CSS & Styling

CSS class names still reflect the old "form" concept, particularly for the main canvas area.

### `src/features/Editor/EditorCanvas.module.css`

-   **Line 11: `.formCard`**
    -   **Context:** The main class for the white card that contains all the prompt elements.
    -   **Suggestion:** Rename to `.promptCard`. This will require updating the usage in `EditorCanvas.tsx`.
-   **Lines 108 & 124: `.formItemContent`, `.formItemLabel`**
    -   **Context:** Classes used to style the wrapper and label of every individual component on the canvas.
    -   **Suggestion:** Rename to `.promptElementContent` and `.promptElementLabel` for better clarity. This will require updating all renderer components in `src/features/Editor/renderers/`.

## 4. UI Components & Renderers

Many components, from the properties panel to the canvas itself, use variables and render text based on the outdated names.

### `src/features/Editor/PropertiesPanel/FormEditor.tsx`

-   **File Name:** `FormEditor.tsx`
    -   **Context:** The file name itself is outdated.
    -   **Suggestion:** Rename the file to `WidgetEditor.tsx`.
-   **Throughout file:** Multiple instances of `FormComponent`, `COMPONENT_UPDATE_FORM_PROPERTIES`, etc.
    -   **Context:** These are direct consequences of the changes needed in `types.ts` and `historyAtoms.ts`.
    -   **Suggestion:** These will be resolved by updating them to `WidgetComponent`, `COMPONENT_UPDATE_WIDGET_PROPERTIES`, etc.

### `src/features/Editor/EditorCanvas.tsx`

-   **Line 10: `formNameAtom`**
    -   **Context:** Importing the state atom.
    -   **Suggestion:** Rename to `promptNameAtom`.
-   **Line 18: `const screenName = useAtomValue(formNameAtom);`**
    -   **Context:** The variable holding the prompt's name is called `screenName`.
    -   **Suggestion:** Rename to `promptName`.
-   **Line 60: `const formCardClasses = ...`**
    -   **Context:** Variable name for the main card's CSS classes.
    -   **Suggestion:** Rename to `promptCardClasses`.
-   **Line 73: `<h2>{screenName}</h2>`**
    -   **Context:** Rendering the prompt's name.
    -   **Suggestion:** Update to render the renamed `promptName` variable.

### `src/features/Editor/canvasUtils.ts`

-   **Line 14: `// Handle form components`**
    -   **Context:** A comment.
    -   **Suggestion:** Change to `// Handle widget components`.
-   **Line 18: `return component.properties.label || 'Form Field';`**
    -   **Context:** A fallback, user-facing name for a component.
    -   **Suggestion:** Change to `'Input Field'` or `'Widget'`.

### `src/features/Editor/renderers/*.tsx`

-   **Files:** `CheckboxRenderer.tsx`, `DropdownRenderer.tsx`, `PlainTextRenderer.tsx`, `RadioButtonsRenderer.tsx`, `TextInputRenderer.tsx`
    -   **Context:** All of these files import and use `FormComponent` and the `COMPONENT_UPDATE_FORM_PROPERTIES` action. They also use the `.formItemContent` and `.formItemLabel` CSS classes.
    -   **Suggestion:** A find-and-replace across these files will be necessary to update types to `WidgetComponent`, actions to `COMPONENT_UPDATE_WIDGET_PROPERTIES`, and CSS classes to the newly proposed names (`.promptElementContent`, etc.).

## 5. Documentation & Project Meta-Files

### `README.md`

-   **Lines 9 & 61: "Screen Studio"**
    -   **Context:** Used in the "Project Evolution" section to provide historical context.
    -   **Suggestion:** This usage is acceptable as it's explicitly historical. No change needed unless a complete rebranding is desired.
-   **Line 9: "form and layout builder"**
    -   **Context:** Describes the old project.
    -   **Suggestion:** Also acceptable as historical context.
-   **Line 64: "Form Fields (Text Input, etc.)"**
    -   **Context:** A heading in the "Canvas & Component Architecture" section.
    -   **Suggestion:** Rename to **"Variables (Text Input, etc.)"** to align with the UI in `promptElementsMock.ts`.

### `AGENTS.md`

-   **Line 3: "Screen Studio codebase"**
    -   **Context:** Historical context in the agent charter.
    -   **Suggestion:** Acceptable as-is.
-   **Line 39: `formComponentWrapper`**
    -   **Context:** An example CSS selector in an internal simulation walkthrough.
    -   **Suggestion:** This is a good candidate for an update to reflect the new CSS direction (e.g., `.promptElementContent`). It would make the agent's own documentation consistent.