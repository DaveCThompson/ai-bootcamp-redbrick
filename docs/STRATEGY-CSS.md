# CSS Strategy

High-level principles and patterns for writing CSS in this project. For specific token values and implementation details, see [SPEC-CSS.md](./SPEC-CSS.md).

---

## Core Principles

### 1. Master the Box Model, Especially Positioning

Before using `position: absolute` or `position: fixed`, answer:
-   **What is its "positioned ancestor"?** If none exists, it will be the viewport.
-   **How will it get its width and height?** Have I provided explicit dimensions or constraints?
-   Never assume an element will "just know" its size. You must declare it.

### 2. Diagnose, Don't Guess

When debugging a UI issue:
1.  **Isolate:** Use the browser inspector to find the exact element that is failing.
2.  **Inspect:** Analyze its "Computed" styles—what the browser *actually rendered*.
3.  **Hypothesize:** Form a hypothesis based on CSS fundamentals.
4.  **Test:** Use the browser's style editor to test your hypothesis in real-time.

### 3. Trust, but Verify the Final DOM

React components, UI libraries (Radix), and animation libraries (Framer Motion) can all add wrapper `divs`. Your React code is not the final source of truth—the browser's "Elements" panel is.

---

## Key Architectural Patterns

### The "Unwrapped" Layout Strategy

The application layout uses a specific background hierarchy to create depth without clutter:

1.  **App Wrapper (Tertiary):** The outermost container uses a darker tertiary background to frame the workspace.
2.  **Workspace (Secondary):** The main "raised" sheet uses the secondary background.
3.  **Panels & Canvas:**
    *   **Elements Panel:** Inherits the **Secondary** background (Flat).
    *   **Editor Canvas:** Inherits the **Secondary** background (Flat). It is **NO LONGER** a floating card. It fills the available space.
    *   **Output Panel:** Uses the **Primary (White)** background to stand out as the result/read area.

**Goal:** This creates a visual progression from "App Frame" -> "Workspace/Tools" -> "Final Output".

### The Concentric Radii Pattern

When a container wraps interactive elements (buttons, menu items), its `border-radius` must equal the inner element's radius plus the container's padding.

**Formula:** `container_radius = inner_element_radius + padding`

This creates visually harmonious, concentric rounded corners. See SPEC-CSS for current token values.

**Applies To:** `ActionToolbar`, `SelectionToolbar`, `.menu-popover`, Component Browser Items.

**Example (Component Browser):**
-   Container Radius: 10px (`--radius-lg`)
-   Padding/Spacing: 4px
-   Button Radius: `10px - 4px = 6px` (`--radius-sm`)

### The Shared Menu System

All list-based selection components use a shared, global stylesheet (`menu.css`):
1.  **`.menu-popover`**: Container with shape, shadow, padding, and `gap: 2px` between items.
2.  **`.menu-item`**: Consistent height, internal padding, and a `1px solid transparent` border that transitions on hover.

### The Material Symbols Variable Font System

A three-layer system controls icon appearance:
1.  **Font Loading:** Variable font loaded in `index.html` with `FILL,GRAD` axes.
2.  **Baseline:** Global defaults in `base.css` with all four axes + transition.
3.  **Control System:** State changes via `aria-*` attributes in `toggles.css`.

**Critical Rule:** The `font-variation-settings` property is **atomic**—every rule must define all four axes (`FILL`, `wght`, `GRAD`, `opsz`).

### The Canvas Block State Pattern

Canvas components use **borders to communicate state**, not to define structure. This reduces visual clutter from nested borders.

-   **Default:** `border-color: transparent` - No visible border at rest
-   **Hover:** `border-color: var(--canvas-block-border-hover)` - Faint grey
-   **Selected:** `border-color: var(--canvas-block-border-selected)` - Theme color

**Smart Nested Hover:** Use `:has()` to suppress parent hover when any internal content is hovered. This applies when a parent is NOT selected.

**Design Principle:** Only the deepest hovered element shows its border; parents remain invisible unless selected.

### The Input Attention Pattern

Editable input fields on the canvas use a subtle theme-tinted background to draw user focus, distinguishing them from read-only content.

-   **Editable inputs:** `background-color: var(--input-bg-attention)`
-   **Read-only content:** `background-color: var(--surface-bg-secondary_subtle)`

This visual hierarchy guides users to interactive elements without adding borders.

### The Component Browser Item Pattern

Draggable items in the Component Browser use a consistent pattern for hover-reveal actions:

1.  **Base:** Item uses `menu-item` class for consistent list styling (height, padding, hover background).
2.  **Actions Container:** Positioned absolutely at right, hidden by default (`opacity: 0`).
3.  **Hover Reveal:** On item hover, actions appear (`opacity: 1`) with 0.15s transition.
4.  **Button Stops:** Action buttons use `onPointerDown={e => e.stopPropagation()}` to prevent drag initiation.

**Why This Pattern:** Enables both dragging (via the item body) and quick actions (via dedicated buttons) without conflicting interactions.

### The Floating Panel Header Pattern

