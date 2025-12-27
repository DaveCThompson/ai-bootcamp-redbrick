// src/features/EditorCanvas/renderers/SnippetInstanceRenderer.tsx
import { useRef } from 'react';
import { useSetAtom } from 'jotai';
import * as Collapsible from '@radix-ui/react-collapsible';
import { SnippetInstanceComponent } from '../../../types';
import { commitActionAtom } from '../../../data/promptStateAtoms';
import { useEditorInteractions } from '../useEditorInteractions';
import { CanvasSelectionToolbar } from '../CanvasSelectionToolbar';
import { AccordionHeader } from '../AccordionHeader';
import styles from '../EditorCanvas.module.css';

interface SnippetInstanceRendererProps {
    component: SnippetInstanceComponent;
    mode?: 'canvas' | 'preview';
}

export const SnippetInstanceRenderer = ({ component, mode = 'canvas' }: SnippetInstanceRendererProps) => {
    const commitAction = useSetAtom(commitActionAtom);
    const { isExpanded } = component.properties;
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    // Cast to CanvasComponent since useEditorInteractions expects the full union type
    // SnippetInstanceComponent is a valid CanvasComponent as per types.ts
    const { isSelected, isDragging, isOnlySelection, sortableProps, selectionProps, contextMenuProps, dndListeners } = useEditorInteractions(
        component as unknown as import('../../../types').CanvasComponent
    );

    const handleToggle = () => {
        commitAction({
            action: { type: 'SNIPPET_TOGGLE_EXPAND', payload: { componentId: component.id } },
            message: `${isExpanded ? 'Collapse' : 'Expand'} snippet`
        });
    };

    // Merge refs
    const setRefs = (node: HTMLDivElement | null) => {
        wrapperRef.current = node;
        if (sortableProps.ref) {
            (sortableProps.ref as (node: HTMLDivElement | null) => void)(node);
        }
    };

    if (mode === 'preview') {
        return (
            <div className={styles.sortableItem}>
                <AccordionHeader
                    icon="text_snippet"
                    label={component.name}
                    showChevron={false}
                    interactive={false}
                />
            </div>
        );
    }

    const wrapperClasses = `${styles.sortableItem} ${isDragging ? styles.isDragging : ''}`;
    const selectionClasses = `${styles.selectableWrapper} ${isSelected ? styles.selected : ''}`;

    return (
        <div
            ref={setRefs}
            className={wrapperClasses}
            style={sortableProps.style}
            data-id={component.id}
        >
            <div
                className={selectionClasses}
                {...selectionProps}
                {...contextMenuProps}
                {...dndListeners}
            >
                {isOnlySelection && <CanvasSelectionToolbar componentId={component.id} referenceElement={wrapperRef.current} dndListeners={dndListeners} />}

                <Collapsible.Root open={isExpanded} onOpenChange={handleToggle}>
                    <Collapsible.Trigger asChild>
                        <div>
                            <AccordionHeader
                                icon="text_snippet"
                                label={component.name}
                                isExpanded={isExpanded}
                                onToggle={handleToggle}
                            />
                        </div>
                    </Collapsible.Trigger>

                    <Collapsible.Content className={styles.accordionContent}>
                        <div className={styles.snippetContent}>
                            {component.properties.content || <em style={{ color: 'var(--surface-fg-tertiary)' }}>Empty snippet</em>}
                        </div>
                    </Collapsible.Content>
                </Collapsible.Root>
            </div>
        </div>
    );
};
