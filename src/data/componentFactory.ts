// src/data/componentFactory.ts
import { nanoid } from 'nanoid';
import { 
  LayoutComponent, 
  FormComponent, 
  DynamicComponent,
} from '../types';

export const createLayoutComponent = (parentId: string, name: string = 'Context Container'): LayoutComponent => {
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

interface FormComponentOptions {
  parentId: string;
  name: string; // This is the initial label or content
  controlType?: FormComponent['properties']['controlType'];
  controlTypeProps?: Partial<FormComponent['properties']>;
}

export const createFormComponent = (options: FormComponentOptions): FormComponent => {
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
      required: false,
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
    children: [],
    properties: {
      roleType: 'skeptical-engineer', // Default to the first role
    },
  };
};