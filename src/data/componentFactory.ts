// src/data/componentFactory.ts
import { nanoid } from 'nanoid';
import { 
  ContainerComponent, 
  WidgetComponent, 
  DynamicComponent,
} from '../types';

export const createLayoutComponent = (parentId: string, name: string = 'Group'): ContainerComponent => {
  return {
    id: nanoid(8),
    parentId,
    name,
    componentType: 'layout',
    children: [],
    properties: {
      arrangement: 'stack',
    },
  };
};

interface WidgetComponentOptions {
  parentId: string;
  name: string; // This is the initial label or content
  controlType?: WidgetComponent['properties']['controlType'];
  controlTypeProps?: Partial<WidgetComponent['properties']>;
}

export const createWidgetComponent = (options: WidgetComponentOptions): WidgetComponent => {
  const { 
    parentId, 
    name, 
    controlType = 'text-input', 
    controlTypeProps,
  } = options;

  const isTextual = controlType === 'plain-text';

  return {
    id: nanoid(8),
    parentId,
    componentType: 'widget',
    properties: {
      label: isTextual ? '' : name,
      content: isTextual ? name : undefined,
      placeholder: `Enter ${name}`, // Simplified placeholder logic
      controlType: controlType,
      ...controlTypeProps,
    },
  };
};

export const createDynamicComponent = (parentId: string, dynamicType: 'role'): DynamicComponent => {
  return {
    id: nanoid(8),
    parentId,
    name: 'Role',
    componentType: 'dynamic',
    dynamicType,
    // FIX: Removed `children` property as DynamicComponent is no longer a container.
    properties: {
      roleType: 'skeptical-engineer', // Default to the first role
    },
  };
};