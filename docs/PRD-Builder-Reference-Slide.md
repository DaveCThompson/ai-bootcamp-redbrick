# PRD: Animated Builder Reference Slide

## Context

The "Builder Reference" tab educates users on AI concepts. Currently static. To elevate craft, we will implement an **Animated Hero Section** using `framer-motion`.

---

## Goals

1.  **High Craft:** Buttery smooth (60fps), physics-based, visually stunning.
2.  **Utility:** Acts as a navigational TOC, not just eye candy.
3.  **Performance:** Use `transform`/`opacity` only. Leverage Framer Motion's `layout` prop.
4.  **Design System Compliance:** All tokens from `SPEC-CSS.md`.

---

## Options Analysis

| Option | Description | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **1. Cinematic Hero** | Staggered text, glass blur, mouse-reactive background. | Elegant. Premium tone. | Purely aesthetic. No navigation aid. |
| **2. Interactive Nav Cards** | 3 horizontal cards. Hover expands. Click scrolls to section. | High craft + high utility. Interactive TOC. | More complex state. |
| **3. Concept Visualizer** | Animated diagram for "Context Window". | High education value. | Too narrow; one concept only. |

### **Recommendation: Option 2 (Interactive Nav Cards)**

Highest density of craft and utility.

---

## UX Specification

### Initial State
Three cards side-by-side with equal `flex-grow`. Each displays an icon and title.

### Entrance Animation
-   Cards stagger in from `y: 30, opacity: 0`.
-   `staggerChildren: 0.1`.
-   Spring: `{ type: 'spring', stiffness: 350, damping: 30 }`.

### Hover Interaction
-   **Hovered Card:** `flex-grow: 2`. Background shifts to theme tint.
-   **Other Cards:** `flex-grow: 1`. Smoothly shrink via `layout` prop.
-   A `→` icon fades in, encouraging "Read More".

### Click Interaction
-   Smooth scrolls to the corresponding `#section-id`.

---

## Design System Compliance (from `SPEC-CSS.md`)

### Token Mapping

| Element | Token | Value |
|---------|-------|-------|
| Card Border Radius | `--radius-2xl` | 16px |
| Card Padding | `--spacing-6` (24px) or `--spacing-8` (32px) | |
| Card Gap | `--spacing-4` | 16px |
| Card Background (Rest) | `--surface-bg-primary` | White |
| Card Background (Hover) | `--control-bg-selected` | Theme tint |
| Card Border (Rest) | `1px solid var(--surface-border-secondary)` | |
| Card Shadow | `--surface-shadow-md` | |
| Title Font Weight | `700` | Bold |
| Title Color | `--surface-fg-primary` | |
| Subtitle Color | `--surface-fg-secondary` | |
| Icon Size | 24px | Default |
| Icon `opsz` | 24 | Matches size |
| Icon Color (Rest) | `--surface-fg-theme-primary` | Theme color |
| "Read More" Arrow Color | `--control-fg-selected` | |

### Concentric Radii Check (N/A for this component)
Cards have no internal buttons, so no concentric radii calculation needed.

---

## Architecture & Implementation Spec

### File Structure

```
src/features/References/
├── ReferencesPage.tsx        # MODIFY: Import ReferenceHero
├── ReferencesPage.module.css # MODIFY: Add hero styles
├── referenceContent.ts       # READ ONLY
└── components/
    └── ReferenceHero/
        ├── ReferenceHero.tsx      # NEW
        └── ReferenceHero.module.css # NEW (or colocate in page module)
```

### `ReferenceHero.tsx` Pseudocode

```tsx
import { motion } from 'framer-motion';
import { referenceData } from '../referenceContent';
import styles from './ReferenceHero.module.css'; // Or page module

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 350, damping: 30 } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export const ReferenceHero = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      className={styles.heroContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {referenceData.map(section => (
        <motion.div
          key={section.id}
          className={styles.heroCard}
          variants={cardVariants}
          layout // Enables performant width animation
          data-hovered={hoveredId === section.id}
          style={{ flexGrow: hoveredId === section.id ? 2 : 1 }}
          onMouseEnter={() => setHoveredId(section.id)}
          onMouseLeave={() => setHoveredId(null)}
          onClick={() => handleClick(section.id)}
        >
          <span className="material-symbols-rounded">{getIconForSection(section.id)}</span>
          <h3>{section.title}</h3>
          {hoveredId === section.id && (
            <motion.span
              className={styles.arrow}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              →
            </motion.span>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};
```

### CSS Spec (`ReferenceHero.module.css`)

```css
.heroContainer {
  display: flex;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-8);
}

.heroCard {
  flex: 1; /* Base flex-grow */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-3);
  padding: var(--spacing-6);

  background-color: var(--surface-bg-primary);
  border: 1px solid var(--surface-border-secondary);
  border-radius: var(--radius-2xl);
  box-shadow: var(--surface-shadow-md);

  cursor: pointer;
  /* NO CSS transition for flex-grow; Framer handles it */
}

.heroCard[data-hovered="true"] {
  background-color: var(--control-bg-selected);
}

.heroCard h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--surface-fg-primary);
  margin: 0;
}

.heroCard .material-symbols-rounded {
  font-size: 24px;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  color: var(--surface-fg-theme-primary);
}

.arrow {
  font-size: 1.5rem;
  color: var(--control-fg-selected);
  margin-left: auto;
}
```

---

## Dependency Impact

| File | Action | Reason |
|------|--------|--------|
| `ReferencesPage.tsx` | **MODIFY** | Import and render `<ReferenceHero />` |
| `ReferencesPage.module.css` | **MODIFY** | May need minor adjustments to header |
| `components/ReferenceHero/` | **NEW** | Create component and styles |

---

## Verification Plan

### Manual Verification (No automated tests for visual animations)

| Step | Expected Result |
|------|-----------------|
| 1. Navigate to Reference tab. | Cards stagger in from bottom. |
| 2. Hover over each card. | Hovered card expands. Arrow fades in. Others shrink smoothly. |
| 3. Move mouse quickly between cards. | No jank. Smooth spring physics. |
| 4. Click a card. | Page smooth-scrolls to that section. |
| 5. Inspect with DevTools. | `layout` is using transforms, not width. No layout thrashing. |

---

## Open Questions for User

1.  **Icon choice per section?** I can propose defaults (e.g., `smart_toy` for AI 101, `edit_note` for Prompt Engineering, `music_note` for Vibe Coding), or you can provide.
2.  **Do you want a brief subtitle visible in the unexpanded card, or only on hover?**
3.  **Mobile/responsive behavior?** Stack vertically on smaller screens, or is this desktop-only for now?