Panel headers use a translucent, sticky design that allows content to scroll underneath while maintaining visual context.

**Key Elements:**
1.  **Sticky Positioning:** Header uses `position: sticky; top: 0` to remain fixed while content scrolls.
2.  **Translucent Background:** 80% opacity with `backdrop-filter: blur(var(--blur-glass))` for glassmorphism effect.
3.  **Subtle Separation:** A faint `border-bottom` provides visual separation without heavy styling.
4.  **Consistent Height:** All panel headers use `var(--panel-header-height)` (44px) for visual harmony.

**Variants:**
-   **Secondary (default):** `--surface-bg-secondary-translucent` - For panels on secondary backgrounds.
-   **Primary:** `--surface-bg-primary-translucent` - For panels on white backgrounds (e.g., Output Panel).

**Scroll-Fade Gradient:**
Add a 48px gradient overlay at the bottom of scrollable containers to indicate more content below. This is achieved via `::after` pseudo-element with `pointer-events: none`.

**Class References:**
-   `panel.module.css`: `.floatingPanelHeader`, `.scrollFadeContainer`, `.scrollableContent`

### Page Transition Pattern

View transitions (e.g., Builder ↔ Reference) use a simple **crossfade** animation:
-   **Duration:** 0.2s
-   **Easing:** `easeOut`
-   **Variants:** `enter` (opacity: 0) → `center` (opacity: 1) → `exit` (opacity: 0)

This provides clean, unobtrusive transitions without directional movement.

### The Canvas Accordion Block Pattern

Canvas components that can expand/collapse use a unified accordion architecture:

**Structure:**
1. **AccordionHeader Component:** Shared header with icon, label, actions, and rotating chevron.
2. **Radix Collapsible:** For accessible expand/collapse state management.
3. **CSS Grid Animation:** Smooth expand/collapse via `grid-template-rows`.

**Key Behaviors:**
- **Header:** 44px height, full-width clickable area, hover background state.
- **Chevron:** 18px Material Symbol, rotates 180° when expanded.
- **Event Isolation:** Header click toggles collapse, stops propagation to parent selection.
- **State Management:**
  - Global state (undo-able) for content-critical accordions (e.g., Snippets).
  - Local React state for ephemeral UI accordions (e.g., Role, Template).

**Components Using This Pattern:**
- `SnippetInstanceRenderer` — Collapsible snippet content
- `RoleRenderer` — Collapsible role prompt text
- `TemplateContainerRenderer` — Collapsible form fields
- `LayoutRenderer` (non-root) — Non-collapsible header only

- `AccordionHeader.tsx` + `AccordionHeader.module.css`
- `.accordionContent` in `EditorCanvas.module.css`

### The Radix inside Draggable Pattern

When placing a Radix UI component (Select, Dropdown, Menu) inside a `dnd-kit` draggable item, a conflict occurs because both systems use pointer event capture.

**The Conflict:**
- `dnd-kit` needs `mousedown`/`pointerdown` to initiate drag.
- Radix triggers need `pointerdown` (capture phase) to open.
- Adding `e.stopPropagation()` to the Radix trigger prevents DnD, but also prevents Radix's own internal handlers if incorrect phase is used.

**The Solution:**
1.  **Do NOT** put `stopPropagation` on the Radix Trigger itself (especially capture phase).
2.  **DO** put `onPointerDown={e => e.stopPropagation()}` (bubble phase) on the direct wrapper of the interactive element.
3.  **DO** use `data-no-dnd="true"` attributes if using the `dnd-kit` sensor filtering strategy.

This ensures the user can click the dropdown without dragging the item, and Radix receives the events it needs to function.

### Pink Theme Alignment Strategy

The application uses a "Warm & Capable" aesthetic defined by the Pink/Red theme. To maintain brand consistency, all interactive focus states must align with this theme, avoiding generic browser blue.

**Global Mandate:**
- **Focus Rings:** MUST use `--control-focus-ring-standard` which maps to `theme-300` (Pink).
- **Selection Borders:** MUST use `theme-500` for strong selection states.
- **Tinted Backgrounds:** Use `theme-25` or `theme-50` for subtle active states (like toolbars or active inputs).

**Avoid:** Hardcoded `#3b82f6` or `blue-500` values for focus or selection.

### The Button State Pattern

Buttons use a simplified "Ghost Interaction" model to reduce visual noise in dense UIs:

-   **Rest:** Tertiary/Ghost buttons are completely transparent (no border, no background).
-   **Hover:** Acquires a darkened background (`alpha-grey-50`) but **NO border**.
-   **Constraint:** Do not add borders on hover for tertiary actions; it shifts layout or creates unnecessary weight.

### The Floating Toolbar Pattern

Contextual toolbars (like Selection Toolbar) must sit precisely above their target to avoid obscuring it or conflict with drag handles:

-   **Positioning:** `top-end` relative to the target.
-   **Offset:** Negative values `mainAxis: -20, crossAxis: -48` to overlap the top border.
-   **Architecture:** Must use `[data-toolbar="true"]` and be excluded from global click handlers to prevent immediate close-on-click issues.
