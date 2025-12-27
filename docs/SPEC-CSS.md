
# CSS Specification

Specific token values and implementation details for the CSS design system. For high-level patterns and principles, see [STRATEGY-CSS.md](./STRATEGY-CSS.md).

---

## Design Token Reference

### Spacing Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-0p5` | 2px | Focus ring safe zone |
| `--spacing-1` | 4px | Toolbar/menu padding, button gap |
| `--spacing-1p5` | 6px | Small button padding |
| `--spacing-2` | 8px | Standard button padding |

### Radius Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-md` | 8px | Standard buttons (m/s) |
| `--radius-lg` | 10px | Icon-only buttons (s), menu items |
| `--radius-xl` | 12px | Icon-only buttons (m), toolbar/menu containers |
| `--radius-2xl` | 16px | Larger containers (unused after radius step-down) |

### Panel Background Hierarchy

The application follows a strict background color hierarchy to define depth and structure:

| Token | Purpose | Usage |
|-------|---------|-------|
| `--surface-bg-tertiary` | **App Shell / Wrapper** | The outermost app container. Creates a darker backdrop for the "raised" workspace. |
| `--surface-bg-secondary` | **Workspace / Canvas** | The "flat" background for the Prompt Elements panel and the main Editor Canvas. No floating cards here. |
| `--surface-bg-primary` | **Content Zones** | The Output Panel and specific content cards. Creates the highest contrast area for reading/results. |

### Current Concentric Radii Implementation

```
Button (--radius-lg, 10px) + Padding (--spacing-1, 4px) = Container (--radius-xl, 12px)
```

**Affected Components:**
- `ActionToolbar.module.css`
- `SelectionToolbar.module.css`
- `menu.css` (.menu-popover)
- `Select` Dropdown (Container: `lg`, Input: `sm`)
- Canvas Inputs (Wrapper: `lg`, Input: `sm`)

---

## Canvas Typography Hierarchy

Strict typography rules for canvas child content to ensure legibility and hierarchy.

| Element | Size | Weight | Line-Height | Color | Note |
|---------|------|--------|-------------|-------|------|
| **AccordionHeader Label** | 0.95em | 600 | — | Primary | Main section title |
| **Field Label** | 0.85em | 600 | — | Secondary | `templateItemLabel`, `promptElementLabel` |
| **Content Text** | 0.95em | 400 | 1.5 | Secondary | `snippetContent`, `rolePromptText` |
| **Input Text** | 1.0em | 400 | — | Primary | User-editable text |
| **Placeholder** | 0.95em | 400 | — | Tertiary | Empty state text |

---

## Button Specifications

### Size Variants

| Size | Height | Border Radius | Icon-Only Radius |
|------|--------|---------------|------------------|
| `m` | 38px | `--radius-md` (8px) | `--radius-xl` (12px) |
| `s` | 34px | `--radius-md` (8px) | `--radius-lg` (10px) |

### Variant Token Usage

| Variant | Rest Color | Hover Color |
|---------|------------|-------------|
| `tertiary` | `--control-fg-tertiary` | `--control-fg-tertiary-hover` |
| `on-solid` | `--control-fg-on-solid` | (white on dark bg) |

**Note:** Use `--control-fg-*` tokens for interactive controls, not `--surface-fg-*` (which is for static text).

---

## Menu Item Specifications

- **Padding:** `8px 6px` (`--spacing-2` `--spacing-1p5`)
- **Border Radius:** `--radius-lg` (10px)
- **Hotkey Right Padding:** `--spacing-0p5` (2px) for breathing room

---

## Material Symbols Icon Defaults

```css
.material-symbols-rounded {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 20;
  transition: font-variation-settings 0.15s ease-in-out;
}
```

### State Variations

| State | FILL | wght | GRAD | opsz |
|-------|------|------|------|------|
| Rest | 0 | 400 | 0 | 20 |
| Hover (unselected) | 0 | 400 | 100 | 20 |
| Selected | 0 | 400 | 200 | 20 |

---

## Canvas Block State Tokens

These tokens control the visual state of selectable canvas components.

