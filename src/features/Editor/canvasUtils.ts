// src/features/Editor/canvasUtils.ts
import { CanvasComponent } from "../../types";

// --- UTILITY ---
export const getComponentName = (component: CanvasComponent): string => {
  if (component.componentType === 'layout') {
    return component.name;
  }
  
  // Handle form components
  if (component.properties.controlType === 'plain-text') {
    return component.properties.content?.substring(0, 30) || 'Plain Text';
  }
  return component.properties.label || 'Form Field';
};