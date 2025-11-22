// src/features/EditorCanvas/EditorControlsPill.tsx
import { useAtom, useSetAtom } from 'jotai';
import { isPreviewPaneVisibleAtom, copyAnimationStateAtom } from '../../data/atoms';
import { promptMarkdownAtom } from '../../data/markdownSelectors';
import { addToastAtom } from '../../data/toastAtoms';
import { Switch } from '../../components/Switch';
import { Button } from '../../components/Button';
import styles from './EditorCanvas.module.css';

export const EditorControlsPill = () => {
  const [isPreviewVisible, setIsPreviewVisible] = useAtom(isPreviewPaneVisibleAtom);
  const setCopyAnimState = useSetAtom(copyAnimationStateAtom);
  const addToast = useSetAtom(addToastAtom);
  const markdown = useAtom(promptMarkdownAtom)[0];

  const handleCopy = () => {
    void navigator.clipboard.writeText(markdown);
    addToast({ message: 'Prompt copied to clipboard', icon: 'content_copy' });
    setCopyAnimState('running');
  };

  return (
    <div className={styles.controlsPill}>
      <div className={styles.pillSection}>
        <span className={styles.pillLabel}>Preview</span>
        <Switch 
          checked={isPreviewVisible} 
          onCheckedChange={setIsPreviewVisible} 
          aria-label="Toggle Preview Pane"
        />
      </div>
      <div className={styles.pillDivider} />
      <Button 
        variant="tertiary" 
        size="s" 
        onClick={handleCopy}
        className={styles.pillButton}
      >
        <span className="material-symbols-rounded">content_copy</span>
        Copy Prompt
      </Button>
    </div>
  );
};