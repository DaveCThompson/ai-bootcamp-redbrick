# SPEC-ANATOMY

**Purpose:** This document serves as a "Visual Codebridge," mapping the pixels on the screen to the underlying code architecture. Use this to orient yourself when viewing screenshots or designing UI changes.

## 1. Visual Layout Legend

The application uses a standard 3-pane layout with a sidebar.

```text
+---+---------------------+------------------------------------------+----------------------+
| S |                     |                                          |                      |
| I |     LEFT PANEL      |               CENTER PANE                |     RIGHT PANEL      |
| D | (Component Browser) |             (Editor Canvas)              |   (Output/Props)     |
| E |                     |                                          |                      |
| B |                     |                                          |                      |
| A | [Search/Filter...]  |  [ Toolbar ]                             |  [ Properties... ]   |
| R |                     |                                          |                      |
|   | [Draggable Items]   |  [ Canvas Surface (Infinite Pan/Zoom) ]  |  [ JSON Output ]     |
|   |                     |    - Node 1                              |                      |
|   |                     |    - Node 2                              |                      |
|   |                     |                                          |                      |
+---+---------------------+------------------------------------------+----------------------+
```

---

## 2. Region Mapping

### [SIDEBAR] The Navigation Rail
**Visual:** The narrow vertical strip on the far left containing icons.
**Purpose:** Global navigation and mode switching.
**File:** `src/features/Sidebar/Sidebar.tsx`
**Key State:**
*   `primaryNavModeAtom` (Determines top-level mode: 'builder' | 'reference')
*   `sidebarNavItemAtom` (Determines active left-panel view, e.g., 'lab-1', 'welcome')

### [LEFT PANEL] Component Browser
**Visual:** The resizable panel immediately to the right of the Sidebar. Contains search inputs and grid/list of draggable items.
**Purpose:** Source of truth for available components. Users drag items from here onto the Canvas.
**File:** `src/features/ComponentBrowser/GeneralComponentsBrowser.tsx`
**Sub-Components:**
*   `ComponentCard.tsx` (The draggable thumbnail)
*   Draggable implementation: Uses `useDraggable` from `@dnd-kit/core`.
**Terminology:**
*   **"Lab"**: A specific collection or set of components (mapped to Sidebar items).
*   **"Draggable"**: An item in this panel that initiates a drag operation.

### [CENTER PANE] Editor Canvas
**Visual:** The large central area with the dot-grid background. Contains the actual interactive form/flow.
**Purpose:** The main workspace where users assemble applications. Supports panning, zooming, and free-form placement.
**File:** `src/features/EditorCanvas/EditorCanvas.tsx`
**Key Components:**
*   **Toolbar:** `src/features/EditorCanvas/CanvasToolbar.tsx` (Floating controls at bottom-center or top).
*   **Nodes:** `src/features/EditorCanvas/CanvasNode.tsx` (The rendered container for a component on the canvas).
*   **Selection:** `src/features/EditorCanvas/CanvasSelectionToolbar.tsx` (Contextual menu appearing near selected items).
**Key State:**
*   `canvasItemsAtom` (The comprehensive list of all nodes on canvas).
*   `selectedIdAtom` (ID of the currently selected node).
**Terminology:**
*   **"Canvas Item" / "Node"**: An instance of a component placed on the stage.
*   **"Drop Target"**: The canvas area accepting drops from the Left Panel.

### [RIGHT PANEL] Output & Properties
**Visual:** The resizable panel on the far right.
**Purpose:** Displays the real-time JSON structure of the canvas (Readout) and configuration controls for the selected item (Properties).
**File:** `src/features/OutputPanel/OutputPanel.tsx`
**Sub-Components:**
*   `ReadoutPanel.tsx` (Displays the 'Result' JSON).
*   (Properties view logic is often handled here or mapped to selection).
**Key State:**
*   `shouldShowPanelsAtom` (Global toggle for panel visibility).

---

## 3. Critical UI/UX Patterns

*   **Three-Pane Layout:** Implemented in `App.tsx` using `motion.div` for crossfade transitions between views (Welcome vs Builder vs Reference).
*   **Resizability:** Left and Right panels use `src/components/ResizablePanel.tsx`.
*   **Theme Tokens:** All colors/spacing use CSS variables (e.g., `--surface-bg-primary`, `--text-primary`) defined in `src/styles/theme.css`.
*   **Drag & Drop:** Powered by `@dnd-kit`. The `App.tsx` holds the `<DndContext>`, while `useCanvasDnd.ts` manages the logic.
