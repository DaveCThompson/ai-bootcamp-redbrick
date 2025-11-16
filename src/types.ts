// src/types.ts

// =================================================================
//                         Component Core Shapes
// =================================================================

// The base for all components on the canvas
interface BaseCanvasComponent {
  id: string;
  parentId: string;
  isLocked?: boolean; // To prevent editing/deleting template items
}

// A structural component for organizing other components
export interface LayoutComponent extends BaseCanvasComponent {
  componentType: 'layout';
  name:string;
  children: string[];
  properties: {
    arrangement: 'stack' | 'row';
  };
}

// A component that represents a form field or a static widget
export interface WidgetComponent extends BaseCanvasComponent {
  componentType: 'field' | 'widget';
  properties: {
    // Common
    label: string;
    isLabelHidden?: boolean; // To hide labels for template inputs
    required: boolean;
    placeholder?: string;
    hintText?: string;
    fieldName?: string;
    // NEW: For structured template inputs
    staticLabel?: string; 
    // Widget-specific
    content?: string;
    textElement?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    // Field-specific
    controlType: 'text-input' | 'dropdown' | 'checkbox' | 'radio-buttons' | 'plain-text';
  };
}

// A component that derives its content from a selected type
export interface DynamicComponent extends BaseCanvasComponent {
  componentType: 'dynamic';
  name: string;
  dynamicType: 'role';
  children: string[];
  properties: {
    roleType: string;
  };
}

export type CanvasComponent = LayoutComponent | WidgetComponent | DynamicComponent;

// A map of component IDs to their data, for efficient lookups
export type NormalizedCanvasComponents = Record<string, CanvasComponent>;


// =================================================================
//                         Supporting Types
// =================================================================

// For items in the component browser
export interface DraggableComponent {
  id: string;
  name: string;
  type: 'layout' | 'widget' | 'dynamic' | 'template'; // Added 'template'
  icon: string;
}

export interface ComponentGroup {
  title: string;
  components: DraggableComponent[];
}

// For dnd-kit's `data` property
export interface DndData {
  id: string;
  name: string;
  type: 'layout' | 'widget' | 'field' | 'dynamic' | 'template'; // Added 'template'
  icon: string;
  isNew: boolean;
  isTemplate?: boolean; // To identify template drags
  controlType?: WidgetComponent['properties']['controlType'];
  controlTypeProps?: Partial<WidgetComponent['properties']>;
  dynamicType?: DynamicComponent['dynamicType'];
  childrenCount?: number;
}