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

// A structural component for organizing other components.
// This is the ONLY component type that can have children.
export interface ContainerComponent extends BaseCanvasComponent {
  componentType: 'layout';
  name: string;
  children: string[];
  properties: {
    arrangement: 'stack' | 'row';
    isTemplateContainer?: boolean; // A flag for the special, locked form-like template.
  };
}

// A component that represents a form field or a static widget.
export interface WidgetComponent extends BaseCanvasComponent {
  componentType: 'field' | 'widget';
  properties: {
    // Common
    label: string;
    isLabelHidden?: boolean; // To hide labels for template inputs
    placeholder?: string;
    hintText?: string;
    fieldName?: string;
    // Widget-specific
    content?: string;
    textElement?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    // Field-specific
    controlType: 'text-input' | 'dropdown' | 'radio-buttons' | 'plain-text';
  };
}

// A component that represents a non-nestable variable, like a persona/role.
// It is an atomic block and CANNOT have children.
export interface DynamicComponent extends BaseCanvasComponent {
  componentType: 'dynamic';
  name: string;
  dynamicType: 'role';
  properties: {
    roleType: string;
  };
}

// A new component type for snippet instances on canvas
export interface SnippetInstanceComponent extends BaseCanvasComponent {
  componentType: 'snippet-instance';
  name: string; // Displayed in accordion header
  properties: {
    snippetId: string; // Reference to source snippet (for potential future sync)
    content: string; // Snapshot of content at time of creation
    isExpanded: boolean; // UI state for accordion
  };
}

export type CanvasComponent = ContainerComponent | WidgetComponent | DynamicComponent | SnippetInstanceComponent;

// A map of component IDs to their data, for efficient lookups
export type NormalizedCanvasComponents = Record<string, CanvasComponent>;

// A snippet definition in the library
export interface Snippet {
  id: string; // UUID
  name: string; // User-provided name
  content: string; // Snippet content
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}


// =================================================================
//                         Supporting Types
// =================================================================

// For items in the component browser
export interface DraggableComponent {
  id: string;
  name: string;
  type: 'layout' | 'widget' | 'dynamic' | 'template' | 'snippet';
  icon: string;
}

export interface ComponentGroup {
  title: string;
  labId?: string;
  components: DraggableComponent[];
}

// For dnd-kit's `data` property
export interface DndData {
  id: string;
  name: string;
  type: 'layout' | 'widget' | 'field' | 'dynamic' | 'template' | 'snippet' | 'snippet-instance';
  icon: string;
  isNew: boolean;
  isTemplate?: boolean;
  isSnippet?: boolean;
  snippetId?: string;
  snippetContent?: string;
  controlType?: WidgetComponent['properties']['controlType'];
  controlTypeProps?: Partial<WidgetComponent['properties']>;
  dynamicType?: DynamicComponent['dynamicType'];
  childrenCount?: number;
}