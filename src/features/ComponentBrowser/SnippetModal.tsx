// src/features/ComponentBrowser/SnippetModal.tsx
import { useState, useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { snippetsBaseAtom, snippetModalAtom, addSnippetAtom } from '../../data/snippetsAtoms';
import { Modal } from '../../components/modal';
import { Button } from '../../components/Button';
import styles from './SnippetModal.module.css';

export const SnippetModal = () => {
    const [modalState, setModalState] = useAtom(snippetModalAtom);
    const snippets = useAtomValue(snippetsBaseAtom);
    const addSnippet = useSetAtom(addSnippetAtom);

    const [name, setName] = useState('');
    const [content, setContent] = useState('');

    const isEditing = !!modalState.editingSnippetId;

    useEffect(() => {
        if (modalState.isOpen && modalState.editingSnippetId) {
            const snippet = snippets[modalState.editingSnippetId];
            if (snippet) {
                setName(snippet.name);
                setContent(snippet.content);
            }
        } else if (modalState.isOpen) {
            setName('');
            setContent('');
        }
    }, [modalState.isOpen, modalState.editingSnippetId, snippets]);

    const handleClose = () => {
        setModalState({ isOpen: false, editingSnippetId: null });
    };

    const handleSave = () => {
        if (!name.trim()) return;
        addSnippet({
            name: name.trim(),
            content: content.trim(),
            id: modalState.editingSnippetId || undefined,
        });
        handleClose();
    };

    return (
        <Modal isOpen={modalState.isOpen} onClose={handleClose} width={480}>
            <Modal.Header>
                <h3>{isEditing ? 'Edit Snippet' : 'Create New Snippet'}</h3>
                <Button
                    variant="tertiary"
                    size="s"
                    iconOnly
                    onClick={handleClose}
                    aria-label="Close modal"
                >
                    <span className="material-symbols-rounded">close</span>
                </Button>
            </Modal.Header>

            <Modal.Content>
                <div className={styles.formContainer}>
                    <div className={styles.formGroup}>
                        <label htmlFor="snippet-name" className={styles.label}>
                            Name <span className="required-indicator">*</span>
                        </label>
                        <input
                            id="snippet-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. System Protocol"
                            autoFocus
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="snippet-content" className={styles.label}>
                            Content
                        </label>
                        <textarea
                            id="snippet-content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter your snippet content here..."
                            rows={8}
                        />
                    </div>
                </div>
            </Modal.Content>

            <Modal.Footer>
                <div className={styles.footerActions}>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave} disabled={!name.trim()}>
                        {isEditing ? 'Save Changes' : 'Save Snippet'}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};
