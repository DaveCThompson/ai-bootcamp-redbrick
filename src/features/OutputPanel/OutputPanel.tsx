// src/features/OutputPanel/OutputPanel.tsx
import { useAtomValue, useSetAtom } from 'jotai';
import { promptMarkdownAtom } from '../../data/markdownSelectors';
import { copyAnimationStateAtom } from '../../data/atoms';
import { addToastAtom } from '../../data/toastAtoms';
import { Button } from '../../components/Button';
import styles from './OutputPanel.module.css';

export const OutputPanel = () => {
    const markdown = useAtomValue(promptMarkdownAtom);
    const setCopyAnimState = useSetAtom(copyAnimationStateAtom);
    const addToast = useSetAtom(addToastAtom);

    const handleCopy = () => {
        void navigator.clipboard.writeText(markdown);
        addToast({ message: 'Prompt copied to clipboard', icon: 'content_copy' });
        setCopyAnimState('running');
    };

    return (
        <div className={styles.outputPanelContainer}>
            {/* Custom header without border for continuity */}
            <div className={styles.outputHeader}>
                <h4>Output</h4>
                <Button
                    variant="primary"
                    size="s"
                    onClick={handleCopy}
                    aria-label="Copy Full Prompt"
                >
                    <span className="material-symbols-rounded">content_copy</span>
                    Copy
                </Button>
            </div>
            <div className={styles.panelContent}>
                <pre className={styles.markdownOutput}>{markdown}</pre>
            </div>
        </div>
    );
};
