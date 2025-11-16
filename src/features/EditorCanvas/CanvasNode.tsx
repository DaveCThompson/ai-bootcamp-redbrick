// src/features/EditorCanvas/CanvasNode.tsx
import { useAtomValue } from 'jotai';
import { canvasComponentsByIdAtom } from '../../data/promptStateAtoms';
import { CanvasComponent } from '../../types';

// Import all the new unified renderers
import { TextInputRenderer } from './renderers/TextInputRenderer';
import { PlainTextRenderer } from './renderers/PlainTextRenderer';
import { LayoutRenderer } from './renderers/LayoutRenderer';
import { CheckboxRenderer } from './renderers/CheckboxRenderer';
import { RoleRenderer } from './renderers/RoleRenderer';
import { TemplateContainerRenderer } from './renderers/TemplateContainerRenderer';

// --- ORCHESTRATOR COMPONENT ---
export const CanvasNode = ({ componentId }: { componentId: string }) => {
  const allComponents = useAtomValue(canvasComponentsByIdAtom);
  const component = allComponents[componentId];

  if (!component) {
    return null;
  }

  // --- RENDERER ROUTER ---
  const renderComponent = (comp: CanvasComponent) => {
    switch (comp.componentType) {
      case 'layout':
        // NEW: Route to the specialized template renderer if the flag is set
        if (comp.properties.isTemplateContainer) {
          return <TemplateContainerRenderer component={comp} mode="canvas" />;
        }
        return <LayoutRenderer component={comp} mode="canvas" />;
      case 'dynamic':
        if (comp.dynamicType === 'role') {
          return <RoleRenderer component={comp} mode="canvas" />;
        }
        return <div>Unknown dynamic type</div>;
      case 'widget':
      case 'field':
        switch (comp.properties.controlType) {
          case 'text-input':
            return <TextInputRenderer component={comp} mode="canvas" />;
          case 'plain-text':
            return <PlainTextRenderer component={comp} mode="canvas" />;
          case 'checkbox':
            return <CheckboxRenderer component={comp} mode="canvas" />;
          default:
            return <div>Unknown control type</div>;
        }
      default:
        return <div>Unknown component type</div>;
    }
  };

  return <>{renderComponent(component)}</>;
};