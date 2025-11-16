// src/features/PropertiesPanel/WidgetEditor.tsx
import { useSetAtom } from 'jotai';
import { commitActionAtom } from '../../data/promptStateAtoms';
import { WidgetComponent } from '../../types';
import { registerPropertyEditor, PropertyEditorProps } from './propertyEditorRegistry';
import { Switch } from '../../components/Switch';
import { IconToggleGroup } from '../../components/IconToggleGroup';
import { Accordion, AccordionItem } from '../../components/Accordion';
import { getComponentName } from '../EditorCanvas/canvasUtils';
import styles from './PropertiesPanel.module.css';

const sanitizeLabelToFieldName = (label: string): string => {
  if (!label) return '';
  return label
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, '')
    .replace(/[^a-zA-Z0-9]/g, '');
};

const textElementOptions: { value: NonNullable<WidgetComponent['properties']['textElement']>; label: string; icon: string }[] = [
    { value: 'h1', label: 'H1', icon: 'looks_one' },
    { value: 'h2', label: 'H2', icon: 'looks_two' },
    { value: 'h3', label: 'H3', icon: 'looks_3' },
    { value: 'h4', label: 'H4', icon: 'looks_4' },
    { value: 'h5', label: 'H5', icon: 'looks_5' },
    { value: 'h6', label: 'H6', icon: 'looks_6' },
];

const WidgetEditor = ({ component }: PropertyEditorProps) => {
  const commitAction = useSetAtom(commitActionAtom);

  if (component.componentType !== 'field' && component.componentType !== 'widget') {
    return null;
  }
  
  const { controlType, isLabelHidden } = component.properties;

  const handlePropertyChange = (newProperties: Partial<WidgetComponent['properties']>) => {
    commitAction({
      action: {
        type: 'COMPONENT_UPDATE_WIDGET_PROPERTIES',
        payload: { componentId: component.id, newProperties }
      },
      message: `Update properties for '${getComponentName(component)}'`
    });
  };
  
  const handleLabelChange = (newLabel: string) => {
    const newFieldName = sanitizeLabelToFieldName(newLabel);
    const newPlaceholder = `Enter ${newLabel}`;
    handlePropertyChange({ label: newLabel, fieldName: newFieldName, placeholder: newPlaceholder });
  };

  if (controlType === 'plain-text') {
    const isHeading = component.properties.textElement?.startsWith('h');
    return (
      <Accordion defaultValue={['text-settings']}>
        <AccordionItem value="text-settings" trigger="Text Settings">
          {isHeading && (
            <div className={styles.propItem}>
              <label>Heading Level</label>
              <IconToggleGroup
                  options={textElementOptions}
                  value={component.properties.textElement || 'p'}
                  onValueChange={value => handlePropertyChange({ textElement: value as WidgetComponent['properties']['textElement'] })}
              />
            </div>
          )}
          <div className={styles.propItem}>
            <label htmlFor={`content-${component.id}`}>Content</label>
            <textarea
              id={`content-${component.id}`}
              className={styles.propTextarea}
              value={component.properties.content || ''}
              onChange={(e) => handlePropertyChange({ content: e.target.value })}
              rows={6}
            />
          </div>
        </AccordionItem>
      </Accordion>
    );
  }

  return (
    <Accordion defaultValue={['display', 'field-settings', 'validation']}>
      <AccordionItem value="field-settings" trigger="Field Settings">
        {!isLabelHidden && (
          <div className={styles.propItem}>
            <label htmlFor={`label-${component.id}`}>Label</label>
            <input
              id={`label-${component.id}`}
              type="text"
              value={component.properties.label}
              onChange={(e) => handleLabelChange(e.target.value)}
            />
          </div>
        )}
        {controlType !== 'radio-buttons' && (
          <div className={styles.propItem}>
            <label htmlFor={`placeholder-${component.id}`}>Placeholder</label>
            <input
              id={`placeholder-${component.id}`}
              type="text"
              value={component.properties.placeholder || ''}
              onChange={(e) => handlePropertyChange({ placeholder: e.target.value })}
            />
          </div>
        )}
        <div className={styles.propItem}>
          <label htmlFor={`hint-${component.id}`}>Hint Text</label>
          <input
            id={`hint-${component.id}`}
            type="text"
            value={component.properties.hintText || ''}
            onChange={(e) => handlePropertyChange({ hintText: e.target.value })}
          />
        </div>
      </AccordionItem>

      <AccordionItem value="validation" trigger="Validation">
        <div className={styles.propItemToggle}>
          <label htmlFor={`required-${component.id}`}>Required</label>
          <Switch
            id={`required-${component.id}`}
            checked={component.properties.required}
            onCheckedChange={(checked) => handlePropertyChange({ required: checked })}
          />
        </div>
      </AccordionItem>
    </Accordion>
  );
};

registerPropertyEditor('widget', WidgetEditor);
registerPropertyEditor('field', WidgetEditor);

export default WidgetEditor;