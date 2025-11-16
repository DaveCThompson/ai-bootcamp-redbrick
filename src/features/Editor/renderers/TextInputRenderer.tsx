// src/features/Editor/renderers/TextInputRenderer.tsx
import { memo, useRef } from 'react';
import { useSetAtom } from 'jotai';
import TextareaAutosize from 'react-textarea-autosize';
import { canvasInteractionAtom } from '../../../data/atoms';
import { commitActionAtom } from '../../../data/historyAtoms';
import { useEditable } from '../../../data/useEditable';
import { WidgetComponent } from '../../../types';
import { RendererProps } from './types';
import { useEditorInteractions } from '../useEditorInteractions';
import { CanvasSelectionToolbar } from '../CanvasSelectionToolbar';
import styles from '../EditorCanvas.module.css';

// --- Pure View Component ---
const TextInputView = memo(({ label, required, placeholder, isLabelHidden, content }: { label: string, required: boolean, placeholder?: string, isLabelHidden?: boolean, content?: string }) => {
  const displayContent = content || placeholder || 'Enter your response...';
  
  // For template inputs, we render the content directly in a placeholder-like div
  if (isLabelHidden) {
    return (
       <div className={styles.promptElementContent}>
         <div className={styles.controlPlaceholder} style={{ whiteSpace: 'pre-wrap', minHeight: '36px', height: 'auto', color: content ? 'var(--surface-fg-primary)' : 'var(--surface-fg-tertiary)' }}>
            {displayContent}
          </div>
       </div>
    );
  }

  return (
    <div className={styles.promptElementContent}>
      <label className={styles.promptElementLabel}>
        {label}
        {required && <span className="required-indicator">*</span>}
      </label>
      <div className={styles.controlPlaceholder}>{placeholder}</div>
    </div>
  );
});

// --- Unified Renderer ---
export const TextInputRenderer = ({ component, mode }: RendererProps<WidgetComponent>) => {
  const { isSelected, isEditing, isDragging, isOnlySelection, sortableProps, selectionProps, dndListeners } = useEditorInteractions(component);
  const setInteractionState = useSetAtom(canvasInteractionAtom);
  const commitAction = useSetAtom(commitActionAtom);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const setMergedRefs = (node: HTMLDivElement | null) => {
    wrapperRef.current = node;
    sortableProps.ref(node);
  };

  // Hooks are called unconditionally at the top level
  const handleLabelCommit = (newValue: string) => {
    commitAction({
      action: { type: 'COMPONENT_UPDATE_WIDGET_PROPERTIES', payload: { componentId: component.id, newProperties: { label: newValue } } },
      message: `Rename to '${newValue}'`
    });
    setInteractionState({ mode: 'selecting', ids: [component.id] });
  };
  const handleCancel = () => setInteractionState({ mode: 'selecting', ids: [component.id] });
  const { ref: labelRef, ...labelEditableProps } = useEditable<HTMLInputElement>(component.properties.label, handleLabelCommit, handleCancel, isEditing);

  const handleContentCommit = (newValue: string) => {
    commitAction({
      action: { type: 'COMPONENT_UPDATE_WIDGET_PROPERTIES', payload: { componentId: component.id, newProperties: { content: newValue } } },
      message: `Update text for '${component.properties.label}'`
    });
    setInteractionState({ mode: 'selecting', ids: [component.id] });
  };
  const { ref: contentRef, ...contentEditableProps } = useEditable<HTMLTextAreaElement>(
    component.properties.content || '',
    handleContentCommit,
    handleCancel,
    isEditing,
    { multiline: true }
  );

  if (mode === 'preview') {
    return <TextInputView {...component.properties} />;
  }

  const wrapperClasses = `${styles.sortableItem} ${isDragging ? styles.isDragging : ''}`;
  const selectionClasses = `${styles.selectableWrapper} ${isSelected ? styles.selected : ''}`;
  const isTemplateInput = !!component.properties.isLabelHidden;

  return (
    <div className={wrapperClasses} {...sortableProps} data-id={component.id} ref={setMergedRefs}>
      <div className={selectionClasses} {...selectionProps} {...dndListeners}>
        {isOnlySelection && <CanvasSelectionToolbar componentId={component.id} referenceElement={wrapperRef.current} dndListeners={dndListeners} />}
        
        {isEditing && isTemplateInput ? (
          <div className={styles.promptElementContent}>
            <TextareaAutosize
              {...contentEditableProps}
              ref={contentRef}
              className={`${styles.inlineInput} ${styles['is-p']}`}
              onClick={(e) => e.stopPropagation()}
              placeholder={component.properties.placeholder || 'Enter your response...'}
              minRows={1}
            />
          </div>
        ) : isEditing && !isTemplateInput ? (
          <div className={styles.promptElementContent}>
            <input {...labelEditableProps} ref={labelRef} className={`${styles.inlineInput} ${styles.inlineInputForLabel}`} onClick={(e) => e.stopPropagation()} />
            <div className={styles.controlPlaceholder}>{component.properties.placeholder}</div>
          </div>
        ) : (
          <TextInputView {...component.properties} />
        )}
      </div>
    </div>
  );
};