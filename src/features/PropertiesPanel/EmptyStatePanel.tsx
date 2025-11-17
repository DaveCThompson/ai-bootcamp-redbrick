// src/features/PropertiesPanel/EmptyStatePanel.tsx
import { registerPropertyEditor } from './propertyEditorRegistry';
import styles from './PropertiesPanel.module.css';

const EmptyStatePanel = () => (
  <div className={`${styles.propertiesPanelPlaceholder} ${styles.isFullHeight}`}>
    <span className={`material-symbols-rounded ${styles.placeholderIcon}`}>touch_app</span>
    <p>Select a prompt element to see its properties.</p>
  </div>
);

registerPropertyEditor('empty-state', EmptyStatePanel);
export default EmptyStatePanel;