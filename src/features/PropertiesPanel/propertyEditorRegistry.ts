// src/features/PropertiesPanel/propertyEditorRegistry.ts
import React from 'react';
import { CanvasComponent } from '../../types';

// The interface for any property editor component
export interface PropertyEditorProps {
  component: CanvasComponent;
}

export interface MultiSelectEditorProps {
    count: number;
}

// FIX: Widened to `any` to allow registration of components with different prop shapes.
// Type safety will be enforced at the call site in PropertiesPanel.tsx.
type EditorComponent = React.ComponentType<any>;


// The registry itself: a simple map of component type to its editor component
const registry: Map<string, EditorComponent> = new Map();

export const registerPropertyEditor = (
  componentType: string,
  editor: EditorComponent,
) => {
  if (registry.has(componentType)) {
    console.warn(`Overwriting property editor for type: ${componentType}`);
  }
  registry.set(componentType, editor);
};

export const getPropertyEditor = (
  componentType: string
): EditorComponent | undefined => {
  return registry.get(componentType);
};