// src/features/EditorCanvas/renderers/SnippetInstanceRenderer.tsx
import { useRef } from 'react';
import { useSetAtom } from 'jotai';
import * as Collapsible from '@radix-ui/react-collapsible';
import { SnippetInstanceComponent } from '../../../types';
import { commitActionAtom } from '../../../data/promptStateAtoms';
import { useEditorInteractions } from '../useEditorInteractions';
import styles from '../EditorCanvas.module.css';

interface SnippetInstanceRendererProps {
    component: SnippetInstanceComponent;
    mode?: 'canvas' | 'preview';
}

export const SnippetInstanceRenderer = ({ component, mode = 'canvas' }: SnippetInstanceRendererProps) => {
    const commitAction = useSetAtom(commitActionAtom);
    const { isExpanded } = component.properties;
    const localRef = useRef<HTMLDivElement | null>(null);

    // Cast to CanvasComponent since useEditorInteractions expects the full union type
    // SnippetInstanceComponent is a valid CanvasComponent as per types.ts
    const { isSelected, sortableProps, selectionProps, contextMenuProps, dndListeners } = useEditorInteractions(
        component as unknown as import('../../../types').CanvasComponent
    );

    const handleToggle = () => {
        commitAction({
            action: { type: 'SNIPPET_TOGGLE_EXPAND', payload: { componentId: component.id } },
            message: `${isExpanded ? 'Collapse' : 'Expand'} snippet`
        });
    };

    const wrapperClasses = `
    ${styles.selectableWrapper} 
    ${isSelected ? styles.selected : ''} 
    ${styles.sortableItem}
  `.trim();

    // Merge refs
    const setRefs = (node: HTMLDivElement | null) => {
        localRef.current = node;
        if (sortableProps.ref) {
            (sortableProps.ref as (node: HTMLDivElement | null) => void)(node);
        }
    };

    if (mode === 'preview') {
        return (
            <div className={styles.sortableItem}>
                <div className={styles.snippetHeader}>
                    <span className={`material-symbols-rounded ${styles.snippetHeaderIcon}`}>text_snippet</span>
                    <span className={styles.snippetTitle}>{component.name}</span>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={setRefs}
            className={wrapperClasses}
            style={sortableProps.style}
            {...selectionProps}
            {...contextMenuProps}
            {...dndListeners}
        >

            <Collapsible.Root open={isExpanded} onOpenChange={handleToggle}>
                <Collapsible.Trigger asChild>
                    <div className={styles.snippetHeader}>
                        <span className={`material-symbols-rounded ${styles.snippetHeaderIcon}`}>text_snippet</span>
                        <span className={styles.snippetTitle}>{component.name}</span>
                        <span className={`material-symbols-rounded ${styles.snippetChevron} ${isExpanded ? styles.snippetChevronExpanded : ''}`}>
                            expand_more
                        </span>
                    </div>
                </Collapsible.Trigger>

                <Collapsible.Content>
                    <div className={styles.snippetContent}>
                        {component.properties.content || <em style={{ color: 'var(--surface-fg-tertiary)' }}>Empty snippet</em>}
                    </div>
                </Collapsible.Content>
            </Collapsible.Root>
        </div>
    );
};
