# TICKET: UI Craft & Architecture Fixes

**Priority:** High
**Status:** Ready for Dev
**Type:** Defect / Technical Debt

## Context
A comprehensive review identified critical violations of the "Concentric Radii" and "Atomic Font Settings" mandates. These issues degrade the visual quality (UI Craft) and violate architectural standards defined in `STRATEGY-CSS.md` and `AGENTS.md`.

## 1. Fix Menu Concentric Radii (Visual Bug)
**Location:** `src/styles/menu.css`
**Problem:** The `menu-popover` has a radius of 12px (`--radius-xl`) and padding of 4px. The `menu-item` currently has a radius of 10px (`--radius-lg`).
- **Violation:** `10px + 4px = 14px`, which implies the outer container *should* be 14px, but it is 12px. This creates a visually "pinched" corner.
- **Requirement:** Update `menu-item` border-radius to **8px** (`--radius-md`).
- **Math:** `8px (inner) + 4px (pad) = 12px (outer)`. Perfect match.

## 2. Fix AppHeader Icon Optical Sizing (Visual Bug)
**Location:** `src/features/AppHeader/AppHeader.module.css`
**Problem:** The `.logoGroup .material-symbols-rounded` icon is explicitly sized to **16px** but lacks the corresponding `font-variation-settings`.
- **Violation:** It inherits the default `opsz` (20 or 24), causing the 16px icon to render with distorted stroke weights (too thick/blurry).
- **Requirement:** Explicitly define atomic font settings for this rule.
- **Code:**
  ```css
  font-variation-settings: 'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 16;
  ```
  *(Note: Weight 600 aligns with the surrounding text).*

## 3. Improve Close Button Semantics (UX/Accessibility)
**Location:** `src/features/AppHeader/AppHeader.tsx`
**Problem:** The close icon is currently a raw `<span>`.
- **Requirement:**
    - If functional: Wrap in a `<button>` with `aria-label="Close"`.
    - If decorative: Add `aria-hidden="true"`.
    - *Assumption:* This appears to be a mock UI element given the current "Welcome/Editor" tab switching context, but it should still be syntactically correct interactively or hidden.

## Definition of Done
- [x] `menu-item` radius is 8px.
- [x] AppHeader icons render crisply at 16px (verified via DevTools computed style).
- [ ] No regressions in menu layout or header spacing.
