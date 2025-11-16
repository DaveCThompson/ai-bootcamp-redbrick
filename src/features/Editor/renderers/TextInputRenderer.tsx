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
const TextInputView = memo(({ label, required, placeholder, isLabelHidden, content, staticLabel }: WidgetComponent['properties']) => {
  // Render the new structured template input
  if (staticLabel) {
    const displayContent = content || 'Enter your response...';
    return (
      <div className={styles.templateInputWrapper}>
        <h3 className={styles.templateStaticLabel}>{staticLabel}</h3>
        <div className={styles.controlPlaceholder} style={{ 
          whiteSpace: 'pre-wrap', 
          minHeight: '36px', 
          height: 'auto', 
          color: content ? 'var(--surface-fg-primary)' : 'var(--surface-fg-tertiary)',
          padding: 'var(--spacing-2) var(--spacing-3)',
        }}>
          {displayContent}
        </div>
      </div>
    );
  }

  // Render the standard text input
  return (
    <div className={styles.promptElementContent}>
      {!isLabelHidden && (
        <label className={styles.promptElementLabel}>
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}
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

  const handleCancel = () => setInteractionState({ mode: 'selecting', ids: [component.id] });

  const handleLabelCommit = (newValue: string) => {
    commitAction({
      action: { type: 'COMPONENT_UPDATE_WIDGET_PROPERTIES', payload: { componentId: component.id, newProperties: { label: newValue } } },
      message: `Rename to '${newValue}'`
    });
    setInteractionState({ mode: 'selecting', ids: [component.id] });
  };
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
  const isTemplateInput = !!component.properties.staticLabel;

  const renderEditingState = () => {
    if (!isEditing) return null;

    if (isTemplateInput) {
      return (
        <div className={styles.templateInputWrapper}>
          <h3 className={styles.templateStaticLabel}>{component.properties.staticLabel}</h3>
          <TextareaAutosize
            {...contentEditableProps}
            ref={contentRef}
            className={`${styles.inlineInput} ${styles['is-p']}`}
            onClick={(e) => e.stopPropagation()}
            placeholder={'Enter your response...'}
            minRows={1}
            style={{
              padding: 'var(--spacing-2) var(--spacing-3)',
              backgroundColor: 'var(--surface-bg-secondary_subtle)',
            }}
          />
        </div>
      );
    }
    
    return (
      <div className={styles.promptElementContent}>
        <input {...labelEditableProps} ref={labelRef} className={`${styles.inlineInput} ${styles.inlineInputForLabel}`} onClick={(e) => e.stopPropagation()} />
        <div className={styles.controlPlaceholder}>{component.properties.placeholder}</div>
      </div>
    );
  };

  return (
    <div className={wrapperClasses} {...sortableProps} data-id={component.id} ref={setMergedRefs}>
      <div className={selectionClasses} {...selectionProps} {...dndListeners}>
        {isOnlySelection && <CanvasSelectionToolbar componentId={component.id} referenceElement={wrapperRef.current} dndListeners={dndListeners} />}
        {isEditing ? renderEditingState() : <TextInputView {...component.properties} />}
      </div>
    </div>
  );
};