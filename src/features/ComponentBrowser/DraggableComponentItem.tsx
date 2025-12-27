// src/features/ComponentBrowser/DraggableComponentItem.tsx
import { useSetAtom } from 'jotai';
import { useDraggable } from '@dnd-kit/core';
import { WidgetComponent } from '../../types';
import { DraggableComponent, DndData } from '../../types';
import { generateDefaultSnippet } from '../../data/snippetUtils';
import { commitActionAtom } from '../../data/promptStateAtoms';
import { addToastAtom } from '../../data/toastAtoms';
import panelStyles from '../../components/panel.module.css';
import styles from './DraggableComponentItem.module.css';

interface DraggableComponentItemProps {
    component: DraggableComponent;
    isTemplate?: boolean;
}

export const DraggableComponentItem = ({ component, isTemplate = false }: DraggableComponentItemProps) => {
    const idPrefix = isTemplate ? `new-template-` : `new-`;
    const addToast = useSetAtom(addToastAtom);
    const commitAction = useSetAtom(commitActionAtom);

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `${idPrefix}${component.id}`,
        data: {
            id: component.id,
            name: component.name,
            type: component.type,
            icon: component.icon,
            isNew: true,
            isTemplate,
            controlType:
                (component.id === 'heading') ? 'plain-text' :
                    (component.id === 'paragraph') ? 'plain-text' :
                        (component.type === 'widget') ? component.id as WidgetComponent['properties']['controlType'] : undefined,
            controlTypeProps:
                component.id === 'heading' ? { textElement: 'h2', content: 'Section Header' } :
                    component.id === 'paragraph' ? { textElement: 'p', content: 'This is a block of text.' } :
                        undefined,
            dynamicType: component.type === 'dynamic' ? 'role' : undefined,
        } satisfies DndData,
    });

    const handleCopySnippet = (e: React.MouseEvent) => {
        e.stopPropagation();

        // Determine the controlType for snippet generation
        let controlType: 'plain-text' | 'text-input' | undefined;
        if (component.id === 'heading' || component.id === 'paragraph') {
            controlType = 'plain-text';
        } else if (component.type === 'widget') {
            controlType = 'text-input'; // Default for widget items like "text-input"
        }

        const snippet = generateDefaultSnippet(
            component.type,
            {
                dynamicType: component.type === 'dynamic' ? 'role' : undefined,
                controlType,
                textElement: component.id === 'heading' ? 'h2' : (component.id === 'paragraph' ? 'p' : undefined),
                templateKey: isTemplate ? component.id : undefined,
            }
        );

        void navigator.clipboard.writeText(snippet);
        addToast({ message: 'Snippet copied to clipboard', icon: 'content_copy' });
    };

    const handleAddToPrompt = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (isTemplate) {
            commitAction({
                action: {
                    type: 'TEMPLATE_ADD',
                    payload: { templateId: component.id, parentId: 'root', index: 9999 }
                },
                message: `Added ${component.name} to prompt`
            });
        } else {
            // Guard: snippets can't be added via COMPONENT_ADD
            if (component.type === 'snippet') return;

            commitAction({
                action: {
                    type: 'COMPONENT_ADD',
                    payload: {
                        componentType: component.type as 'layout' | 'widget' | 'dynamic',
                        name: component.name,
                        parentId: 'root',
                        index: 9999,
                        // Logic mirrored from Dnd setup 
                        controlType: (component.id === 'heading') ? 'plain-text' :
                            (component.id === 'paragraph') ? 'plain-text' :
                                (component.type === 'widget') ? component.id as WidgetComponent['properties']['controlType'] : undefined,
                        controlTypeProps: component.id === 'heading' ? { textElement: 'h2', content: 'Section Header' } :
                            component.id === 'paragraph' ? { textElement: 'p', content: 'This is a block of text.' } : undefined,
                        dynamicType: component.type === 'dynamic' ? 'role' : undefined,
                    }
                },
                message: `Added ${component.name} to prompt`
            });
        }
        addToast({ message: 'Added to prompt', icon: 'add_circle' });
    };

    return (
        <li
            ref={setNodeRef}
            style={{ opacity: isDragging ? 0.4 : 1, touchAction: 'none' }}
            {...listeners}
            {...attributes}
            className={`menu-item ${panelStyles.dataNavItem} ${styles.draggableItem}`}
        >
            <span className={`material-symbols-rounded ${panelStyles.componentIcon}`}>{component.icon}</span>
            <span className={panelStyles.componentName}>{component.name}</span>
            <div className={styles.actionButtons}>
                <button
                    className={styles.actionButton}
                    onClick={handleCopySnippet}
                    onPointerDown={e => e.stopPropagation()}
                    aria-label={`Copy ${component.name} snippet`}
                    type="button"
                >
                    <span className="material-symbols-rounded">content_copy</span>
                </button>
                <button
                    className={styles.actionButton}
                    onClick={handleAddToPrompt}
                    onPointerDown={e => e.stopPropagation()}
                    aria-label={`Add ${component.name} to prompt`}
                    type="button"
                >
                    <span className="material-symbols-rounded">add</span>
                </button>
            </div>
        </li>
    );
};