| Token | Value | Usage |
|-------|-------|-------|
| `--canvas-block-border-idle` | `transparent` | Default/rest state |
| `--canvas-block-border-hover` | `var(--surface-border-tertiary)` | Hover state |
| `--canvas-block-border-selected` | `var(--surface-border-theme)` | Selected state |

---

## Input Attention Tokens

These tokens draw user focus to editable input fields.

| Token | Value | Usage |
|-------|-------|-------|
| `--input-bg-attention` | `var(--primitives-theme-25)` | Editable input background |
| `--input-bg-attention-hover` | `var(--primitives-theme-50)` | Editable input hover |

---

## Component Browser Item Specifications

Action buttons that appear on hover within Component Browser draggable items.

| Property | Value | Notes |
|----------|-------|-------|
| Button Size | 24px × 24px | Matches icon-only small hit area |
| Border Radius | `--radius-sm` (6px) | Concentric with parent item radius |
| Icon Size | 16px | Smaller than default 20px |
| Icon `opsz` | 16 | Must match icon size |
| Transition | 0.15s ease-in-out | Opacity + color |
| Rest Color | `--control-fg-tertiary` | |
| Hover Color | `--control-fg-tertiary-hover` | |
| Hover Background | `--control-bg-tertiary-hover` | |

---

## Panel Header Tokens

Tokens for the floating panel header system:

| Token | Value | Usage |
|-------|-------|-------|
| `--blur-glass` | 16px | Backdrop blur for translucent surfaces |
| `--panel-header-height` | 44px | Consistent height for all panel headers |
| `--surface-bg-secondary-translucent` | rgba(249, 249, 249, 0.80) | Translucent grey (for secondary bg panels) |
| `--surface-bg-primary-translucent` | rgba(255, 255, 255, 0.80) | Translucent white (for primary bg panels) |

---

## Floating Panel Header Specifications

| Property | Value | Notes |
|----------|-------|-------|
| Position | `sticky` with `top: 0` | Enables scroll-under effect |
| Height | `var(--panel-header-height)` (44px) | Consistent across all panels |
| Z-index | 10 | Above scrolling content, below modals |
| Padding | `0 var(--spacing-4)` | 16px horizontal |
| Background | Translucent variant | Depends on parent panel background |
| Backdrop Filter | `blur(var(--blur-glass))` | 16px glassmorphism blur |
| Border | `1px solid var(--surface-border-secondary)` | Bottom only |
| Typography | 14px, 600 weight, -0.21px letter-spacing | Matches other panel headers |

### Scroll-Fade Gradient

| Property | Value | Notes |
|----------|-------|-------|
| Height | 48px | Visible fade zone |
| Position | Absolute, bottom: 0 | Overlays bottom of scroll container |
| Z-index | 5 | Above content, below header |
| Pointer Events | none | Allows clicking through gradient |

---

## Accordion Block Specifications

Specifications for canvas accordion components.

### AccordionHeader Layout

| Property | Value | Notes |
|----------|-------|-------|
| Height | `var(--panel-header-height)` | 44px |
| Padding | `0 var(--spacing-3)` | 12px horizontal |
| Gap | `var(--spacing-2)` | 8px between elements |
| Border Radius | `var(--radius-lg)` | 10px (0 bottom when expanded) |

### AccordionHeader States

| State | Background | Cursor |
|-------|------------|--------|
| Rest | `transparent` | pointer |
| Hover | `rgba(0, 0, 0, 0.04)` | pointer |
| Expanded | Bottom radius 0 | Smooth radius transition |
| Focus-visible | Pink Theme Ring | `--control-focus-ring-standard` |

### Chevron

| Property | Value | Notes |
|----------|-------|-------|
| Icon | `expand_more` | Material Symbol |
| Size | 18px | `font-size` and `opsz` |
| Color | `--surface-fg-tertiary` | |
| Rotation | 180deg when expanded | 0.2s ease transition |

### Content Animation

| Property | Value | Notes |
|----------|-------|-------|
| Method | `grid-template-rows` | 0fr → 1fr |
| Duration | 0.25s | ease timing |
| Overflow | hidden | Required for animation |
