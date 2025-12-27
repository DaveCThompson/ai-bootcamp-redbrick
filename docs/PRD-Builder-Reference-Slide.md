# PRD: Animated Slide Transition for Builder / Reference Toggle

## Context

The application has a **primary navigation toggle** in the Sidebar with two modes:
-   **Builder:** Three-pane layout (Elements Panel, Canvas, Output Panel).
-   **Reference:** Single-pane static reference content (`ReferencesPage`).

Currently, switching between these modes results in an **instantaneous swap** with no animation. This feels abrupt and "cheap."

**Goal:** Implement a high-craft **animated slide transition** using `framer-motion` when toggling between Builder and Reference modes.

---

## Goals

1.  **High Craft:** Buttery smooth (60fps), physics-based slide animation.
2.  **Intuitive Direction:** "Reference" slides in from the left (since the toggle button is on the left); "Builder" slides in from the right.
3.  **Performance:** Use `transform`/`opacity` only. No layout thrashing.
4.  **Design System Compliance:** All tokens from `SPEC-CSS.md`.

---

## Options Analysis

| Option | Description | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **1. Horizontal Slide (`AnimatePresence`)** | Builder/Reference content slides left/right based on direction. Uses `AnimatePresence` for exit/enter. | Intuitive (matches toggle position). Classic, expected. | Requires managing direction state. |
| **2. Crossfade** | Fade out current, fade in new. | Simpler. No direction logic. | Less "spatial" metaphor. Feels less connected to the toggle. |
| **3. Shared Layout (Hero Effect)** | Elements morph from Builder to Reference (e.g., header title morphs). | Very premium/Apple-esque. | Complex to implement. Requires shared `layoutId`s between unrelated views. |

### **Recommendation: Option 1 (Horizontal Slide)**

This provides the clearest spatial metaphor: Reference is "to the left" of Builder, matching the toggle button order. It's also the most expected behavior and easier to implement correctly with `framer-motion`'s `AnimatePresence`.

---

## UX Specification

### Animation Direction

-   **Toggling to Reference (from Builder):**
    -   Builder slides **out to the right** (`x: '100%', opacity: 0`).
    -   Reference slides **in from the left** (`x: '-100%' → 0, opacity: 0 → 1`).
-   **Toggling to Builder (from Reference):**
    -   Reference slides **out to the left** (`x: '-100%', opacity: 0`).
    -   Builder slides **in from the right** (`x: '100%' → 0, opacity: 0 → 1`).

### Animation Timing

-   **Duration:** `0.35s` (fast but perceivable).
-   **Easing:** `{ type: 'spring', stiffness: 400, damping: 35 }` (snappy, minimal oscillation).

### Visual Details

-   During the transition, the outgoing view animates out while the incoming view animates in.
-   `AnimatePresence mode="wait"` ensures exit animation completes before enter begins (cleaner, no overlap).
-   Alternative: `mode="popLayout"` with `layout` prop for overlapping but smoother feel.

---

## Design System Compliance (from `SPEC-CSS.md`)

| Concern | Token / Pattern |
|---------|-----------------|
| Background during transition | Parent uses `--surface-bg-secondary` (the workspace). |
| No additional styling needed | The animation uses only `transform` and `opacity`. |

---

## Architecture & Implementation Spec

### Current Architecture (in `App.tsx`)

```tsx
// Current: Instant switch, no animation
const renderWorkspaceContent = () => {
  if (primaryMode === 'reference') {
    return <div className={styles.fullWorkspaceContent}><ReferencesPage /></div>;
  }
  // ... builder content
};
```

### Proposed Architecture

Wrap the dynamic content in `AnimatePresence` with `motion.div` wrappers.

```tsx
import { AnimatePresence, motion } from 'framer-motion';

// Direction: negative = left, positive = right
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
};

const springTransition = { type: 'spring', stiffness: 400, damping: 35 };

// Inside App component:
const [direction, setDirection] = useState(0); // Track direction for animation

// Update direction when mode changes (could use useEffect or derive)
const handleModeChange = (newMode: PrimaryNavMode) => {
  setDirection(newMode === 'reference' ? -1 : 1);
  setPrimaryMode(newMode);
};

// Render:
<div className={styles.workspaceContainer}>
  <AnimatePresence mode="wait" custom={direction}>
    {primaryMode === 'reference' ? (
      <motion.div
        key="reference"
        className={styles.fullWorkspaceContent}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        custom={direction}
        transition={springTransition}
      >
        <ReferencesPage />
      </motion.div>
    ) : (
      <motion.div
        key="builder"
        className={styles.threePaneLayout}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        custom={direction}
        transition={springTransition}
      >
        {/* ... builder panels ... */}
      </motion.div>
    )}
  </AnimatePresence>
</div>
```

### CSS Requirements

The `workspaceContainer` must have `overflow: hidden` to prevent the sliding content from being visible outside its bounds during animation.

```css
.workspaceContainer {
  overflow: hidden; /* CRITICAL for slide animation */
  position: relative;
}

.fullWorkspaceContent,
.threePaneLayout {
  /* These should already be position: relative or default, which is fine */
}
```

---

## Dependency Impact

| File | Action | Reason |
|------|--------|--------|
| `src/App.tsx` | **MODIFY** | Wrap content in `AnimatePresence` + `motion.div`. Add direction state. |
| `src/App.module.css` | **MODIFY** | Add `overflow: hidden` to `.workspaceContainer`. |
| `src/features/Sidebar/Sidebar.tsx` | **MODIFY** (optional) | If direction logic is hoisted, sidebar may need to set direction on toggle. |
| `framer-motion` | **EXISTING** | Already installed. |

---

## Verification Plan

### Manual Verification (No automated tests for visual animations)

| Step | Expected Result |
|------|-----------------|
| 1. Click "Reference" toggle. | Builder slides out right, Reference slides in from left. |
| 2. Click "Builder" toggle. | Reference slides out left, Builder slides in from right. |
| 3. Rapidly toggle back and forth. | Animation interrupts cleanly. No flickering or stuck states. |
| 4. Inspect with DevTools. | Only `transform` and `opacity` are animated (no `width`, `left`, etc.). |
| 5. Check `.workspaceContainer`. | Has `overflow: hidden`. |

---

## Open Questions for User

1.  **Should the sidebar stay fixed, or should everything slide?** (Currently: Only the workspace content slides.)
2.  **Preference on `AnimatePresence mode`?** `wait` (one finishes before next starts) or `popLayout` (overlapping)?
3.  **Any concern with the direction metaphor (Reference = left, Builder = right)?** This matches the toggle order.

