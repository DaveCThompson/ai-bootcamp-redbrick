# Strategy: Layout Refactor & Prompt Output

## Architectural Decision Record

### State Management
**Decision:** No new Jotai atoms. This is a UI refactor, not a state refactor.

**Rationale:**
- `promptMarkdownAtom` (derived) already generates the full prompt.
- The new `OutputPanel` simply reads this atom. No new subscriptions needed.
- Inline Role editing uses the existing `commitActionAtom` dispatch pattern.
- We are *simplifying* by **removing** two primitive atoms:
  - `isPropertiesPanelVisibleAtom` (deleted)
  - `isPreviewPaneVisibleAtom` (deleted)

### Pitfall Mitigations

| Pitfall | Component | Mitigation |
|---------|-----------|------------|
| **Role Dropdown + Selection Conflict** | `RoleComponentRenderer` | Add `e.stopPropagation()` on `<select>` `onPointerDown` to prevent parent selection handler from firing. |
| **Browser Copy + Drag Conflict** | `DraggableComponentItem` | Add `e.stopPropagation()` on Copy button click. Existing `distance: 8` activation constraint provides buffer. |
| **Snippet Generation for Browser** | N/A | Create `snippetUtils.ts` with a `generateSnippetFromComponent(type, props)` utility. |

### Data Flow Diagram

```ascii
+---------------------+       reads       +------------------------+
| canvasComponents   | ----------------> | promptMarkdownAtom      |
| ByIdAtom           |                   | (derived, full output)   |
+---------------------+                   +-----------+------------+
                                                      |
      +----------+----------+----------+--------------+
      |          |          |          |
      v          v          v          v
[CanvasView] [Readout]  [OutputPanel] [Copy Button]
                          (NEW)
```

### File Manifest (CRUD)

| Action | Path | Notes |
|--------|------|-------|
| **CREATE** | `src/features/OutputPanel/OutputPanel.tsx` | Main component |
| **CREATE** | `src/features/OutputPanel/OutputPanel.module.css` | Styles |
| **CREATE** | `src/features/OutputPanel/index.ts` | Barrel export |
| **CREATE** | `src/features/ComponentBrowser/DraggableComponentItem.tsx` | Extracted from inline |
| **CREATE** | `src/data/snippetUtils.ts` | Generate snippets for browser items |
| **MODIFY** | `src/App.tsx` | Swap `PropertiesPanel` → `OutputPanel`, remove atoms |
| **MODIFY** | `src/features/EditorCanvas/EditorCanvas.tsx` | Remove split-pane, remove `EditorControlsPill` |
| **MODIFY** | `src/features/EditorCanvas/renderers/RoleComponentRenderer.tsx` | Add inline `<select>` |
| **MODIFY** | `src/features/ComponentBrowser/GeneralComponentsBrowser.tsx` | Use new `DraggableComponentItem` |
| **MODIFY** | `src/data/atoms.ts` | Remove `isPropertiesPanelVisibleAtom`, `isPreviewPaneVisibleAtom` |
| **DELETE** | `src/features/PropertiesPanel/*` | Entire directory |
| **DELETE** | `src/features/EditorCanvas/EditorControlsPill.tsx` | No longer needed |
| **DELETE** | `src/features/EditorCanvas/PromptPreviewPanel.tsx` | Moved to OutputPanel |
| **DELETE** | `src/features/EditorCanvas/PromptPreviewPanel.module.css` | Moved to OutputPanel |

---

## IMPLEMENTATION BLUEPRINT

### Phase 1: Data Layer Cleanup
1. Remove `isPropertiesPanelVisibleAtom` from `atoms.ts`.
2. Remove `isPreviewPaneVisibleAtom` from `atoms.ts`.
3. Create `snippetUtils.ts` with `generateDefaultSnippet(componentType, dynamicType?, controlType?)`.

### Phase 2: New Output Panel
1. Create `OutputPanel.tsx`:
   - Read `promptMarkdownAtom`.
   - Render `<pre>` with markdown.
   - "Copy" button triggers `navigator.clipboard.writeText()` + toast.
2. Style with `.module.css` (match existing panel styles).
3. Update `App.tsx`:
   - Replace `<PropertiesPanel />` with `<OutputPanel />`.
   - Remove toggle logic for old panel.

### Phase 3: Canvas Simplification
1. Edit `EditorCanvas.tsx`:
   - Remove `PromptPreviewPanel` import and usage.
   - Remove `EditorControlsPill` import and usage.
   - Remove `previewGridCell` div.
   - Canvas now fills center space.
2. Delete `EditorControlsPill.tsx`, `PromptPreviewPanel.tsx`.

### Phase 4: Role Inline Editing
1. Edit `RoleComponentRenderer.tsx`:
   - Import `roles` from `rolesMock`.
   - Add `<select>` with `value={component.properties.roleType}`.
   - `onChange` dispatches `COMPONENT_UPDATE_DYNAMIC_PROPERTIES`.
   - `onPointerDown={e => e.stopPropagation()}`.

### Phase 5: Browser Snippet Copy
1. Create `DraggableComponentItem.tsx`:
   - Extract existing inline `DraggableListItem`.
   - Add `[data-hovered]` state or `:hover` CSS.
   - Add Copy button (Icon: `content_copy`).
   - `onClick` calls `generateDefaultSnippet()` + clipboard + toast.
2. Update `GeneralComponentsBrowser.tsx` to import new component.

### Phase 6: Cleanup
1. Delete `src/features/PropertiesPanel/` directory.
2. Run `npm run lint` to catch orphaned imports.
3. Verify build with `npm run build`.

### Key TypeScript Interfaces

```typescript
// src/data/snippetUtils.ts
export function generateDefaultSnippet(
  componentType: 'layout' | 'dynamic' | 'widget' | 'template',
  dynamicType?: 'role',
  controlType?: 'plain-text' | 'text-input'
): string;
```

```typescript
// src/features/ComponentBrowser/DraggableComponentItem.tsx
interface DraggableComponentItemProps {
  component: DraggableComponent;
  isTemplate?: boolean;
}
```

```typescript
// src/features/OutputPanel/OutputPanel.tsx
// No props. Reads from atoms only.
export const OutputPanel: React.FC = () => { ... }
```
