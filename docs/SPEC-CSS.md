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

### Current Concentric Radii Implementation

```
Button (--radius-lg, 10px) + Padding (--spacing-1, 4px) = Container (--radius-xl, 12px)
```

**Affected Components:**
- `ActionToolbar.module.css`
- `SelectionToolbar.module.css`
- `menu.css` (.menu-popover)

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
