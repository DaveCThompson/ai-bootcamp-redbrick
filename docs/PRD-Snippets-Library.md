# PRD: Snippets Library (v1.1)

## Document Overview

| Version | Date | Author | Status |
|---------|------|--------|--------|
| 1.1 | 2025-12-26 | AI Agent | **DRAFT - AWAITING APPROVAL** |

---

## 1. Problem Statement

### Current State
Users building prompts in AI Bootcamp frequently need to reuse pieces of text across multiple prompts or sessions. Currently, users must:
- Copy/paste content from external sources
- Re-type common text blocks repeatedly
- Lose work when switching between projects

### Desired State
A built-in Snippets Library that allows users to:
- Save frequently used content as reusable "Snippets"
- Access their snippets from a dedicated panel in the sidebar
- Drag snippets onto the canvas to insert them into any prompt
- Detach ("unlink") snippet instances to make local edits without affecting the source

### Success Criteria
- Users can create, edit, and delete snippets
- Snippets persist across browser sessions (localStorage)
- Drag-and-drop creates read-only "Snippet Instances" on the canvas
- Snippet Instances can be "unlinked" to convert to editable TextBlocks
- System follows all existing architectural patterns and mandates

---

## 2. User Stories

| ID | Story | Priority |
|----|-------|----------|
| US-1 | As a user, I want to create a new snippet with a unique name and multi-line content so I can save it for later use. | **P0** |
| US-2 | As a user, I want to view, edit, and delete my saved snippets from a dedicated panel. | **P0** |
| US-3 | As a user, I want to drag a snippet from my library onto the canvas to insert it into my prompt structure. | **P0** |
| US-4 | As a user, I want to "unlink" a snippet on the canvas, converting it into a standard text block so I can make local modifications. | **P0** |
| US-5 | As a user, I want my snippets to persist across browser sessions. | **P0** |
| US-6 | As a user, I want a way to clear all my snippets with confirmation to prevent accidental data loss. | **P1** |

---

## 3. Feature Specification

### 3.1 Snippets Panel (Left Sidebar)

#### Location
A new section titled **"MY SNIPPETS"** within the "Prompt Elements" sidebar, positioned after the existing component groups.

#### Header
- Section title: "MY SNIPPETS" (uppercase, matching existing group title styling)
- Add button: `[+]` icon button in the header row
- Click action: Opens the "Create New Snippet" modal

#### Snippet List
- **Layout**: Vertical list, sorted alphabetically by name
- **Item Display**: Each row shows the snippet name with icon
- **Icon**: `text_snippet` (Material Symbol)
- **Hover Behavior**: 
  - Background lightens (matches `.dataNavItem` hover)
  - Two action icons appear on the right: Edit `[✏️]` and Delete `[🗑️]`
- **Drag Behavior**: Entire item is draggable via `useDraggable` from `@dnd-kit/core`

#### Empty State
When no snippets exist, display:
- Icon: `note_add` (24px, secondary color)
- Text: "No snippets yet"
- Subtext: "Click + to create one" (tertiary color, smaller font)

---

### 3.2 Snippet Instance (Canvas Component)

#### Visual Design
The Snippet Instance renders as a **collapsible accordion component**:

```
┌─────────────────────────────────────────┐
│ ▶  My Snippet Name                      │  ← Header (clickable)
└─────────────────────────────────────────┘

// When expanded:
┌─────────────────────────────────────────┐
│ ▼  My Snippet Name                      │  ← Header
├─────────────────────────────────────────┤
│ This is the full content of the         │  ← Content area
│ snippet, displayed read-only with       │
│ proper text wrapping.                   │
└─────────────────────────────────────────┘
```

#### States

| State | Visual Treatment |
|-------|------------------|
| **Default** | Collapsed accordion, no border visible |
| **Hover** | Faint grey border (`--canvas-block-border-hover`) |
| **Selected** | Blue border (`--canvas-block-border-selected`), toolbar visible |
| **Expanded** | Content area visible with smooth transition |

#### Interaction Model

