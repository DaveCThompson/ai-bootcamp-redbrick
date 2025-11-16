Phase 4: The Markdown Engine (New Feature)
Objective: Translate the visual tree into a Markdown string and display it.
Create the Markdown Selector (markdownSelector.ts):
This is a pure function (or a Jotai derived atom) that recursively traverses canvasComponentsByIdAtom.
Logic:
layout (Group) -> Iterates children.
heading (H1) -> Returns # {content}\n\n.
heading (H2) -> Returns ## {content}\n\n.
paragraph -> Returns {content}\n\n.
text-input -> Returns {{variable_name}} (Jinja/Mustache style syntax for prompt templates).
role -> Wraps the content in role tags if applicable (e.g., <system>...</system>).
Create Prompt Preview Panel:
Create a new component PromptPreviewPanel.tsx.
Place it to the right of the Canvas (splitting the screen) or as a toggleable bottom panel.
It subscribes to the markdownSelector atom to show real-time text generation as items are dragged.
Technical Considerations & "Do Not Break" Rules
Internal IDs vs. Display Names:
We will keep componentType: 'layout' | 'widget' in the codebase. Renaming these to container | promptElement throughout the entire Redux/Jotai history system is high-risk and offers low value. We will simply change how they are labeled in the UI.
CSS Classes:
We will continue using .formCard, .formItemContent, etc. We can add new classes for specific styling, but deleting the old ones will break the EditorCanvas.module.css layout logic.
Drag and Drop:
The useCanvasDnd hook is complex. We will not touch the collision detection or sorting algorithms. We are simply feeding it different "Items" (Prompt Elements) to sort.
Next Step