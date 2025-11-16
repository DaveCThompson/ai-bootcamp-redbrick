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

// This is a deliberate use of `any` to allow for a heterogeneous registry
// of components with different prop shapes. Type safety is ensured by the
// conditional logic in `PropertiesPanel.tsx`.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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