| Action | Result |
|--------|--------|
| Single click on header | Toggle expand/collapse |
| Single click when collapsed | Also selects the component |
| Drag header | Reorder on canvas |
| Select + press Delete | Delete from canvas |
| Select + click Unlink | Convert to editable TextBlock |

#### Selection Toolbar
When selected, the standard `CanvasSelectionToolbar` appears with an additional **"Unlink"** button:
- Icon: `link_off` (Material Symbol)
- Tooltip: "Unlink from snippet"
- Position: After existing toolbar buttons, before the "More" menu

---

### 3.3 Snippet Modal (Create/Edit)

#### Trigger
- **Create**: Click `[+]` in the MY SNIPPETS header
- **Edit**: Click `[✏️]` on a snippet list item

#### Layout
```
┌─────────────────────────────────────────────────────┐
│  Create New Snippet          [×]                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Name *                                             │
│  ┌───────────────────────────────────────────────┐  │
│  │ My Snippet Name                               │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  Content                                            │
│  ┌───────────────────────────────────────────────┐  │
│  │ Enter your snippet content here...            │  │
│  │                                               │  │
│  │                                               │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│                        [Cancel]  [Save Snippet]     │
└─────────────────────────────────────────────────────┘
```

#### Field Specifications

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Name | Single-line text input | Yes | Non-empty, unique among snippets |
| Content | Multi-line textarea | No | None |

#### Button States
- **Save**: Disabled until Name has content
- **Cancel**: Always enabled, closes modal without saving

---

### 3.4 Unlink Behavior

When a user clicks "Unlink" on a selected Snippet Instance:

1. The `SnippetInstanceComponent` is removed from the canvas state
2. A new `WidgetComponent` is created in its place with:
   - `componentType: 'widget'`
   - `controlType: 'plain-text'`
   - `textElement: 'p'`
   - `content`: The snippet's content text
3. The new component appears at the same position in the parent's children array
4. The new component is automatically selected
5. A toast notification appears: "Snippet unlinked"

**Important**: This is a one-way, non-reversible operation. The TextBlock has no memory of being a snippet.

---

### 3.5 Synchronization Behavior

#### V1 (This Implementation)
Snippet Instances on the canvas are **snapshots**. They capture the snippet content at the time of creation and do **not** update when the source snippet is modified.

**Rationale**: Predictable behavior, simpler implementation, no risk of breaking existing prompts when editing snippets.

#### V2 (Future Consideration)
Automatic synchronization where editing a source snippet updates all instances. This feature is explicitly deferred to keep the initial scope focused.

---

### 3.6 Data Persistence

#### Storage
- **Location**: Browser `localStorage`
- **Key**: `ai-bootcamp-snippets`
- **Format**: JSON object mapping snippet IDs to snippet data

#### Schema
```typescript
interface Snippet {
  id: string;           // UUID
  name: string;         // User-provided name
  content: string;      // Snippet content
  createdAt: string;    // ISO timestamp
  updatedAt: string;    // ISO timestamp
}

type SnippetsStore = Record<string, Snippet>;
```

#### Clear All Snippets
- Location: Could be in Settings or as a button in the MY SNIPPETS section
- Requires confirmation dialog before proceeding
- Clears all snippets from localStorage

---

## 4. Integration Points & Potential Issues

### 4.1 Markdown Generation

> [!IMPORTANT]
> **OVERLOOKED ASPECT REQUIRING ATTENTION**

The `generateMarkdownRecursive` function in `markdownSelectors.ts` must handle the new `'snippet-instance'` component type. Without this, snippet content will **not appear** in the compiled prompt output.

**Required Change**: Add case for `'snippet-instance'` that outputs the stored content as plain text.

---

### 4.2 DnD Integration

The existing `handleAddNewComponent` in `useCanvasDnd.ts` already has a pattern for specialized handling (`isTemplate`). Snippets will follow the same pattern with `isSnippet` flag.

**Potential Issue**: The DnD data payload must include:
- `isSnippet: true`
- `snippetId: string`
- Full snippet content (to avoid async lookup during drop)

---

### 4.3 Copy Snippet Toolbar Action

