// src/features/EditorCanvas/CanvasNode.tsx
import { useAtomValue } from 'jotai';
import { canvasComponentsByIdAtom } from '../../data/promptStateAtoms';
import { CanvasComponent } from '../../types';

import { TextInputRenderer } from './renderers/TextInputRenderer';
import { PlainTextRenderer } from './renderers/PlainTextRenderer';
import { LayoutRenderer } from './renderers/LayoutRenderer';
import { RoleRenderer } from './renderers/RoleRenderer';
import { TemplateContainerRenderer } from './renderers/TemplateContainerRenderer';
import { SnippetInstanceRenderer } from './renderers/SnippetInstanceRenderer';

/**
 * ARCHITECTURE: This is the central "Renderer Router" for the canvas.
 * Its single responsibility is to inspect a component's data and delegate
 * the rendering to the correct, specialized renderer component.
 * This pattern keeps individual renderers clean, focused, and compliant with the
 * Single Responsibility Principle. To add a new component type, you should
 * create a new renderer and add its routing logic here.
 */
export const CanvasNode = ({ componentId }: { componentId: string }) => {
  const allComponents = useAtomValue(canvasComponentsByIdAtom);
  const component = allComponents[componentId];

  if (!component) {
    return null;
  }

  const renderComponent = (comp: CanvasComponent) => {
    switch (comp.componentType) {
      case 'layout':
        // Route to the specialized template renderer if the `isTemplateContainer` flag is set.
        if (comp.properties.isTemplateContainer) {
          return <TemplateContainerRenderer component={comp} mode="canvas" />;
        }
        // Otherwise, use the default layout renderer.
        return <LayoutRenderer component={comp} mode="canvas" />;
      case 'snippet-instance':
        return <SnippetInstanceRenderer component={comp} mode="canvas" />;
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
          default:
            return <div>Unknown control type</div>;
        }
      default:
        return <div>Unknown component type</div>;
    }
  };

  return <>{renderComponent(component)}</>;
};