# IDEA: Selection Toolbar Refinements

## Context
The canvas selection toolbar currently lacks visual warmth and precise optical alignment. We have successfully implemented a high-craft accordion pattern with refined spacing and typography, and we want to bring the same level of polish to the contextual toolbar.

## Goal
Enhance the visual design and positioning of the `CanvasSelectionToolbar` to make it feel more integrated, premium, and user-friendly.

## Design Specifications

### 1. Visual Styling (Pink Tint)
*   **Background:** Use a subtle theme-tinted background instead of neutral gray to align with the "warm & capable" aesthetic.
    *   **Token:** `var(--primitives-theme-25)` (very subtle pink/white mix)
    *   **Border:** `var(--primitives-theme-100)` (subtle pink border)
*   **Effect:** This creates a "glass-like" tint that distinguishes the active tool surface from the neutral canvas background.

### 2. Positioning & Layout
*   **Alignment:** Position the toolbar on the **right side** of the selected element, vertically centered on the top border.
*   **Optical Centering:**
    *   The toolbar should overlap the top border, but be biased slightly upwards or downwards depending on element context (currently exploring `top: calc(50% - 16px)` relative to a specific anchor).
    *   **Logic:** `top: 50%` + `transform: translateY(-50%)` centers it perfectly. We want to offset it so it visually "hangs" off the side comfortably.
*   **X-Axis Shift:**
    *   Shift left by `32px` (`right: -32px`) relative to the component's right edge.
    *   **Why?** This prevents the toolbar from obscuring the accordion chevron or other right-aligned controls.

### 3. Typography & Radii
*   **Radii:** Maintain the strict concentric radii mandate.
    *   Button: `radius-lg` (10px)
    *   Padding: `spacing-1` (4px)
    *   **Container Radius:** `10px + 4px = 14px` (approx `radius-xl` / 12px or custom).
*   **Icons:** Ensure `font-variation-settings` are applied for crisp rendering at small sizes.

## Implementation Steps

1.  **Modify `SelectionToolbar.module.css`**:
    *   Update `.selectionToolbar` background and border colors.
    *   Update `.toolbarWrapper` positioning rules.
2.  **Verify Z-Index**: Ensure `z-index: 10` is sufficient to float above adjacent selection borders but below modals.
3.  **Test with Accordions**: Verify the toolbar does not block the "Role" dropdown or chevron when a role block is selected.

## success Criteria
*   [ ] Toolbar has a subtle pink tint (`theme-25`).
*   [ ] Toolbar floats to the right of the selection, not obscuring the center content.
*   [ ] Chevron remains visible and clickable.
*   [ ] Visual hierarchy feels consistent with the new accordion styling.
