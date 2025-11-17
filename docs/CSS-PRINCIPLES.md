--- START OF FILE CSS-PRINCIPLES.md ---
```markdown
# High-Craft CSS Principles

This document codifies the core principles and patterns for writing CSS in the Screen Studio project. Adhering to these guidelines is essential for maintaining a consistent, robust, and high-craft user interface.

---

### Core Principles

#### 1. Master the Box Model, Especially Positioning

The CSS Box Model is not optional knowledge. Before using `position: absolute` or `position: fixed`, you must be able to answer:

-   **What is its "positioned ancestor"?** If none exists, it will be the viewport.
-   **How will it get its width and height?** Have I provided explicit dimensions (`width`, `height`) or constraints (`top`, `right`, `bottom`, `left`)?
-   Never assume an element will "just know" its size. You must declare it.

#### 2. Diagnose, Don't Guess

When debugging a UI issue, follow this simple diagnostic process to find the root cause instead of guessing at solutions:

1.  **Isolate:** Use the browser inspector to find the exact element that is failing.
2.  **Inspect:** Analyze its "Computed" styles. Don't just look at the CSS you wrote; look at what the browser *actually rendered*. A `width: 0px` or unexpected `margin` is the key clue.
3.  **Hypothesize:** Form a hypothesis based on CSS fundamentals. "My hypothesis is the element has no width because it's absolutely positioned without horizontal constraints."
4.  **Test:** Use the browser's style editor to test your hypothesis in real-time (e.g., add `left: 0; right: 0;`). If it works, you've found the solution.

#### 3. Trust, but Verify the Final DOM

React components, UI libraries (Radix), and animation libraries (Framer Motion) can all add wrapper `divs` or change the final DOM structure. Your React code is not the final source of truth—the browser's "Elements" panel is. Always debug the final rendered HTML, not the JSX you assume is being rendered.

---

### Key Architectural Patterns

#### The Material Symbols Variable Font System

This project relies on a robust, three-layer system to control the appearance of Material Symbols icons. Understanding this system is critical for preventing bugs where icon styles (like weight or grade) are accidentally reset.

**1. The Foundation (Font Loading)**
The entire system depends on loading the **variable font** version of the icons, which makes the style axes (`FILL`, `wght`, `GRAD`, `opsz`) available to CSS. This is done in `index.html`:
```html
<link rel="stylesheet" href="...family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@...">
```
If this line is missing or does not specify the `FILL,GRAD` axes, no icon styling will work.

**2. The Baseline (Global Defaults)**
A single, authoritative rule in `src/styles/base.css` establishes the global default for all icons.
```css
/* from base.css */
.material-symbols-rounded {
  /* ... */
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 20;
  transition: font-variation-settings 0.15s ease-in-out;
}
```
This rule serves two purposes:
-   It defines the default **REST** state for every icon (unfilled, normal weight, no grade).
-   It applies a global `transition`, ensuring that any changes to these axes will animate smoothly.

**3. The Control System (Global Interactions)**
State changes are handled by a global system in `src/styles/toggles.css` that uses semantic `aria-*` attributes. This creates a predictable `REST -> HOVER -> SELECTED` state flow for any toggleable icon.
```css
/* HOVER state for an unselected icon */
[aria-pressed]:not([aria-pressed='true']):hover .material-symbols-rounded {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 100, 'opsz' 20;
}

/* SELECTED state for an active icon */
[aria-pressed='true'] .material-symbols-rounded {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 200, 'opsz' 20;
}
```
**The Golden Rule:** The `font-variation-settings` property is **atomic**—it completely overwrites any previous value. To prevent bugs where axes are accidentally reset, **every rule that sets this property must define all four axes (`FILL`, `wght`, `GRAD`, `opsz`).**

#### The "Safe Zone" Padding Contract for Focus Rings

To ensure visual consistency and prevent UI bugs, we have standardized on a **`2px` outer focus ring** for all interactive components.

-   **Problem:** Parent containers with `overflow: hidden` (like accordions) will clip this outer focus ring, making it invisible and creating an accessibility issue.
-   **Solution (The Contract):** Any container component that must use `overflow: hidden` **must also provide an internal "safe zone" of padding** to accommodate the focus rings of its children.
-   **Implementation:** The standard safe zone is a `2px` padding (`var(--spacing-0p5)`). For example, our `Accordion` component's content area has this padding, guaranteeing that any form input placed inside can display its full `2px` outer focus ring without being clipped.

**The Exception: Menu Items**
Menu items (`.menu-item`) are the one justified exception to the outer focus ring rule. Because they are flush with the edges of a rounded-corner popover, an outer shadow would be clipped. Therefore, menu items use a robust **`inset 0 0 0 2px var(...)` box-shadow** for their keyboard focus state (`[data-highlighted]:focus-visible`).

#### The Shared Menu System (`menu.css`)

To enforce the "Single Source of Truth" principle for our UI, we use a shared, global stylesheet for all list-based selection components. This system guarantees that primitives from multiple Radix UI packages (`DropdownMenu`, `ContextMenu`, `Select`) and custom components are visually indistinguishable.

It is built on two key patterns:

1.  **Shared Container (`.menu-popover`):** All menu popovers use this class, which defines the container's shape, shadow, padding, and a **`gap: 2px`** to create consistent spacing between items.
2.  **Shared Item (`.menu-item`):** All list items use this class. It defines a consistent height, internal padding, and a `1px solid transparent` border in its resting state. On hover or highlight, only the `background-color` and `border-color` are changed, preventing any layout shift. This creates a light, modern interaction style.

#### Shared Typography & Layout Patterns

The same "Single Source of Truth" principle applies to typography and layout. To ensure visual symmetry and consistency, we create and reuse shared classes for common elements like panel titles (`.panelTitle`). This guarantees that headers in different features (like the "Prompt Builder" and "Prompt Preview") are visually identical without duplicating CSS, leading to a more maintainable and coherent design.

#### The Icon Badging Pattern for Visual Status

To add secondary information to an icon without cluttering the UI, we use a CSS-only "badging" pattern.

-   **Problem:** A component or data field has a special status that needs to be communicated visually at a glance.
-   **Solution:** A wrapper `div` with `position: relative` is placed around the base icon. A second, smaller "badge" icon is then absolutely positioned at the top-right corner of the wrapper.
-   **Implementation:** The badge icon is given a smaller `font-size` and a matching `opsz` (optical size) for clarity, and a `text-shadow` can be used to lift it visually from the base icon. This creates a clean, scalable, and high-craft way to badge icons with status indicators.
```
--- END OF FILE CSS-PRINCIPLES.md ---