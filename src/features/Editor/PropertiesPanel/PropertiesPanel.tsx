// src/features/Editor/PropertiesPanel/RootEditor.tsx
import { CanvasComponent } from '../../../types';
import { registerPropertyEditor, PropertyEditorProps } from './propertyEditorRegistry';
import styles from './PropertiesPanel.module.css';

const RootEditor = ({ component }: PropertyEditorProps<CanvasComponent>) => {
  if (component.componentType !== 'layout') {
    return null;
  }

  return (
    <div className={styles.propertiesPanelPlaceholder}>
      <span className={`material-symbols-rounded ${styles.placeholderIcon}`}>apps</span>
      <p>Root Container</p>
      <p style={{ fontSize: '0.8em', color: 'var(--surface-fg-tertiary)'}}>
        This is the main container for all components.
      </p>
    </div>
  );
};

registerPropertyEditor('root', RootEditor);

export default RootEditor;