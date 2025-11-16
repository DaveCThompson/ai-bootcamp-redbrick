// src/features/Welcome/WelcomePage.tsx
import styles from './WelcomePage.module.css';

export const WelcomePage = () => {
  return (
    <div className={styles.welcomeContainer}>
      <div className={styles.welcomeContent}>
        <span className={`material-symbols-rounded ${styles.welcomeIcon}`}>auto_awesome</span>
        <h1>Welcome to AI Bootcamp</h1>
        <p>This is the central hub for building, testing, and managing structured AI prompts.</p>
        <p>Navigate to the <strong>Prompt Builder</strong> to get started.</p>
      </div>
    </div>
  );
};