// src/data/promptElementsMock.ts
import { ComponentGroup } from '../types';

export const promptElements: ComponentGroup[] = [
  {
    title: 'Structure & Context',
    labId: 'lab-3',
    components: [
      { id: 'group-container', name: 'Group', type: 'layout', icon: 'view_quilt' },
      { id: 'heading', name: 'Section Header', type: 'widget', icon: 'title' },
      { id: 'paragraph', name: 'Text Block', type: 'widget', icon: 'notes' },
    ],
  },
  {
    title: 'Variables',
    labId: 'lab-2',
    components: [
      { id: 'role-container', name: 'Role', type: 'dynamic', icon: 'person' },
      { id: 'text-input', name: 'Text Input', type: 'widget', icon: 'text_fields' },
    ],
  },
];