Of course. Here is a comprehensive plan, broken down into two distinct specification documents as requested: the PRD for implementation and the spec for the content itself.

---
--- START OF FILE Reference-Page-Upgrade.md ---

# PRD: Interactive Reference Page

### 1.  Overview

This document outlines the plan to transform the placeholder `ReferencesPage` into a high-value, interactive educational resource for the AI Bootcamp. The current page, which displays mock settings data, will be replaced with curated content on core AI concepts. A key new feature, "Contextual Help," will be introduced via a toggle, allowing users to reveal tooltips for technical terms, making the page accessible to both beginners and experienced users.

### 2.  Problem & Goals

**Problem Statement:**
The application currently lacks a centralized, in-app resource to educate users on the fundamental concepts of AI, prompt engineering, and the "Vibe Coding" methodology. The existing `ReferencesPage` is non-functional and provides no value. New users may be unfamiliar with key terminology (e.g., "LLM," "tokens," "few-shot prompting"), creating a barrier to effective use of the platform.

**Goals:**
1.  **Deliver Value:** Replace the placeholder content with a permanent, high-quality reference guide on "AI 101," "Prompt Engineering," and "Vibe Coding."
2.  **Enhance Accessibility:** Implement a "Contextual Help" system that allows new users to get definitions for key terms on-demand without cluttering the UI for advanced users.
3.  **Drive Engagement:** Create a useful and "sticky" feature that encourages users to learn within the application, increasing their proficiency and investment in the product.
4.  **Maintain Architectural Integrity:** Implement the new features in a scalable, data-driven manner that aligns with the project's core architectural principles.

### 3.  Scope & Key Initiatives

**Key Initiatives / User Stories:**
*   As a user, I can navigate to the "References" page and read well-structured content on core AI topics.
*   As a new user, I can see a "Contextual Help" toggle at the top of the References page.
*   As a new user, when I enable the toggle, I can see specific technical terms become subtly highlighted.
*   As a new user with help enabled, I can hover my mouse over a highlighted term to see a tooltip with a concise definition.
*   As an experienced user, I can leave the toggle off and read the content without visual clutter.

**Out of Scope for this Initiative:**
*   Persisting the "Contextual Help" toggle state per user (it will reset to `false` on page load).
*   Content for topics beyond the initial three specified.
*   A search functionality for the reference content.
*   User-editable content or annotations.

### 4.  UX/UI Specification & Wireframes

#### Interaction Flow

1.  The user navigates to the References page. The content is displayed, and the "Contextual Help" toggle is visible in the 'off' state. All text appears normal.
2.  The user clicks the toggle to turn it 'on'.
3.  Instantly, specific keywords within the content (e.g., "LLM," "tokens") are visually differentiated with a subtle background highlight and a dotted underline.
4.  The user hovers their cursor over a highlighted word. A tooltip appears above the word, displaying a concise definition.
5.  The user moves their cursor away, and the tooltip disappears.
6.  The user clicks the toggle again to turn it 'off'. All highlights and interactivity are removed, and the text returns to its standard appearance.

#### Visual Design & Tokens

The design reuses existing, high-craft components (`Switch`, `Tooltip`) and established style tokens to ensure visual consistency.

*   **Header & Toggle:** A new header section will be added to the main content column to house the toggle. This provides a clear, dedicated space for page-level controls.
*   **Highlighted Word:** The styling must be subtle to avoid distraction.
    *   **Resting State (Help ON):**
        *   `background-color`: `var(--control-bg-tertiary)` (a very light gray)
        *   `color`: `var(--surface-fg-primary)`
        *   `text-decoration`: `underline dotted var(--surface-fg-secondary) 1px`
        *   `cursor`: `help`
    *   **Hover State (Help ON):**
        *   `background-color`: `var(--control-bg-tertiary-hover)` (a slightly darker gray)
        *   `color`: `var(--surface-fg-theme-primary)`
*   **Tooltip:** The existing `Tooltip` component will be used, which is styled globally via `.tooltip-content`. No new styling is required.

#### ASCII Wireframes

```
+--------------------------------------------------------------------------+
| Two-Column Layout                                                        |
| +----------------------+-------------------------------------------------+
| | SettingsNav          | .settingsContent (Scroll Container)             |
| |                      |                                                 |
| | .active { ... }      | +---------------------------------------------+ |
| | [ AI 101 ]           | | Page Header                                 | |
| | [ Prompting ]        | | [h1] AI Bootcamp Reference                | |
| | [ Vibe Coding ]      | |                                             | |
| |                      | | .page-controls {                            | |
| |                      | |   display: flex;                            | |
| |                      | |   padding: var(--spacing-4);                | |
| |                      | |   border-bottom: 1px solid                  | |
| |                      | |     var(--surface-border-secondary);        | |
| |                      | | }                                           | |
| |                      | | Contextual Help    [ (o-) ]<- Switch component| |
| |                      | +---------------------------------------------+ |
| |                      |                                                 |
| |                      | # AI 101: Core Concepts                         |
| |                      |                                                 |
| |                      | A Large Language Model, or [LLM], processes     |
| |                      |                            / \                  |
| |                      |                             |                   |
| |                      | .highlight {                                    |
| |                      |   background: var(--control-bg-tertiary);       |
| |                      |   text-decoration: underline dotted...;         |
| |                      | }                                               |
| |                      |                                                 |
| |                      | On Hover ->                                     |
| |                      | +------------------------------------------+    |
| |                      | | A type of AI trained on vast amounts...  |    |
| |                      | | (Tooltip uses .tooltip-content styles)   |    |
| |                      | +------------------------------------------+    |
| |                      | A Large Language Model, or [LLM], processes     |
| |                      |                            / \                  |
| |                      |                             |                   |
| |                      | .highlight:hover {                              |
| |                      |   background: var(--control-bg-tertiary-hover); |
| |                      |   color: var(--surface-fg-theme-primary);       |
| |                      | }                                               |
| |                      |                                                 |
+----------------------+-------------------------------------------------+
```

