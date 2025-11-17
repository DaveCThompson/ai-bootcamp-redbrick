// src/features/PropertiesPanel/TemplateContainerEditor.tsx
import { registerPropertyEditor, PropertyEditorProps } from './propertyEditorRegistry';
import styles from './PropertiesPanel.module.css';

/**
 * A specialized property editor for Template Containers.
 * Since these are locked, form-like components, this editor serves as a
 * placeholder to inform the user that content should be edited directly
 * on the canvas, rather than in the properties panel.
 */
const TemplateContainerEditor = ({ component }: PropertyEditorProps) => {
  if (component.componentType !== 'layout' || !component.properties.isTemplateContainer) {
    return null;
  }

  return (
    <div className={styles.propertiesPanelPlaceholder}>
      <span className={`material-symbols-rounded ${styles.placeholderIcon}`}>source_notes</span>
      <p>{component.name}</p>
      <p style={{ fontSize: '0.8em', color: 'var(--surface-fg-tertiary)'}}>
        This is a locked template. Edit content on the canvas.
      </p>
    </div>
  );
};

registerPropertyEditor('template-container', TemplateContainerEditor);

export default TemplateContainerEditor;