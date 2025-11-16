// src/features/Editor/PropertiesPanel/PropertiesPanel.tsx
import React from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  selectedCanvasComponentIdsAtom,
  isPropertiesPanelVisibleAtom,
} from '../../../data/atoms';
import { canvasComponentsByIdAtom, rootComponentIdAtom } from '../../../data/historyAtoms';
import { getPropertyEditor, MultiSelectEditorProps, PropertyEditorProps } from './propertyEditorRegistry';
import { PanelHeader } from '../../../components/PanelHeader';
import { getComponentName } from '../canvasUtils';
import { CanvasComponent, LayoutComponent } from '../../../types';
import styles from './PropertiesPanel.module.css';

// Import all editors to trigger their registration side-effects.
// This is the single point of entry for all property panel UIs.
import './EmptyStatePanel';
import './MultiSelectEditor';
import './LayoutEditor';
import './FormEditor';
import './RootEditor';


export const PropertiesPanel = () => {
  const selectedIds = useAtomValue(selectedCanvasComponentIdsAtom);
  const allComponents = useAtomValue(canvasComponentsByIdAtom);
  const setIsPanelVisible = useSetAtom(isPropertiesPanelVisibleAtom);
  const rootId = useAtomValue(rootComponentIdAtom);

  const primarySelectedId = selectedIds.length > 0 ? selectedIds[0] : null;

  const renderPanelContent = () => {
    if (selectedIds.length > 1) {
      const Editor = getPropertyEditor('multi-select');
      if (!Editor) return null;
      const MultiSelectEditor = Editor as React.ComponentType<MultiSelectEditorProps>;
      return <MultiSelectEditor count={selectedIds.length} />;
    }

    if (!primarySelectedId) {
        const Editor = getPropertyEditor('empty-state');
        if (!Editor) return null;
        const EmptyStatePanel = Editor as React.ComponentType<Record<string, never>>;
        return <EmptyStatePanel />;
    }

    const component = allComponents[primarySelectedId];
    if (!component) return null;

    if (component.id === rootId) {
        const Editor = getPropertyEditor('root');
        if (!Editor) return null;
        const RootEditor = Editor as React.ComponentType<PropertyEditorProps<LayoutComponent>>;
        return <RootEditor component={component as LayoutComponent} />;
    }

    const Editor = getPropertyEditor(component.componentType);
    if (!Editor) return null;
    const ComponentEditor = Editor as React.ComponentType<PropertyEditorProps<CanvasComponent>>;
    return <ComponentEditor component={component} />;
  };

  let panelTitle = "Properties";
  if (selectedIds.length > 1) {
    panelTitle = `${selectedIds.length} items selected`;
  } else if (primarySelectedId) {
    const selectedComponent = allComponents[primarySelectedId];
    if(selectedComponent) {
        panelTitle = getComponentName(selectedComponent);
    }
  }

  return (
    <div className={styles.propertiesPanelContainer}>
      <PanelHeader title={panelTitle} onClose={() => setIsPanelVisible(false)} />
      <div className={styles.panelContent}>
        {renderPanelContent()}
      </div>
    </div>
  );
};