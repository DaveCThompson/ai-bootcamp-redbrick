// src/types.ts
import { UniqueIdentifier } from '@dnd-kit/core';

// =================================================================
//                 COMPONENT BROWSER & DND-KIT
// =================================================================
export interface DraggableComponent {
  id: string;
  name: string;
  type: 'layout' | 'widget' | 'field';
  icon: string;
  iconColor?: string;
}

export interface ComponentGroup {
  title: string;
  components: DraggableComponent[];
}

export interface DndData {
  id: UniqueIdentifier;
  name: string;
  type: string;
  icon?: string;
  isNew?: boolean;
  controlType?: FormComponent['properties']['controlType'];
  controlTypeProps?: Partial<FormComponent['properties']>;
  childrenCount?: number;
}


// =================================================================
//                       CANVAS COMPONENTS
// =================================================================

export type AppearanceType = 'transparent' | 'primary' | 'secondary' | 'tertiary' | 'info' | 'warning' | 'error';
export interface AppearanceProperties {
  type: AppearanceType;
  bordered: boolean;
  padding: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

interface BaseComponent {
  id: string;
  parentId: string;
  contextualLayout?: {
    columnSpan?: number;
    preventShrinking?: boolean;
  };
}

export interface LayoutComponent extends BaseComponent {
  componentType: 'layout';
  name: string;
  children: string[];
  properties: {
    arrangement: 'stack' | 'row' | 'wrap' | 'grid';
    gap: 'none' | 'sm' | 'md' | 'lg';
    distribution: 'start' | 'center' | 'end' | 'space-between';
    verticalAlign: 'start' | 'center' | 'end' | 'stretch';
    columnLayout: 'auto' | '2-col-50-50' | '3-col-33' | '2-col-split-left' | number;
    appearance: AppearanceProperties;
  };
}

export interface FormComponent extends BaseComponent {
  componentType: 'widget' | 'field';
  properties: {
    label: string;
    content?: string;
    fieldName: string;
    required: boolean;
    hintText?: string;
    placeholder?: string;
    controlType: 'text-input' | 'dropdown' | 'radio-buttons' | 'plain-text' | 'link' | 'checkbox';
    // Properties for Link
    href?: string;
    target?: '_self' | '_blank';
    // Properties for Plain Text
    textElement?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div';
  };
}

export type CanvasComponent = LayoutComponent | FormComponent;

export type NormalizedCanvasComponents = {
  [id: string]: CanvasComponent;
};