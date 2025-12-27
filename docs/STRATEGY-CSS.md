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
