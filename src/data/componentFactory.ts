// src/data/componentFactory.ts
import { nanoid } from 'nanoid';
import { 
  LayoutComponent, 
  FormComponent, 
  BoundData
} from '../types';

const sanitizeLabelToFieldName = (label: string): string => {
  if (!label) return '';
  return label
    .trim()
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, '')
    .replace(/[^a-zA-Z0-9]/g, '');
};

export const createLayoutComponent = (parentId: string, name: string = 'Group'): LayoutComponent => {
  return {
    id: nanoid(8),
    parentId,
    name,
    componentType: 'layout',
    children: [],
    properties: {
      arrangement: 'stack', // Simplified: always a vertical stack
    },
  };
};

interface FormComponentOptions {
  parentId: string;
  name: string; // This is the initial label or content
  origin?: 'data' | 'general';
  controlType?: FormComponent['properties']['controlType'];
  controlTypeProps?: Partial<FormComponent['properties']>;
  bindingData?: { nodeId: string, nodeName: string, fieldId: string, path: string };
}

export const createFormComponent = (options: FormComponentOptions): FormComponent => {
  const { 
    parentId, 
    name, 
    origin, 
    controlType = 'text-input', 
    controlTypeProps, 
    bindingData 
  } = options;

  const newBinding: BoundData | null = (origin === 'data' && bindingData)
    ? {
        nodeId: bindingData.nodeId,
        nodeName: bindingData.nodeName,
        fieldId: bindingData.fieldId,
        fieldName: name,
        path: bindingData.path,
      }
    : null;

  const isTextual = controlType === 'plain-text';

  return {
    id: nanoid(8),
    parentId,
    componentType: 'widget', // Default to widget, can be refined if needed
    origin,
    binding: newBinding,
    properties: {
      label: isTextual ? '' : name,
      content: isTextual ? name : undefined,
      fieldName: isTextual ? '' : sanitizeLabelToFieldName(name),
      required: false,
      placeholder: origin === 'data' ? `Enter ${name}` : '',
      controlType: controlType,
      ...controlTypeProps,
    },
  };
};