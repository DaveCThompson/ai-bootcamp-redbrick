// src/features/EditorCanvas/PromptPreviewPanel.tsx
import { useAtomValue, useSetAtom } from 'jotai';
import { promptMarkdownAtom } from '../../data/markdownSelectors';
import { addToastAtom } from '../../data/toastAtoms';
import { Button } from '../../components/Button';
import styles from './PromptPreviewPanel.module.css';

interface PromptPreviewPanelProps {
  isPrimaryView: boolean;
}

export const PromptPreviewPanel = ({ isPrimaryView }: PromptPreviewPanelProps) => {
  const markdown = useAtomValue(promptMarkdownAtom);
  const addToast = useSetAtom(addToastAtom);

  const handleCopy = () => {
    void navigator.clipboard.writeText(markdown);
    addToast({ message: 'Prompt copied to clipboard', icon: 'content_copy' });
  };

  const containerClasses = `${styles.previewContainer} ${isPrimaryView ? styles.primaryView : styles.splitView}`;

  return (
    <div className={containerClasses}>
      <div className={styles.previewCard}>
        <div className={styles.previewHeader}>
          <h3>Prompt Preview</h3>
          <Button variant="primary" size="m" onClick={handleCopy}>
            <span className="material-symbols-rounded">content_copy</span>
            Copy Prompt
          </Button>
        </div>
        <div className={styles.previewContent}>
          <pre className={styles.markdownOutput}>{markdown}</pre>
        </div>
      </div>
    </div>
  );
};