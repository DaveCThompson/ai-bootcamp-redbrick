// src/features/EditorCanvas/renderers/TemplateContainerRenderer.tsx
import { useState, useEffect, useRef } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import TextareaAutosize from 'react-textarea-autosize';
import { canvasComponentsByIdAtom, commitActionAtom } from '../../../data/promptStateAtoms';
import { ContainerComponent, WidgetComponent } from '../../../types';
import { RendererProps } from './types';
import { useEditorInteractions } from '../useEditorInteractions';
import { CanvasSelectionToolbar } from '../CanvasSelectionToolbar';
import styles from '../EditorCanvas.module.css';

// Internal component to manage the state of a single form item
const TemplateFormItem = ({ component }: { component: WidgetComponent }) => {
  const commitAction = useSetAtom(commitActionAtom);
  const [value, setValue] = useState(component.properties.content || '');

  // Sync with global state if it changes (e.g., from undo/redo)
  useEffect(() => {
    setValue(component.properties.content || '');
  }, [component.properties.content]);

  const handleBlur = () => {
    // Only commit if the value has actually changed
    if (value !== (component.properties.content || '')) {
      commitAction({
        action: {
          type: 'COMPONENT_UPDATE_WIDGET_PROPERTIES',
          payload: { componentId: component.id, newProperties: { content: value } }
        },
        message: `Update content for '${component.properties.label}'`
      });
    }
  };

  return (
    <div className={styles.templateItem}>
      <label className={styles.templateItemLabel} htmlFor={component.id}>
        {component.properties.label}
      </label>
      <TextareaAutosize
        id={component.id}
        className={styles.templateItemInput}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        placeholder={component.properties.placeholder || "Enter your response..."}
        minRows={1}
      />
    </div>
  );
};


// The main renderer for the entire template block
export const TemplateContainerRenderer = ({ component }: RendererProps<ContainerComponent>) => {
  const { isSelected, isDragging, isOnlySelection, sortableProps, selectionProps, dndListeners } = useEditorInteractions(component);
  const allComponents = useAtomValue(canvasComponentsByIdAtom);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const setMergedRefs = (node: HTMLDivElement | null) => {
    wrapperRef.current = node;
    sortableProps.ref(node);
  };
  
  const wrapperClasses = `${styles.sortableItem} ${isDragging ? styles.isDragging : ''}`;
  // The selectable wrapper provides the blue outline for the whole block
  const selectionClasses = `${styles.selectableWrapper} ${isSelected ? styles.selected : ''}`;

  return (
    <div className={wrapperClasses} {...sortableProps} data-id={component.id} ref={setMergedRefs}>
      <div className={selectionClasses} {...selectionProps} {...dndListeners}>
        {isOnlySelection && <CanvasSelectionToolbar componentId={component.id} referenceElement={wrapperRef.current} dndListeners={dndListeners} />}
        
        <div className={styles.templateContainer}>
            <h2 className={styles.panelTitle}>{component.name}</h2>
            {component.children.map(childId => {
                const childComponent = allComponents[childId] as WidgetComponent | undefined;
                if (!childComponent) return null;
                return <TemplateFormItem key={childId} component={childComponent} />;
            })}
        </div>
      </div>
    </div>
  );
};