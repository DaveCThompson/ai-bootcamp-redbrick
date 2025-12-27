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

### The Concentric Radii Pattern

When a container wraps interactive elements (buttons, menu items), its `border-radius` must equal the inner element's radius plus the container's padding.

**Formula:** `container_radius = inner_element_radius + padding`

This creates visually harmonious, concentric rounded corners. See SPEC-CSS for current token values.

**Applies To:** `ActionToolbar`, `SelectionToolbar`, `.menu-popover`, Component Browser Items.

**Example (Component Browser):**
-   Container Radius: 10px (`--radius-lg`)
-   Padding/Spacing: 4px
-   Button Radius: `10px - 4px = 6px` (`--radius-sm`)

### The "Safe Zone" Padding Contract for Focus Rings

We use a **2px outer focus ring** for all interactive components.

-   **Problem:** Parent containers with `overflow: hidden` will clip this ring.
-   **Solution:** Any container with `overflow: hidden` must provide internal padding (`2px` / `--spacing-0p5`) to accommodate focus rings.

**Exception:** Menu items use an **inset box-shadow** for focus state since they're flush with popover edges.

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

**Important Note on Optical Sizing:** If you need to use icons smaller than 20px (e.g., 16px), you **must** ensure the `index.html` font import includes the correct range (e.g., `15..48`). If the import defaults to `20..48`, the browser will clamp any `opsz` value below 20 to 20px, causing icons to look "fat" or distorted.

### The Icon Badging Pattern

To add secondary information to an icon:
-   Wrapper `div` with `position: relative`
-   Badge icon absolutely positioned at top-right
-   Smaller `font-size` and matching `opsz` for clarity

### The Canvas Block State Pattern

Canvas components use **borders to communicate state**, not to define structure. This reduces visual clutter from nested borders.

-   **Default:** `border-color: transparent` - No visible border at rest
-   **Hover:** `border-color: var(--canvas-block-border-hover)` - Faint grey
-   **Selected:** `border-color: var(--canvas-block-border-selected)` - Theme color

**Smart Nested Hover:** Use `:has()` to suppress parent hover when child is hovered:
```css
.selectableWrapper:hover:has(.selectableWrapper:hover) {
  border-color: transparent;
}
```

### The Input Attention Pattern

Editable input fields on the canvas use a subtle theme-tinted background to draw user focus, distinguishing them from read-only content.

-   **Editable inputs:** `background-color: var(--input-bg-attention)`
-   **Read-only content:** `background-color: var(--surface-bg-secondary_subtle)`

This visual hierarchy guides users to interactive elements without adding borders.