The "Copy Snippet" button in `CanvasSelectionToolbar` uses `componentSnippetSelectorAtom` to generate markdown. This must work correctly for snippet instances.

**Resolution**: The `generateMarkdownRecursive` update (section 4.1) will automatically handle this.

---

### 4.4 DragOverlay Preview

`DndDragOverlay.tsx` must display a preview when dragging a snippet from the library. This should use the existing `BrowserItemPreview` component with the snippet's name and icon.

---

### 4.5 Hotkey System

`useEditorHotkeys.ts` may need consideration:
- Delete key should work on snippet instances ✓ (already handled by existing delete logic)
- No new hotkeys required for V1

---

### 4.6 Undo/Redo

All snippet-related canvas actions must be undoable:
- `SNIPPET_INSTANCE_ADD`: Adds component, undoable via existing history mechanism
- `SNIPPET_UNLINK`: Converts component, must track both old and new state

**Potential Issue**: The `SNIPPET_UNLINK` action modifies component type in-place. The undo system must correctly restore the original `SnippetInstanceComponent`.

---

### 4.7 Component Capabilities

`useComponentCapabilities.ts` determines which toolbar actions are available. Must add:
- `canUnlink`: `true` only for snippet instances

---

### 4.8 Context Menu

`CanvasContextMenu.tsx` should eventually include "Unlink" for snippet instances, but this can be deferred to a future enhancement.

---

## 5. Development Plan

### Phase 1: Data Layer (Foundation)

#### Task 1.1: Define Types
**File**: `src/types.ts`

Add new types to the existing type system:

```typescript
// New component type for snippet instances on canvas
export interface SnippetInstanceComponent extends BaseCanvasComponent {
  componentType: 'snippet-instance';
  name: string;  // Displayed in accordion header
  properties: {
    snippetId: string;   // Reference to source snippet (for potential future sync)
    content: string;     // Snapshot of content at time of creation
    isExpanded: boolean; // UI state for accordion
  };
}

// Update CanvasComponent union
export type CanvasComponent = 
  | ContainerComponent 
  | WidgetComponent 
  | DynamicComponent 
  | SnippetInstanceComponent;

// Update DndData
export interface DndData {
  // ... existing fields ...
  isSnippet?: boolean;
  snippetId?: string;
  snippetContent?: string;
}
```

#### Task 1.2: Create Snippets State Management
**File**: `src/data/snippetsAtoms.ts` (NEW)

```typescript
// Core atom with localStorage persistence
const snippetsBaseAtom = atomWithStorage<Record<string, Snippet>>('ai-bootcamp-snippets', {});

// Derived list for UI (sorted alphabetically)
export const snippetListAtom = atom((get) => {
  const snippets = get(snippetsBaseAtom);
  return Object.values(snippets).sort((a, b) => a.name.localeCompare(b.name));
});

// Write-only atoms for CRUD operations
export const addSnippetAtom = atom(null, (get, set, snippet: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>) => { ... });
export const updateSnippetAtom = atom(null, (get, set, { id, ...updates }: Partial<Snippet> & { id: string }) => { ... });
export const deleteSnippetAtom = atom(null, (get, set, id: string) => { ... });
export const clearAllSnippetsAtom = atom(null, (get, set) => { ... });

// Modal state
export const snippetModalAtom = atom<{ isOpen: boolean; editingSnippetId: string | null }>({ isOpen: false, editingSnippetId: null });
```

#### Task 1.3: Add Reducer Actions
**File**: `src/data/promptStateAtoms.ts`

Add to `HistoryAction` type and `commitActionAtom`:

```typescript
// New action types
| { type: 'SNIPPET_INSTANCE_ADD'; payload: { snippetId: string; snippetName: string; snippetContent: string; parentId: string; index: number } }
| { type: 'SNIPPET_UNLINK'; payload: { componentId: string } }
| { type: 'SNIPPET_TOGGLE_EXPAND'; payload: { componentId: string } } // May not need undo

// Implementation in reducer switch
case 'SNIPPET_INSTANCE_ADD': { ... }
case 'SNIPPET_UNLINK': { ... }
```

