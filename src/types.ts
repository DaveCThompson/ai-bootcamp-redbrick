// src/types.ts

// =================================================================
//                         Component Core Shapes
// =================================================================

// The base for all components on the canvas
interface BaseCanvasComponent {
  id: string;
  parentId: string;
  contextualLayout?: {
    columnSpan?: number;
    preventShrinking?: boolean;
  };
}

// A structural component for organizing other components
export interface LayoutComponent extends BaseCanvasComponent {
  componentType: 'layout';
  name: string;
  children: string[];
  properties: {
    // NOTE: Simplified to a single, non-configurable arrangement.
    // Other properties like gap, distribution, etc., have been removed.
    arrangement: 'stack' | 'row';
  };
}

// A component that represents a form field or a static widget
export interface FormComponent extends BaseCanvasComponent {
  componentType: 'field' | 'widget';
  origin?: 'data' | 'general';
  binding?: BoundData | null;
  properties: {
    // Common
    label: string;
    required: boolean;
    placeholder?: string;
    hintText?: string;
    fieldName?: string;
    // Widget-specific
    content?: string;
    textElement?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    // Field-specific
    controlType: 'text-input' | 'dropdown' | 'checkbox' | 'radio-buttons' | 'plain-text';
  };
}

export type CanvasComponent = LayoutComponent | FormComponent;

// A map of component IDs to their data, for efficient lookups
export type NormalizedCanvasComponents = Record<string, CanvasComponent>;


// =================================================================
//                         Supporting Types
// =================================================================

export interface BoundData {
  nodeId: string;
  nodeName: string;
  fieldId: string;
  fieldName: string;
  path: string;
}

// For items in the component browser
export interface DraggableComponent {
  id: string;
  name: string;
  type: 'layout' | 'widget';
  icon: string;
  iconColor?: string;
}

export interface ComponentGroup {
  title: string;
  components: DraggableComponent[];
}

// For dnd-kit's `data` property
export interface DndData {
  id: string;
  name: string;
  type: 'layout' | 'widget' | 'field';
  icon: string;
  isNew: boolean;
  origin?: 'data' | 'general';
  controlType?: FormComponent['properties']['controlType'];
  controlTypeProps?: Partial<FormComponent['properties']>;
  childrenCount?: number;
}