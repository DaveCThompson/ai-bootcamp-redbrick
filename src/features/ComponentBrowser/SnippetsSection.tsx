// src/features/ComponentBrowser/SnippetsSection.tsx
import { useAtomValue, useSetAtom } from 'jotai';
import { snippetListAtom, snippetModalAtom, clearAllSnippetsAtom } from '../../data/snippetsAtoms';
import { DraggableSnippetItem } from './DraggableSnippetItem';
import styles from '../../components/panel.module.css';

export const SnippetsSection = () => {
    const snippets = useAtomValue(snippetListAtom);
    const setModalState = useSetAtom(snippetModalAtom);
    const clearAllSnippets = useSetAtom(clearAllSnippetsAtom);

    const handleCreateNew = () => {
        setModalState({ isOpen: true, editingSnippetId: null });
    };

    const handleClearAll = () => {
        if (snippets.length === 0) return;
        if (window.confirm('Are you sure you want to clear ALL snippets? This cannot be undone.')) {
            clearAllSnippets();
        }
    };

    return (
        <li className={styles.componentListGroup}>
            <div className={styles.listGroupTitleRow}>
                <h5 className={styles.listGroupTitle}>MY SNIPPETS</h5>
                <div className={styles.listGroupActions}>
                    {snippets.length > 0 && (
                        <button
                            className={styles.addGroupButton}
                            onClick={handleClearAll}
                            title="Clear All Snippets"
                            aria-label="Clear All Snippets"
                            type="button"
                        >
                            <span className="material-symbols-rounded">delete_sweep</span>
                        </button>
                    )}
                    <button
                        className={styles.addGroupButton}
                        onClick={handleCreateNew}
                        title="Create New Snippet"
                        aria-label="Create New Snippet"
                        type="button"
                    >
                        <span className="material-symbols-rounded">add</span>
                    </button>
                </div>
            </div>

            <ul className={styles.componentListGroupItems}>
                {snippets.length === 0 ? (
                    <div className={styles.emptyStateContainer} style={{ padding: 'var(--spacing-4) 0', textAlign: 'center' }}>
                        <span className="material-symbols-rounded" style={{ fontSize: '24px', color: 'var(--surface-fg-tertiary)' }}>note_add</span>
                        <p style={{ fontSize: '0.85em', color: 'var(--surface-fg-secondary)', margin: 'var(--spacing-1) 0' }}>No snippets yet</p>
                        <p style={{ fontSize: '0.75em', color: 'var(--surface-fg-tertiary)', margin: 0 }}>Click + to create one</p>
                    </div>
                ) : (
                    snippets.map((snippet) => (
                        <DraggableSnippetItem key={snippet.id} snippet={snippet} />
                    ))
                )}
            </ul>
        </li>
    );
};
