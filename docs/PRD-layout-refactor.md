# Product Requirements Document (PRD): Layout Refactor & Prompt Output

## 1. User Story
As a prompt engineer, I'm building structures, not styling components.
- I want a workspace that prioritizes the **output**. I want to see the generated prompt at all times (Right Panel).
- I want to edit properties (Rules, Roles) directly where they appear on the canvas, not in a disconnected "Properties Panel".
- I want to quickly grab snippets of potential components without dragging them in.

## 2. UX Specification

### A. The New Right Panel (Prompt Output)
- **Behavior**: Acts as a permanent "Preview" of the compiled Markdown.
- **Content**: Read-only text area (or syntax highlighted markdown).
- **Actions**:
    - **Header**: "Output"
    - **Actions**: "Copy Full Prompt" (Primary Action).
    - **No Edit Controls**: All editing moves to Canvas.

### B. Canvas & Interactions
- **Layout**: Expands to fill the space between Component Browser and Output Panel.
- **Role Component**:
    - **Current**: Static block, edit in Right Panel.
    - **New**: Integrated **Dropdown/Select** for "Role Type" visible directly on the card.
    - **Visuals**: "Form-like" feel.
- **Removed**: "Preview Mode" toggle (redundant).

### C. Component Browser (Left Panel)
- **Hover Interaction**: Hovering a list item reveals a "Copy Snippet" button on the right edge of the item.
- **Action**: Copies the *default* markdown for that component type to clipboard.
- **Feedback**: Toast notification ("Snippet copied").

## 3. Visual Blueprint

```ascii
+----------------+------------------------------------+---------------------+
|  App Header    |                                    |                     |
+----------------+------------------------------------+---------------------+
| [Browser]      | [ Canvas ]                         | [ Output Panel ]    |
|                |                                    |                     |
| > Header  [C]  |  +------------------------------+  | # ROLE              |
| > Para         |  |  Role: [ V Senior Dev      ] |  |                     |
| > Role         |  +------------------------------+  | Act as a senior...  |
|                |                                    |                     |
|                |  +------------------------------+  | ## Context          |
|                |  |  User Context                |  |                     |
|                |  |                              |  | (Live Preview)      |
|                |  |  Query: [                  ] |  |                     |
|                |  +------------------------------+  |                     |
|                |                                    |                     |
+----------------+------------------------------------+---------------------+
```

### 4. Technical Migration Strategy
1.  **Evict PropertiesPanel**: Delete `src/features/PropertiesPanel` and `RoleEditor.tsx`.
2.  **Migrate Role Logic**: Move role switching logic from `RoleEditor` to a `Select` component inside `RoleComponentRenderer.tsx`.
3.  **Create OutputPanel**: New feature `src/features/OutputPanel` to house the markdown preview.
4.  **Update Browser**: Refactor `DraggableListItem` in `src/features/ComponentBrowser` to own file, add hover state and copy logic.
5.  **Clean up**: Remove `isPreviewPaneVisibleAtom` (always true/irrelevant) and remove Split View from `EditorCanvas`.