### 5.  Architecture & Implementation Plan

We will use the **Data-Driven Architecture** discussed previously. This ensures a clean separation between the content (data) and its presentation (view), adhering to project principles.

1.  **State Management:**
    *   A new global Jotai atom will be created in `src/data/atoms.ts`:
        `export const isContextualHelpVisibleAtom = atom(false);`
2.  **Data Structure:**
    *   The content for the page will be defined in a local constant `referenceData` inside `ReferencesPage.tsx`.
    *   It will follow a pure, JSON-serializable structure:
        ```typescript
        type WordTip = { type: 'word'; text: string; tooltip: string };
        type IconTip = { type: 'icon'; icon: string; tooltip: string };
        type ContentFragment = string | WordTip | IconTip;
        // ...etc.
        ```
3.  **Component Logic (`ReferencesPage.tsx`):**
    *   The component will import and use the `Switch` and `Tooltip` components.
    *   It will use the `useAtom` hook to bind `isContextualHelpVisibleAtom` to the `Switch` component.
    *   The main render function will read the `isHelpVisible` value from the atom *once*.
    *   It will map over the `referenceData` array. A helper function, `renderContentFragments`, will be created to process arrays of `ContentFragment`.
    *   This helper function will conditionally render:
        *   Plain text for `string` fragments.
        *   For `WordTip` fragments:
            *   If `isHelpVisible` is `false`, it renders the plain `text`.
            *   If `isHelpVisible` is `true`, it renders `<Tooltip content={tooltip}><span className={styles.highlight}>{text}</span></Tooltip>`.
        *   Similar logic for `IconTip` fragments (which are always interactive).

### 6.  File Manifest

*   **`src/data/`**
    *   `atoms.ts` **[MODIFIED]**: Add `isContextualHelpVisibleAtom`.
*   **`src/features/References/`**
    *   `ReferencesPage.tsx` **[MODIFIED]**:
        *   Remove dependency on `settingsMock`.
        *   Import `Switch`, `Tooltip`, and the new atom.
        *   Add the `referenceData` constant with the new content structure.
        *   Implement the new render logic for the page header (with toggle) and the content blocks.
        *   Fix existing CSS class name mismatches (e.g., `.settingsContainer` -> `.container`).
    *   `ReferencesPage.module.css` **[MODIFIED]**:
        *   Add new styles for the page controls header (`.page-controls`).
        *   Add styles for `.highlight` (rest and hover states).
        *   Add styles for inline `.tipIcon` and content lists (`ul`, `li`).
*   **`src/components/`**
    *   `Switch.tsx` **[REFERENCE]**: No changes needed, but must be reviewed to ensure correct usage.
    *   `Tooltip.tsx` **[REFERENCE]**: No changes needed, but must be reviewed to ensure correct usage.
*   **`README.md`**
    *   `README.md` **[REFERENCE]**: The implementation will adhere to the "Structure Over Style" and "Single Source of Truth" principles outlined here.

### 7.  Unintended Consequences Check

*   **Global Styles:** The new CSS is scoped via CSS Modules, so there is zero risk of collision with other parts of the application.
*   **Shared Components:** We are using `Switch` and `Tooltip` as intended, without modification. This is a low-risk integration.
*   **Atom Naming:** The atom `isContextualHelpVisibleAtom` is highly specific to this feature and will not conflict with other global state.

### 8.  Risks & Mitigations

*   **Risk:** The "subtle" highlight for contextual help terms is *too* subtle, and users do not discover the feature.
    *   **Mitigation:** We will use both a background color and a dotted underline, which are standard affordances for this type of interaction. We will test against our standard application backgrounds to ensure sufficient contrast.
*   **Risk:** The content becomes complex, and the data structure proves insufficient.
    *   **Mitigation:** The chosen data structure is flexible, supporting paragraphs, lists, and inline interactive elements. It can be easily extended with new block types (e.g., `blockquote`) in the future without a major refactor.

### 9.  Definition of Done

