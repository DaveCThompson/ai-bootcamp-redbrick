# Project Protocols: Antigravity & User

## Division of Labor

### 🤖 Antigravity (The Agent)
*   **Code & Logic:** Writing all TypeScript/React code, CSS, and logic.
*   **Architecture:** Designing component structures and state management (Jotai).
*   **Configuration:** Setting up build tools (Vite), linters (ESLint), and package.json.
*   **Debugging:** Analyzing error logs and proposing fixes.

### 👤 The User
*   **Heavy Lifting:** Executing commands that download large files or install heavy dependencies (e.g., `npm install`, `Invoke-WebRequest` for models).
*   **Runtime Verification:** Opening the browser, clicking buttons, and testing the UX.
*   **Console Reporting:** Copy-pasting error messages from the **Terminal** or **Browser Console** when things break.
*   **Process Control:** Stopping/Starting the dev server (`npm run dev`).

## Workflow
1.  **Agent** implements a feature.
2.  **Agent** asks User to run specific setup commands (if needed).
3.  **User** runs `npm run dev` and tests.
4.  **User** reports back with "It works" or pastes the error message.