#### Task 1.4: Update Markdown Generation
**File**: `src/data/markdownSelectors.ts`

Add case in `generateMarkdownRecursive`:

```typescript
case 'snippet-instance':
  // Output the content directly as plain text
  output = component.properties.content || '';
  break;
```

---

### Phase 2: UI Components (Sidebar)

#### Task 2.1: Create SnippetsSection
**File**: `src/features/ComponentBrowser/SnippetsSection.tsx` (NEW)

Component that renders:
- Section header with title and add button
- List of `DraggableSnippetItem` components
- Empty state when no snippets

#### Task 2.2: Create DraggableSnippetItem
**File**: `src/features/ComponentBrowser/DraggableSnippetItem.tsx` (NEW)

Component for each snippet in the list:
- Uses `useDraggable` with snippet data payload
- Shows edit/delete icons on hover
- Triggers modal for edit, confirmation for delete

#### Task 2.3: Create SnippetModal
**File**: `src/features/ComponentBrowser/SnippetModal.tsx` (NEW)

Modal dialog using Radix Dialog:
- Controlled by `snippetModalAtom`
- Name + Content fields
- Create/Edit mode based on `editingSnippetId`

#### Task 2.4: Integrate into GeneralComponentsBrowser
**File**: `src/features/ComponentBrowser/GeneralComponentsBrowser.tsx`

Import and render `<SnippetsSection />` in the component list.

---

### Phase 3: Canvas Rendering

#### Task 3.1: Create SnippetInstanceRenderer
**File**: `src/features/EditorCanvas/renderers/SnippetInstanceRenderer.tsx` (NEW)

Accordion-based renderer:
- Uses Radix Collapsible for expand/collapse
- Follows existing renderer pattern (`useEditorInteractions`, merged refs, etc.)
- Read-only content display

#### Task 3.2: Add CSS Styles
**File**: `src/features/EditorCanvas/EditorCanvas.module.css`

Add styles for:
- `.snippetHeader`, `.snippetHeaderHover`
- `.snippetChevron`, `.snippetChevronExpanded`
- `.snippetContent`

#### Task 3.3: Update CanvasNode Router
**File**: `src/features/EditorCanvas/CanvasNode.tsx`

Add case for `'snippet-instance'`:

```typescript
case 'snippet-instance':
  return <SnippetInstanceRenderer component={comp} mode="canvas" />;
```

#### Task 3.4: Update DndDragOverlay
**File**: `src/features/EditorCanvas/DndDragOverlay.tsx`

Handle snippet drag preview (reuse `BrowserItemPreview`).

---

### Phase 4: DnD Integration

#### Task 4.1: Update useCanvasDnd
**File**: `src/data/useCanvasDnd.ts`

In `handleAddNewComponent`, add snippet handling:

```typescript
if (activeData.isSnippet) {
  commitAction({
    action: {
      type: 'SNIPPET_INSTANCE_ADD',
      payload: {
        snippetId: activeData.snippetId,
        snippetName: activeData.name,
        snippetContent: activeData.snippetContent,
        parentId,
        index
      }
    },
    message: `Add snippet '${activeData.name}'`
  });
  return;
}
```

---

### Phase 5: Toolbar & Capabilities

#### Task 5.1: Add canUnlink Capability
**File**: `src/data/useComponentCapabilities.ts`

```typescript
canUnlink: selectedComponents.length === 1 && 
           selectedComponents[0].componentType === 'snippet-instance'
```

#### Task 5.2: Add handleUnlink Action
**File**: `src/features/EditorCanvas/useCanvasActions.ts`

```typescript
const handleUnlink = () => {
  commitAction({
    action: { type: 'SNIPPET_UNLINK', payload: { componentId: selectedIds[0] } },
    message: 'Unlink snippet'
  });
  addToast({ message: 'Snippet unlinked', icon: 'link_off' });
};
```

#### Task 5.3: Add Unlink Button to Toolbar
**File**: `src/features/EditorCanvas/CanvasSelectionToolbar.tsx`

Conditionally render Unlink button when `canUnlink` is true.

---

