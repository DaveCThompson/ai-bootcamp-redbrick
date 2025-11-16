Here is the UI/UX specification for the requested updates.

### **1. Properties Panel: Role Component**

*   **Context:** A single "Role" component is selected on the canvas.
*   **Panel Title:** The panel header dynamically updates to show the selected role's name (e.g., "Skeptical Engineer").
*   **UI:**
    *   A single section titled **"Role Type"** is displayed.
    *   This section contains a list of all available roles, each presented with a radio button and a descriptive label (e.g., "Skeptical Engineer," "Master Product Manager").
*   **UX:**
    *   The interaction model is a standard radio group; selecting one role automatically deselects any other.
    *   Changing the selection instantly updates the component's appearance and behavior on the canvas (e.g., its title and description text change).
    *   The change is committed immediately without needing a "Save" or "Apply" button.

### **2. Properties Panel: General Widget Components**

*   **Context:** A standard widget (e.g., "Text Input," "Dropdown") is selected on the canvas.
*   **UI:**
    *   The "Validation" section and its "Required" toggle control are **removed** from the properties panel.
*   **UX:**
    *   The user experience is streamlined. Users are only presented with controls relevant to the component's display and field settings, reducing cognitive load.

### **3. Properties Panel: Snippet Preview**

*   **Context:** Any component is selected on the canvas.
*   **UI:**
    *   The snippet preview is presented within a collapsible **accordion** at the bottom of the panel, titled "Snippet Preview."
    *   By default, the accordion is **open**.
    *   When expanded, the content area displays:
        1.  A full-width **"Copy" button** at the top.
        2.  A pre-formatted code block below the button, showing the component's generated markdown snippet.
*   **UX:**
    *   This design prioritizes a clean and focused properties view, allowing the user to reveal the snippet on demand.
    *   Clicking the "Copy" button copies the snippet to the clipboard and triggers a confirmation toast (e.g., "Snippet copied").

### **4. Prompt Preview: Template Component Output**

*   **Context:** The main "Prompt Preview" panel is visible, and the canvas contains a template component (e.g., "Lab 1: User Profile").
*   **UI:** The generated markdown for the template is structured semantically:
    *   It begins with a level-2 markdown header (`##`) corresponding to the template's title.
    *   Each field within the template is formatted as a "question/answer" pair:
        *   The field's label is a level-3 markdown header (`###`).
        *   The user-entered content for that field follows on the next line.
    *   If a field has no user content, a placeholder `[not provided]` is rendered.
*   **UX:**
    *   The output is highly readable and clearly delineates the context (the template title) from the specific data points (the question/answer pairs). This improves the clarity and effectiveness of the final prompt for the LLM.