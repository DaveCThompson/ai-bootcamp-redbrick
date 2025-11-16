// src/data/promptElementsMock.ts
import { ComponentGroup } from '../types';

export const promptElements: ComponentGroup[] = [
  {
    title: 'Structure',
    components: [
      { id: 'group-container', name: 'Context Container', type: 'layout', icon: 'view_quilt' },
      { id: 'role-container', name: 'Role', type: 'dynamic', icon: 'person' },
    ],
  },
  {
    title: 'Content',
    components: [
      { id: 'heading', name: 'Section Header', type: 'widget', icon: 'title' },
      { id: 'paragraph', name: 'Text Block', type: 'widget', icon: 'notes' },
    ],
  },
  {
    title: 'Variables',
    components: [
      { id: 'text-input', name: 'Text Input', type: 'widget', icon: 'text_fields' },
      { id: 'dropdown', name: 'Dropdown', type: 'widget', icon: 'arrow_drop_down_circle' },
      { id: 'checkbox', name: 'Checkbox', type: 'widget', icon: 'check_box' },
      { id: 'radio-buttons', name: 'Radio Buttons', type: 'widget', icon: 'radio_button_checked' },
    ],
  },
];