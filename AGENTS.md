# Agent Charter & Execution Protocol

This document defines the operating protocol for AI agents working on the AI Bootcamp codebase. Its purpose is to maximize the probability of a correct, complete, and architecturally sound "one-shot" outcome for any given task.

## Prime Directive: One-Shot Excellence

The agent's primary goal is to deliver a complete and correct solution in a single response, minimizing the need for iterative correction. This is achieved by adhering to three pillars:

1.  **Holistic Analysis:** Before writing code, the agent must ingest and synthesize **all** provided context: the user's request, the PRD, the project `README.md`, `docs/STRATEGY-CSS.md`, and all relevant existing code files. The agent must build a complete mental model of the system's current state and the desired future state.
2. **Internal Simulation:** The agent must mentally "execute" the proposed changes and simulate their impact. This involves walking through the code paths, anticipating cascading effects (e.g., how changing a component's structure will affect its CSS), and pre-emptively identifying potential bugs, race conditions, or architectural violations.
3. **Comprehensive Delivery:** A "one-shot" response is not just code. It is a complete solution package, including all necessary file operations, code modifications, documentation updates, and a strategic verification plan.

## Standard Execution Algorithm (Internal)

For any non-trivial task (e.g., implementing a PRD), the agent must follow this internal thought process *before* generating the final output:

1.  **Ingestion & Synthesis:**
    *   Read and fully comprehend the entire user request and all context files.
    *   Identify the core problem statement and the key success criteria ("Definition of Done").
    *   Cross-reference the request with the architectural principles in `README.md`.

2.  **Impact Analysis & Dependency Mapping:**
    *   Create a definitive list of all files that will be **Created, Read, Updated, or Deleted (CRUD)**.
    *   Map the dependencies. For example: "Updating the component renderers will require changes in `CanvasNode.tsx` and `DndDragOverlay.tsx`." This prevents leaving dependent files in a broken state.

3.  **Virtual Refactoring (The Mental Walkthrough):**
    *   Simulate the changes in the most critical files first.
    *   **Example Simulation:** *"I will create a unified renderer with a `selectableWrapper`. The old CSS targeted `.selected > .formComponentWrapper`. This selector will fail. Therefore, I must update `EditorCanvas.module.css` to target `.selectableWrapper.selected` to prevent a visual regression."*
    *   **Example Simulation:** *"I will add a hover effect to `.selectableWrapper`. Since these wrappers can be nested, this will cause a hover-bubbling bug. The correct solution is to make the wrapper itself invisible and apply the hover styles to its direct child, ensuring only the top-most element appears hovered."*
    *   **Example Simulation (Cross-Contamination):** *"I am modifying `useEditorHotkeys`. This is a global hook. Does it run in Preview Mode? Yes. Will the hotkeys I'm adding have unintended consequences in a read-only view? Yes, the user could delete components from the preview. Therefore, I must add a guard clause at the top of my event handler: `if (viewMode !== 'editor') return;` to prevent this architectural leak."*
    *   This is the most critical step. The agent must act as its own QA engineer, actively trying to "break" its own plan.

4.  **Code Generation & Self-Correction:**
    *   Generate the full code for all modified files.
    *   Perform a final pass over the generated code, checking it against the **Technical Mandates** listed below. This is a fast, final check for common, known errors.


## Technical Mandates & Known Pitfalls

These are non-negotiable rules learned from the project's history. Violating them will result in rework.

1.  **The Rules of Hooks are Absolute.** All React Hooks (`useRef`, `useState`, `useAtomValue`, etc.) **must** be called unconditionally at the top level of a component. Never place a hook call inside a conditional block (`if/else`), loop, or nested function. If a component has different logic paths, hoist all hooks to the top.

2.  **`dnd-kit` Refs are Setters.** The `ref` provided by `useSortable` is a function (`(node) => void`), not a `RefObject`. It cannot be accessed with `.current`. To get a stable reference to a sortable element for other purposes (e.g., positioning a toolbar), create a separate `useRef` and use a merged ref setter function: `const setMergedRefs = (node) => { localRef.current = node; sortableRef(node); }`.

3.  **`dnd-kit` Clicks Require `activationConstraint` Delay.** If a draggable item also needs to be clickable (`onClick`, multi-select, etc.), the `PointerSensor` **must** be configured with a reasonable `delay` in its `activationConstraint` (e.g., `{ delay: 150, tolerance: 5 }`). Without a delay, the sensor is too sensitive and will immediately capture the `mousedown` event to initiate a drag, preventing the `click` event from ever firing. This is the root cause of "buttons not working" on draggable items.

4.  **Ensure DnD `data` Payloads are Complete.** When adding a new draggable item (e.g., from the Component Browser), its `data` property in `useDraggable` must be complete. A component may have a primary `type` (e.g., 'dynamic') and a secondary `sub-type` (e.g., `dynamicType: 'role'`). Failure to pass the complete data contract will cause the state reducer to create the wrong component, leading to subtle bugs in both the properties panel and the canvas renderer.

5.  **CSS Selectors Must Match the Final DOM.** When refactoring a component's JSX structure, the corresponding CSS Module **must** be updated. The agent is responsible for ensuring selectors for states like `:hover` and `.selected` target the new, correct class names and element hierarchy.

6.  **Solve Nested Hovers with Child Targeting.** To prevent the "hover bubbling" effect on nested components, the interactive wrapper (`.selectableWrapper`) should be stylistically invisible. The visual feedback (`background-color`, `border-color`) must be applied to its **direct child** (e.g., `.selectableWrapper:hover > .formItemContent`).

7.  **Use Renderer Routing for Specialization.** To keep component renderers clean and maintainable, avoid overloading a single renderer with complex conditional logic. For components with significantly different view states or interaction models (e.g., a standard vs. a template container), use a **routing pattern**. An orchestrator component (like `CanvasNode.tsx`) should inspect the component's properties and delegate rendering to a dedicated, specialized renderer. This encapsulates complexity and adheres to the Single Responsibility Principle.

8.  **Precision in Imports is Mandatory.** All package names must be exact (e.g., `@dnd-kit/core`, `@floating-ui/react-dom`). All relative paths must be correct. There is no room for typos.

9.  **"Ghost Errors" are Real.** If the user reports errors for files that have been deleted, the agent's first diagnostic step is to instruct the user to **restart the VS Code TypeScript Server**. This resolves stale cache issues.

10. **Editor Systems Must Be View-Aware.** Any hook or system that provides editor-specific functionality (e.g., `useEditorHotkeys`, `useEditorInteractions`) **must** be conditionally disabled if the application's view mode is not `'editor'`. Failure to do so will cause editor logic to leak into read-only views like "Preview," breaking the user experience. Always check the `appViewModeAtom` as a guard clause.

11. **`font-variation-settings` is Atomic and Requires Complete Definitions.** The `font-variation-settings` CSS property is a single, atomic unit. Setting it will **completely overwrite** any previous value; it does not merge. A common, hard-to-debug error is creating a high-specificity rule that only defines *some* of the variable font axes (e.g., only `opsz`). This will destructively reset all other axes (`FILL`, `wght`, `GRAD`) to their defaults, breaking animations and state-driven styles.
    -   **INCORRECT (Destructive):** `font-variation-settings: 'opsz' 24;`
    -   **CORRECT (Safe):** `font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;`
    -   **The Rule:** Any rule that modifies this property should redefine all four primary axes to ensure a predictable and stable result.

12. **Apply Concentric Radii to Wrapped Containers.** When a container wraps interactive elements (buttons, menu items), its `border-radius` must equal the inner element's radius plus the container's padding. This creates visually harmonious, concentric rounded corners.
    -   **Formula:** `container_radius = inner_element_radius + padding`
    -   **Current Implementation:** Button (`--radius-lg`, 10px) + padding (`--spacing-1`, 4px) = Container (`--radius-xl`, 12px)
    -   **Applies To:** `ActionToolbar`, `SelectionToolbar`, `.menu-popover`
    -   **Common Error:** Using an arbitrary container radius (e.g., `--radius-2xl`) without considering internal element radii creates a visually unbalanced UI.

13. **Use CSS `:has()` for Smart Nested Hover.** When nested selectable elements share the same hover style, use the `:has()` pseudo-class to suppress the parent's hover when a child is hovered. This prevents the "double-border" effect on nested components.
    -   **Pattern:** `.wrapper:hover:has(.wrapper:hover) { border-color: transparent; }`
    -   **Browser Support:** Chrome 105+, Safari 15.4+, Firefox 121+.

14. **Document-Level Click Handlers Must Exclude Radix Portals.** When implementing click-to-deselect functionality at the document level, the handler must check for clicks inside Radix UI portals (selects, popovers, menus). Failure to do so will cause dropdowns to close and selections to clear unexpectedly.
    -   **Required Selectors:** `[data-radix-popper-content-wrapper], [data-radix-select-content], [data-radix-portal], .menu-popover, [data-floating-ui-portal]`

15. **Mandate Button Typography.** All button text must be `font-weight: 600` (SemiBold) to ensure legibility and visual weight, especially on smaller screens or lower contrast settings.

16. **Mandate Icon Optical Sizing.** When using Material Symbols at sizes smaller than 20px (e.g., 16px), you **MUST** verify that `index.html` loads the correct `opsz` range (e.g., `15..48`). If the range starts at `20`, the browser will snap the icon to 20px, breaking the layout.

17. **Strict Concentric Radii Calculation.** Do not guess radii. **STOP AND COMPUTE:** `Inner Radius = Outer Radius - Padding`.
    -   *Example:* A standard menu item has a `10px` radius and `4px` padding. Therefore, any internal button or highlight must have a `6px` radius.
    -   *Violation:* Using `4px` (too sharp) or `8px` (too round) breaks the visual harmony.

18. **Avoid `as any` Casts.** Use specific union types or discriminated narrowing instead. Common fix: add a guard clause before the cast to narrow the type (e.g., `if (type === 'snippet') return;` before casting to a non-snippet union). Lint will flag `as any`—fix it properly, don't suppress.

19. **Use Global Form Styles for Modal Inputs.** Inputs and textareas in modals should rely on `forms.css` global styles, not inline styles. This ensures consistent focus rings (`--control-focus-ring-standard`), borders (`--surface-border-primary`), and hover states. Remove all inline `style={{}}` from form elements.

20. **Modal Close Buttons Must Use Button Component.** Never create bare `<button>` elements for modal close. Use `<Button variant="tertiary" size="s" iconOnly>` for proper hover states and consistent styling. This applies to all modal headers.

21. **Context Menu Must Set Target Before Opening.** All canvas components must spread `contextMenuProps` from `useEditorInteractions`. This handler sets `contextMenuTargetIdAtom` on right-click, ensuring the context menu always operates on the currently right-clicked item.
    -   **Pattern:** `<div {...selectionProps} {...contextMenuProps} {...dndListeners}>`
    -   **Failure Mode:** Without this, context menu operates on previously selected item, not the right-clicked one.

22. **Manage Radix Events Correctly (Bubble-Wrap Pattern).** When using Radix UI components (Select, Dropdown) inside interactive or draggable areas:
    -   **NEVER** use `stopPropagation` on the Radix *Trigger* (especially capture phase), as this breaks Radix's internal handlers.
    -   **ALWAYS** wrap the component in a `div` and use `onPointerDown={e => e.stopPropagation()}` and `onClick={e => e.stopPropagation()}` (Bubble Phase) on the wrapper. This isolates the event from parent handlers (like drag or deselection) without breaking the component.

23. **Align Focus Rings to Theme.** Do not use generic blue focus rings. Use `--control-focus-ring-standard` which maps to the application's theme color (`theme-300`, `#ffb6b6`).

24. **Canvas Typography Hierarchy.** Strict adherence to canvas child content typography:
    -   **Labels:** `0.85em`, `font-weight: 600`, Secondary color.
    -   **Content:** `0.95em`, `font-weight: 400`, `line-height: 1.5`.
    -   **Inputs:** `radius-sm` (6px) to match concentric wrapper (`radius-lg`).

25. **Respect Layout Background Hierarchy.** Follow the strict background color pattern for the app layout:
    -   **App Wrapper:** `--surface-bg-tertiary` (Darker frame)
    -   **Workspace/Canvas/Elements Panel:** `--surface-bg-secondary` (Flat, no floating cards)
    -   **Output/Content:** `--surface-bg-primary` (White, high contrast)
    -   **Violation:** Wrapping the canvas in a white card or making the side panel white breaks the desired depth hierarchy.

26. **Use Floating Panel Headers for Scroll-Under Effect.** Panel headers must use `position: sticky` with translucent backgrounds and `backdrop-filter: blur(var(--blur-glass))` to enable content scrolling underneath. This creates depth and maintains context.
    -   **Pattern:** Wrap scroll content in `.scrollFadeContainer` > `.scrollableContent`, place `.floatingPanelHeader` inside `.scrollableContent` at top.
    -   **Required Styles:** `position: sticky; top: 0; z-index: 10; background-color: var(--surface-bg-*-translucent); backdrop-filter: blur(var(--blur-glass));`
    -   **Scroll Fade:** Add `::after` pseudo-element with 48px gradient to indicate scrollable content.
    -   **Class References:** See `panel.module.css` for `.floatingPanelHeader`, `.scrollFadeContainer`, `.scrollableContent`.

