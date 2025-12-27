# AI Bootcamp: Project Overview & Conventions

This document is the primary entry point for developers. It provides a high-level overview of the project's architecture, file structure, and coding conventions.

---

## Project Evolution: From Screen Studio to AI Bootcamp

This project began its life as **Screen Studio**, a flexible, high-craft form and layout builder designed for creating complex user interfaces. It featured a robust set of components, detailed layout controls (flexbox, grid), appearance properties, and a sophisticated state management system with reliable undo/redo.

The project is now evolving. To better serve the emerging need for structured AI prompt and workflow creation, we are pivoting to **AI Bootcamp**. This new direction embraces simplicity and structure over stylistic flexibility.

Key changes in this evolution include:
-   **A Simplified Component Model:** The "Layout Container" has become a purely structural "Context Container" with no visual styling options. Components like "Link" have been removed to narrow the project's focus.
-   **Focus on Hierarchy:** By removing layout and styling controls, the editor's primary function is now to help users build a clear, hierarchical structure for their content, which is ideal for complex AI prompts.
-   **Preservation of High-Craft UX:** The core principles of a stable canvas, reliable undo/redo, and an intuitive selection model from Screen Studio have all been preserved.

The architectural guidance that follows reflects the new, streamlined focus of AI Bootcamp.

---

## 1. Core Architectural Principles

-   **Structure Over Style:** The editor prioritizes clear, hierarchical structure above all else. Components are simple and serve distinct purposes. Visual styling and complex layout are intentionally omitted to keep the focus on the content and flow of the prompt.
-   **Single Source of Truth:** Every piece of data has one, and only one, unambiguous source of truth. State is managed centrally (Jotai), and content is separated from its presentation in the editor.
-   **State-Driven Appearance:** The UI reflects the application's state by changing the appearance of existing elements (via `data-*` attributes for selection, hover, etc.), not by swapping out chunks of the DOM. This ensures UI stability.
-   **Predictable Undo/Redo:** Every meaningful action is captured in a robust undo/redo history. This system restores not just the canvas state but also the user's selection state, ensuring that undoing an action feels like a true reversal of the last step.
-   **Visual Hierarchy:** The UI follows a strict background hierarchy (App Frame > Workspace > Content) to create depth without relying on skeletal borders or unnecessary nesting. The canvas is part of the workspace, not a floating element.

## 2. Directory Structure & Import Guidelines

This project uses a **feature-based architecture**. The goal is to group files by their application feature (e.g., `Editor`, `Settings`) to improve colocation and maintainability.

-   **/src**: Contains the application entry point (`main.tsx`), root container (`App.tsx`), and global type definitions.
-   **/src/features**: Contains the major, user-facing areas of the application.
-   **/src/components**: Contains only **truly generic and reusable** UI primitives.
-   **/src/data**: A consolidated directory for all non-visual logic and definitions (Jotai atoms, custom hooks, etc.).

**Import Rule:** Always use relative paths (`./`, `../`). This project does not use TypeScript path aliases.

## 3. State Management (Jotai)

The project uses **Jotai** for its minimal, atomic state management model.

-   **UI State (`src/data/atoms.ts`):** Manages panel visibility, active tabs, and the current interaction mode of the canvas (idle, selecting, editing).
-   **Core Application State (`src/data/promptStateAtoms.ts`):** The most critical state file. It manages the actual structure of the prompt being built and implements the entire undo/redo system using a **reducer pattern**. All mutations to the prompt structure **must** go through the `commitActionAtom`.

## 4. Canvas & Component Architecture

The canvas is built for intuitive interaction with a small, focused set of components. The rendering of these components is orchestrated by `CanvasNode.tsx`, which delegates to specialized renderers based on component type and properties.

-   **Context Container:** A purely structural container for organizing other components. It defaults to a simple vertical stack and has no configurable visual properties. It is the primary tool for creating user-defined hierarchy. Its children are standard, individually selectable canvas components.
-   **Template Container:** A specialized, locked container that renders a predefined set of questions as a cohesive, form-like unit. It is treated as a **single atomic block** on the canvas (selectable, draggable, and deletable as a whole). Its internal questions are not individually selectable and feature a high-craft, direct-input experience with native tab navigation.
-   **Section Header:** A simple text element for creating titles and subtitles.
-   **Text Block:** A simple multi-line text element for descriptive content.
-   **Variables (Text Input, Role, etc.):** Simple input placeholders that represent data collection points (variables) in a prompt or workflow.
    -   **Role:** A special variable that inserts a predefined persona and prompt snippet. It features an **inline dropdown** directly on the canvas for selecting the desired role, displaying the full prompt text below.
-   **Snippet Instance:** A reusable text block created from the user's Snippets Library. Renders as a **collapsible accordion** on the canvas showing the snippet name and content. Snippet instances are snapshots—they do not auto-update when the source snippet changes. Users can **unlink** a snippet instance to convert it into a plain text block.

### Unified Rendering Pattern
All canvas components are rendered through a unified set of renderer components located in `src/features/EditorCanvas/renderers/`. Each renderer accepts a `mode: 'canvas' | 'preview'` prop to separate its interactive editor appearance from its clean "final" appearance.

### Interaction Model
The editor uses an industry-standard selection model:
-   **Single Click:** Selects a component.
-   **Ctrl/Cmd + Click:** Toggles selection.
-   **Shift + Click:** Selects a range.
-   **Alt/Option + Click or Double-Click:** Enters inline text editing mode.
-   **Note:** Some components, like the **Template Container** and **Role**, are atomic and do not allow for the selection or dropping of internal parts.

## 5. Key File Manifest

### Data & State Management (`src/data/`)
*   **`atoms.ts`**: Defines all global **UI state** using Jotai atoms.
*   **`promptStateAtoms.ts`**: Implements the undo/redo system and manages the core canvas state.
*   **`snippetsAtoms.ts`**: Manages user-defined snippets with localStorage persistence and CRUD operations.
*   **`useCanvasDnd.ts`**: Encapsulates all drag-and-drop logic for the canvas.
*   **`useEditorHotkeys.ts`**: Centralizes all global keyboard shortcut logic.

### Features (`src/features/`)
*   **`EditorCanvas/`**: The main prompt-building feature.
    *   `EditorCanvas.tsx`: The main container component with core event handlers.
    *   `CanvasNode.tsx`: The orchestrator that routes component data to the correct renderer.
    *   `renderers/`: The directory containing the single source of truth for component rendering.
        *   `RoleRenderer.tsx`: Renders the Role component with inline dropdown for role selection.
        *   `TemplateContainerRenderer.tsx`: A specialized renderer for the form-like template block.
        *   `SnippetInstanceRenderer.tsx`: Renders snippet instances as collapsible accordions.
*   **`OutputPanel/`**: The right-hand panel displaying the compiled prompt markdown with copy functionality.
*   **`ComponentBrowser/`**: The left-hand panel for adding new components, with copy-to-clipboard snippet support.
    *   `SnippetsSection.tsx`: The "MY SNIPPETS" section with create/edit/delete functionality.
    *   `SnippetModal.tsx`: Modal for creating and editing user snippets.
