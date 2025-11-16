// src/features/EditorCanvas/canvasUtils.ts
import { CanvasComponent } from "../../types";
import { roles } from "../../data/rolesMock";

// --- UTILITY ---
export const getComponentName = (component: CanvasComponent): string => {
  if (component.componentType === 'layout') {
    return component.name;
  }

  if (component.componentType === 'dynamic') {
    if (component.dynamicType === 'role') {
      return roles[component.properties.roleType]?.label || 'Role';
    }
    return component.name;
  }
  
  // Handle widget components
  if (component.componentType === 'widget' || component.componentType === 'field') {
    if (component.properties.controlType === 'plain-text') {
      return component.properties.textElement === 'p' ? 'Text Block' : 'Section Header';
    }
    return component.properties.label || 'Input Field';
  }

  return 'Unnamed Component';
};