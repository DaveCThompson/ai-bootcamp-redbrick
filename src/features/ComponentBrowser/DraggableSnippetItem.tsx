// src/features/ComponentBrowser/DraggableSnippetItem.tsx
import { useDraggable } from '@dnd-kit/core';
import { useSetAtom } from 'jotai';
import { Snippet, DndData } from '../../types';
import { snippetModalAtom, deleteSnippetAtom } from '../../data/snippetsAtoms';
import panelStyles from '../../components/panel.module.css';
import styles from './DraggableComponentItem.module.css';

interface DraggableSnippetItemProps {
    snippet: Snippet;
}

export const DraggableSnippetItem = ({ snippet }: DraggableSnippetItemProps) => {
    const setModalState = useSetAtom(snippetModalAtom);
    const deleteSnippet = useSetAtom(deleteSnippetAtom);

    const dndData: DndData = {
        id: `new-snippet-${snippet.id}`,
        name: snippet.name,
        type: 'snippet-instance',
        icon: 'text_snippet',
        isNew: true,
        isSnippet: true,
        snippetId: snippet.id,
        snippetContent: snippet.content,
    };

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `snippet-item-${snippet.id}`,
        data: dndData,
    });

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setModalState({ isOpen: true, editingSnippetId: snippet.id });
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete the snippet "${snippet.name}"?`)) {
            deleteSnippet(snippet.id);
        }
    };

    return (
        <li
            ref={setNodeRef}
            style={{ opacity: isDragging ? 0.4 : 1, touchAction: 'none' }}
            {...listeners}
            {...attributes}
            className={`menu-item ${panelStyles.dataNavItem} ${styles.draggableItem}`}
        >
            <span className={`material-symbols-rounded ${panelStyles.componentIcon}`}>text_snippet</span>
            <span className={panelStyles.componentName}>{snippet.name}</span>
            <div className={styles.actionButtons}>
                <button
                    className={styles.actionButton}
                    onClick={handleEdit}
                    onPointerDown={e => e.stopPropagation()}
                    aria-label={`Edit ${snippet.name}`}
                    type="button"
                >
                    <span className="material-symbols-rounded">edit</span>
                </button>
                <button
                    className={styles.actionButton}
                    onClick={handleDelete}
                    onPointerDown={e => e.stopPropagation()}
                    aria-label={`Delete ${snippet.name}`}
                    type="button"
                >
                    <span className="material-symbols-rounded">delete</span>
                </button>
            </div>
        </li>
    );
};
