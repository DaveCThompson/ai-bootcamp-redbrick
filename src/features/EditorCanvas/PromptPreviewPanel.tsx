// src/features/EditorCanvas/PromptPreviewPanel.tsx
import { useAtomValue } from 'jotai';
import { promptMarkdownAtom } from '../../data/markdownSelectors';
import styles from './PromptPreviewPanel.module.css';

export const PromptPreviewPanel = () => {
  const markdown = useAtomValue(promptMarkdownAtom);

  return (
    <div className={styles.previewContainer}>
      <div className={styles.contentFixedWrapper}>
        <div className={styles.previewHeader}>
          <h2 className={styles.panelTitle}>Result</h2>
        </div>
        <div className={styles.previewContent}>
          <pre className={styles.markdownOutput}>{markdown}</pre>
        </div>
      </div>
    </div>
  );
};