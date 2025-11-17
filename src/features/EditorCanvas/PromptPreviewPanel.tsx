// src/features/EditorCanvas/PromptPreviewPanel.tsx
import { useAtomValue } from 'jotai';
import { promptMarkdownAtom } from '../../data/markdownSelectors';
import editorStyles from './EditorCanvas.module.css';
import styles from './PromptPreviewPanel.module.css';

export const PromptPreviewPanel = () => {
  const markdown = useAtomValue(promptMarkdownAtom);

  return (
    <div className={`${styles.previewContainer} ${editorStyles.previewContainer}`}>
      <div className={styles.previewCard}>
        <div className={styles.previewHeader}>
          <h2 className={`${editorStyles.panelTitle} ${styles.panelTitle}`}>Prompt Preview</h2>
        </div>
        <div className={styles.previewContent}>
          <pre className={styles.markdownOutput}>{markdown}</pre>
        </div>
      </div>
    </div>
  );
};