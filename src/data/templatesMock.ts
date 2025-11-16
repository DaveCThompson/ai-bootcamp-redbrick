// src/data/templatesMock.ts
import { WidgetComponent } from '../types';

// This defines the blueprints for templates. The historyAtoms reducer will parse this.
// `isLocked` prevents user modification. `isLabelHidden` cleans up the UI for paired inputs.
// `staticLabel` provides the non-editable prompt text for the new unified template input.

export interface TemplateItem {
  type: 'Text Input';
  isLocked?: boolean;
  props: Partial<WidgetComponent['properties']>;
}

interface TemplateDefinition {
  name: string;
  icon: string;
  components: TemplateItem[];
}

export const templates: Record<string, TemplateDefinition> = {
  'lab-1-profile': {
    name: 'Lab 1: User Profile',
    icon: 'assignment_ind',
    components: [
      { type: 'Text Input', isLocked: true, props: { staticLabel: 'My name is', label: 'Name', fieldName: 'userName', isLabelHidden: true } },
      { type: 'Text Input', isLocked: true, props: { staticLabel: 'My job title or role is', label: 'Job Title / Role', fieldName: 'userRole', isLabelHidden: true } },
      { type: 'Text Input', isLocked: true, props: { staticLabel: 'My big goals for this year are', label: 'Big Goals', fieldName: 'goals', isLabelHidden: true } },
      { type: 'Text Input', isLocked: true, props: { staticLabel: 'The kind of work I do day-to-day looks like', label: 'Day-to-day Work', fieldName: 'dailyWork', isLabelHidden: true } },
      { type: 'Text Input', isLocked: true, props: { staticLabel: 'Outside of work, I really enjoy', label: 'Hobbies', fieldName: 'hobbies', isLabelHidden: true } },
      { type: 'Text Input', isLocked: true, props: { staticLabel: 'I tend to lose track of time when I’m…', label: 'Flow State Activities', fieldName: 'flowState', isLabelHidden: true } },
      { type: 'Text Input', isLocked: true, props: { staticLabel: 'A place in the world that feels special or energizing to me is… because…', label: 'Special Place', fieldName: 'specialPlace', isLabelHidden: true } },
      { type: 'Text Input', isLocked: true, props: { staticLabel: 'In my work, I’m most energized by', label: 'Work Energizers', fieldName: 'workEnergizers', isLabelHidden: true } },
      { type: 'Text Input', isLocked: true, props: { staticLabel: 'In my work, I’m most frustrated by', label: 'Work Frustrations', fieldName: 'workFrustrations', isLabelHidden: true } },
      { type: 'Text Input', isLocked: true, props: { staticLabel: 'If AI could change a few things about how my work feels day-to-day, I’d want it to', label: 'AI Wishes', fieldName: 'aiWishes', isLabelHidden: true } },
      { type: 'Text Input', isLocked: true, props: { staticLabel: 'My computer setup looks like this (My device, my operating system, tools I rely on, etc.)', label: 'Computer Setup', fieldName: 'setup', isLabelHidden: true } },
      { type: 'Text Input', isLocked: true, props: { staticLabel: 'My experience with coding or scripting is', label: 'Coding Experience', fieldName: 'codingExperience', isLabelHidden: true } },
    ]
  },
  'vibe-persona': {
    name: 'Vibe Persona Prompt',
    icon: 'palette',
    components: [] // These are now just Text Blocks, handled by standard components.
  },
  'vibe-mission': {
    name: 'Vibe Mission Prompt',
    icon: 'flag',
    components: []
  },
  'vibe-console': {
    name: 'Vibe Console Prompt',
    icon: 'terminal',
    components: []
  }
};