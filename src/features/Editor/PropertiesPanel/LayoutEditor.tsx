// src/features/Editor/PropertiesPanel/LayoutEditor.tsx
import { CanvasComponent } from '../../../types';
import { registerPropertyEditor, PropertyEditorProps } from './propertyEditorRegistry';
import styles from './PropertiesPanel.module.css';

const LayoutEditor = ({ component }: PropertyEditorProps<CanvasComponent>) => {
  if (component.componentType !== 'layout') {
    return null;
  }

  return (
    <div className={styles.propertiesPanelPlaceholder}>
      <span className={`material-symbols-rounded ${styles.placeholderIcon}`}>view_quilt</span>
      <p>This is a structural group.</p>
      <p style={{ fontSize: '0.8em', color: 'var(--surface-fg-tertiary)'}}>
        It has no configurable properties.
      </p>
    </div>
  );
};

registerPropertyEditor('layout', LayoutEditor);

export default LayoutEditor;