## 6. Verification Plan

### Build Verification
```bash
npm run build  # Must complete with no TypeScript errors
npm run lint   # Must pass with no new errors
```

### Manual Test Cases

| ID | Test Case | Steps | Expected Result |
|----|-----------|-------|-----------------|
| T1 | Create snippet | Click [+], enter name "Test", enter content, click Save | Snippet appears in MY SNIPPETS list |
| T2 | Validation | Try to save with empty name | Save button is disabled |
| T3 | Edit snippet | Hover snippet, click Edit, modify, Save | Changes persist |
| T4 | Delete snippet | Hover snippet, click Delete, confirm | Snippet removed |
| T5 | Drag to canvas | Drag snippet to canvas | Collapsed accordion appears |
| T6 | Expand/Collapse | Click snippet header | Toggles with animation |
| T7 | Select snippet | Click on snippet instance | Blue border, toolbar visible |
| T8 | Unlink | Select, click Unlink | Converts to editable TextBlock |
| T9 | Edit unlinked | Double-click unlinked block | Inline editing activates |
| T10 | Persistence | Create snippet, refresh browser | Snippet still exists |
| T11 | Empty state | Clear all snippets | Empty state message shown |
| T12 | Markdown output | Add snippet to canvas, check output panel | Content appears in output |
| T13 | Copy snippet | Select snippet instance, click Copy | Clipboard contains content |
| T14 | Undo add | Add snippet, Ctrl+Z | Snippet removed from canvas |
| T15 | Undo unlink | Unlink snippet, Ctrl+Z | Re-links to snippet instance |

---

## 7. Files Affected

### New Files (5)
| Path | Purpose |
|------|---------|
| `src/data/snippetsAtoms.ts` | Snippet library state management |
| `src/features/ComponentBrowser/SnippetsSection.tsx` | Sidebar snippets section |
| `src/features/ComponentBrowser/DraggableSnippetItem.tsx` | Draggable snippet list item |
| `src/features/ComponentBrowser/SnippetModal.tsx` | Create/Edit modal |
| `src/features/EditorCanvas/renderers/SnippetInstanceRenderer.tsx` | Canvas accordion renderer |

### Modified Files (10)
| Path | Changes |
|------|---------|
| `src/types.ts` | Add `SnippetInstanceComponent`, `Snippet`, update unions |
| `src/data/promptStateAtoms.ts` | Add `SNIPPET_INSTANCE_ADD`, `SNIPPET_UNLINK` actions |
| `src/data/markdownSelectors.ts` | Handle `'snippet-instance'` in markdown generation |
| `src/features/ComponentBrowser/GeneralComponentsBrowser.tsx` | Import and render `SnippetsSection` |
| `src/features/EditorCanvas/CanvasNode.tsx` | Route `'snippet-instance'` to renderer |
| `src/features/EditorCanvas/DndDragOverlay.tsx` | Handle snippet drag preview |
| `src/features/EditorCanvas/EditorCanvas.module.css` | Snippet-specific styles |
| `src/data/useCanvasDnd.ts` | Handle `isSnippet` in drop logic |
| `src/data/useComponentCapabilities.ts` | Add `canUnlink` capability |
| `src/features/EditorCanvas/useCanvasActions.ts` | Add `handleUnlink` |
| `src/features/EditorCanvas/CanvasSelectionToolbar.tsx` | Add Unlink button |

---

## 8. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| localStorage quota exceeded | Low | Medium | Monitor size, provide clear all option |
| Undo/redo breaks with unlink | Medium | High | Careful testing of state restoration |
| Snippet accordion animation janky | Low | Low | Use Radix Collapsible for smooth animation |
| Nested hover bugs | Medium | Low | Follow existing `:has()` pattern |

---

## 9. Future Considerations (Not in Scope)

- **Sync on Edit**: Updating source snippet updates all instances
- **Snippet Categories/Folders**: Organizing large snippet libraries
- **Snippet Import/Export**: JSON file backup/restore
- **Cloud Sync**: Snippets stored on server across devices
- **Snippet Templates**: Pre-built snippet starters
