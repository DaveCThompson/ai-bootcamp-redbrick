// src/features/PropertiesPanel/PropertiesPanel.tsx
import { useAtomValue, useSetAtom } from 'jotai';
import {
  selectedCanvasComponentIdsAtom,
  isPropertiesPanelVisibleAtom,
} from '../../data/atoms';
import { canvasComponentsByIdAtom, rootComponentIdAtom } from '../../data/promptStateAtoms';
import { componentSnippetSelectorAtom } from '../../data/markdownSelectors';
import { getPropertyEditor } from './propertyEditorRegistry';
import { PanelHeader } from '../../components/PanelHeader';
import { Button } from '../../components/Button';
import { addToastAtom } from '../../data/toastAtoms';
import { getComponentName } from '../EditorCanvas/canvasUtils';
import styles from './PropertiesPanel.module.css';

// Import all editors to trigger their registration side-effects.
import './EmptyStatePanel';
import './MultiSelectEditor';
import './LayoutEditor';
import './WidgetEditor';
import './RootEditor';
import './RoleEditor';

const SnippetPreview = ({ snippet }: { snippet: string | null }) => {
  const addToast = useSetAtom(addToastAtom);

  if (!snippet) {
    return null;
  }

  const handleCopy = () => {
    void navigator.clipboard.writeText(snippet);
    addToast({ message: 'Snippet copied to clipboard', icon: 'content_copy' });
  };

  return (
    <div className={styles.propSection}>
      <div className={styles.snippetHeader}>
        <h4>Snippet Preview</h4>
        <Button variant="secondary" size="s" onClick={handleCopy}>
          <span className="material-symbols-rounded">content_copy</span>
          Copy
        </Button>
      </div>
      <pre className={styles.codeSnippet}>{snippet}</pre>
    </div>
  );
};

export const PropertiesPanel = () => {
  const selectedIds = useAtomValue(selectedCanvasComponentIdsAtom);
  const allComponents = useAtomValue(canvasComponentsByIdAtom);
  const setIsPanelVisible = useSetAtom(isPropertiesPanelVisibleAtom);
  const rootId = useAtomValue(rootComponentIdAtom);
  const getComponentSnippet = useAtomValue(componentSnippetSelectorAtom);

  const primarySelectedId = selectedIds.length > 0 ? selectedIds[0] : null;

  const renderPanelContent = () => {
    if (selectedIds.length > 1) {
      const Editor = getPropertyEditor('multi-select');
      if (!Editor) return null;
      return <Editor count={selectedIds.length} />;
    }

    if (!primarySelectedId) {
        const Editor = getPropertyEditor('empty-state');
        if (!Editor) return null;
        return <Editor />;
    }

    const component = allComponents[primarySelectedId];
    if (!component) return null;

    if (component.id === rootId) {
        const Editor = getPropertyEditor('root');
        if (!Editor) return null;
        return <Editor component={component} />;
    }

    const editorType = component.componentType === 'dynamic' ? component.dynamicType : component.componentType;
    const Editor = getPropertyEditor(editorType);
    if (!Editor) {
        const FallbackEditor = getPropertyEditor('widget');
        if (!FallbackEditor) return <div>No editor found for this component type.</div>;
        return <FallbackEditor component={component} />;
    }
    return <Editor component={component} />;
  };

  let panelTitle = "Properties";
  let snippet: string | null = null;
  if (selectedIds.length > 1) {
    panelTitle = `${selectedIds.length} items selected`;
  } else if (primarySelectedId) {
    const selectedComponent = allComponents[primarySelectedId];
    if(selectedComponent) {
        panelTitle = getComponentName(selectedComponent);
        snippet = getComponentSnippet(primarySelectedId);
    }
  }

  return (
    <div className={styles.propertiesPanelContainer}>
      <PanelHeader title={panelTitle} onClose={() => setIsPanelVisible(false)} />
      <div className={styles.panelContent}>
        {renderPanelContent()}
        <SnippetPreview snippet={snippet} />
      </div>
    </div>
  );
};