1.  [ ] All placeholder content on the References page is removed and replaced with the new, approved content.
2.  [ ] The "Contextual Help" toggle is present and correctly bound to the global state.
3.  [ ] When the toggle is OFF, all text renders normally.
4.  [ ] When the toggle is ON, designated keywords are highlighted and display a tooltip on hover.
5.  [ ] The page layout and styling match the wireframes and UX specification.
6.  [ ] The component correctly uses the two-column layout with a functioning scroll-spy navigation.
7.  [ ] All code has been reviewed, approved, and merged into the main branch.

--- END OF FILE Reference-Page-Upgrade.md ---

---
--- START OF FILE Reference-Page-Content.md ---

# Content Spec: AI Bootcamp Reference

This document provides the raw content and data structure for the `ReferencesPage.tsx` component, following the architecture defined in the PRD.

```typescript
// This is the data structure to be placed inside src/features/References/ReferencesPage.tsx

type WordTip = { type: 'word'; text: string; tooltip: string };
type IconTip = { type: 'icon'; icon: string; tooltip: string };
type ContentFragment = string | WordTip | IconTip;

interface ContentBlock {
  type: 'paragraph' | 'list';
  content: ContentFragment[] | ContentFragment[][];
}

interface ReferenceSection {
  id: string;
  title: string;
  blocks: ContentBlock[];
}

export const referenceData: ReferenceSection[] = [
  {
    id: 'ai-101',
    title: 'AI 101: Core Concepts',
    blocks: [
      {
        type: 'paragraph',
        content: [
          'Modern AI is powered by Large Language Models, or ',
          { type: 'word', text: 'LLMs', tooltip: 'A type of AI trained on vast amounts of text to understand, generate, and interact in human-like language.' },
          '. Think of an LLM as an incredibly advanced auto-complete. It predicts the next most likely word based on the patterns it has learned from its training data.',
          { type: 'icon', icon: 'psychology', tooltip: 'An LLM doesn\'t "understand" in the human sense. It excels at statistical pattern matching on a massive scale.' },
        ],
      },
      {
        type: 'paragraph',
        content: [
          'LLMs process text in units called ',
          { type: 'word', text: 'tokens', tooltip: 'The fundamental building blocks of text for an LLM. A token is roughly 3/4 of a word.' },
          '. Every piece of input you provide and every word the model generates consumes tokens. This is important because models have a finite ',
          { type: 'word', text: 'context window', tooltip: 'The maximum number of tokens an LLM can consider at one time, including both the input prompt and its generated output.' },
          '—once the limit is reached, it starts to forget the beginning of the conversation.',
        ],
      },
    ],
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt Engineering Fundamentals',
    blocks: [
      {
        type: 'paragraph',
        content: [
          'Prompt Engineering is the art and science of designing effective inputs to guide an AI toward a desired output. A well-crafted prompt is the difference between a generic, useless response and a precise, valuable one. ',
          { type: 'icon', icon: 'rule', tooltip: 'Principle: Garbage in, garbage out. The quality of your output is directly proportional to the quality of your input.' },
        ],
      },
      {
        type: 'list',
        content: [
          [
            { type: 'word', text: 'Clarity and Specificity:', tooltip: 'Provide explicit instructions. Instead of "Write about dogs," try "Write a 3-paragraph summary about the history of dog domestication for a 5th-grade audience."' },
            ' Be direct. The more specific your instructions, the better the result.'
          ],
          [
            { type: 'word', text: 'Provide Context:', tooltip: 'Give the AI all the background information it needs to complete the task successfully. Don\'t assume it knows about your specific project or goals.' },
            ' If you\'re asking it to write code, provide existing code snippets. If you\'re asking for marketing copy, provide brand guidelines.'
          ],
          [
            { type: 'word', text: 'Use a Persona:', tooltip: 'Instruct the AI to act as a specific expert. For example, "You are a senior software architect specializing in React..." or "You are a skeptical financial analyst..."' },
            ' This frames the conversation and dramatically improves the quality and tone of the response.'
          ],
          [
            { type: 'word', text: 'Few-Shot Prompting:', tooltip: 'Provide 1 to 5 examples (shots) of the desired input/output format within your prompt. This is one of the most powerful techniques for getting structured data.' },
            ' This teaches the model the exact format you expect for the response, leaving less room for error.'
          ],
        ]
      }
    ],
  },
  {
    id: 'vibe-coding',
    title: 'Vibe Coding: Intuitive Development',
    blocks: [
      {
        type: 'paragraph',
        content: [
          '"Vibe Coding" is a development methodology that treats the AI as a collaborative partner. Instead of writing every line of code yourself, you guide the AI with high-level, conversational commands based on your intent—the "vibe." It prioritizes rapid iteration and allows you to stay focused on the "what" rather than the "how." ',
          { type: 'icon', icon: 'hub', tooltip: 'Vibe Coding is not about replacing developers; it\'s about augmenting them. It transforms the developer role from a bricklayer to an architect.' },
        ],
      },
      {
        type: 'paragraph',
        content: [
          'This approach works best when you combine clear instructions with iterative feedback. Start with a broad goal, review the AI\'s output, and then provide concise, corrective feedback to refine the result. Treat it like a conversation with a junior developer who is incredibly fast but needs precise guidance.',
        ],
      },
    ],
  },
];
```

--- END OF FILE Reference-Page-Content.md ---