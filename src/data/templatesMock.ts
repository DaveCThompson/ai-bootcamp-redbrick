// src/data/templatesMock.ts
import { WidgetComponent } from '../types';

// This defines the blueprints for templates. The historyAtoms reducer will parse this.
// `isLocked` prevents user modification. `isLabelHidden` cleans up the UI for paired inputs.

interface BaseTemplateItem {
  isLocked?: boolean;
}
export interface GroupTemplateItem extends BaseTemplateItem {
  type: 'group';
  children: TemplateItem[];
}
export interface HeaderTemplateItem extends BaseTemplateItem {
  type: 'Section Header';
  content: string;
}
export interface TextBlockTemplateItem extends BaseTemplateItem {
  type: 'Text Block';
  content: string;
}
export interface TextInputTemplateItem extends BaseTemplateItem {
  type: 'Text Input';
  props: Partial<WidgetComponent['properties']>;
}

export type TemplateItem = GroupTemplateItem | HeaderTemplateItem | TextBlockTemplateItem | TextInputTemplateItem;

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
      // REVERTED to the original hierarchical structure. The history reducer will now interpret this
      // to build the new TemplateContainer component.
      { type: 'group', isLocked: true, children: [
          { type: 'Section Header', content: 'My name is', isLocked: true },
          { type: 'Text Input', props: { label: 'Name', fieldName: 'userName', isLabelHidden: true } }
      ]},
      { type: 'group', isLocked: true, children: [
          { type: 'Section Header', content: 'My job title or role is', isLocked: true },
          { type: 'Text Input', props: { label: 'Job Title / Role', fieldName: 'userRole', isLabelHidden: true } }
      ]},
      { type: 'group', isLocked: true, children: [
          { type: 'Section Header', content: 'My big goals for this year are', isLocked: true },
          { type: 'Text Input', props: { label: 'Big Goals', fieldName: 'goals', isLabelHidden: true } }
      ]},
      { type: 'group', isLocked: true, children: [
          { type: 'Section Header', content: 'The kind of work I do day-to-day looks like', isLocked: true },
          { type: 'Text Input', props: { label: 'Day-to-day Work', fieldName: 'dailyWork', isLabelHidden: true } }
      ]},
      { type: 'group', isLocked: true, children: [
          { type: 'Section Header', content: 'Outside of work, I really enjoy', isLocked: true },
          { type: 'Text Input', props: { label: 'Hobbies', fieldName: 'hobbies', isLabelHidden: true } }
      ]},
      { type: 'group', isLocked: true, children: [
          { type: 'Section Header', content: 'I tend to lose track of time when I’m…', isLocked: true },
          { type: 'Text Input', props: { label: 'Flow State Activities', fieldName: 'flowState', isLabelHidden: true } }
      ]},
      { type: 'group', isLocked: true, children: [
          { type: 'Section Header', content: 'A place in the world that feels special or energizing to me is… because…', isLocked: true },
          { type: 'Text Input', props: { label: 'Special Place', fieldName: 'specialPlace', isLabelHidden: true } }
      ]},
      { type: 'group', isLocked: true, children: [
          { type: 'Section Header', content: 'In my work, I’m most energized by', isLocked: true },
          { type: 'Text Input', props: { label: 'Work Energizers', fieldName: 'workEnergizers', isLabelHidden: true } }
      ]},
      { type: 'group', isLocked: true, children: [
          { type: 'Section Header', content: 'In my work, I’m most frustrated by', isLocked: true },
          { type: 'Text Input', props: { label: 'Work Frustrations', fieldName: 'workFrustrations', isLabelHidden: true } }
      ]},
      { type: 'group', isLocked: true, children: [
          { type: 'Section Header', content: 'If AI could change a few things about how my work feels day-to-day, I’d want it to', isLocked: true },
          { type: 'Text Input', props: { label: 'AI Wishes', fieldName: 'aiWishes', isLabelHidden: true } }
      ]},
      { type: 'group', isLocked: true, children: [
          { type: 'Section Header', content: 'My computer setup looks like this (My device, my operating system, tools I rely on, etc.)', isLocked: true },
          { type: 'Text Input', props: { label: 'Computer Setup', fieldName: 'setup', isLabelHidden: true } }
      ]},
      { type: 'group', isLocked: true, children: [
          { type: 'Section Header', content: 'My experience with coding or scripting is', isLocked: true },
          { type: 'Text Input', props: { label: 'Coding Experience', fieldName: 'codingExperience', isLabelHidden: true } }
      ]},
    ]
  },
  'vibe-persona': {
    name: 'Vibe Persona Prompt',
    icon: 'palette',
    components: [{ type: 'Text Block', content: `TASK:\nYou are supporting an AI-coding workshop.\nA participant has answered 12 first-person prompts about who they are, their goals, their work, their frustrations, their computer setup, and their experience with coding.\nFrom these answers, create three outputs: Vibe Persona, Vibe Mission, and Vibe Console.\n\nHow to use their answers\n#1–7: who they are as a person (name, role, goals, hobbies, what they love, favorite place).\n#8–10: what matters in their work, what’s frustrating, and what they wish AI could change.\n#11–12: their setup and coding experience.\n\nOutput 1: Vibe Persona\nPurpose: a fun but respectful persona that could be turned into a visual “avatar” card. Lean mostly on #1–7.\n\nFormat:\nVibe Persona\nName:\nJob role:\nOne-line persona tagline: (short, vivid, grounded in their answers)\nSnapshot (3–5 bullets):` }]
  },
  'vibe-mission': {
    name: 'Vibe Mission Prompt',
    icon: 'flag',
    components: [{ type: 'Text Block', content: `Output 2: Vibe Mission\nPurpose: a clear summary of what they care about, what’s painful, and what’s promising for an AI-coding passion project. Lean mostly on #3, #4, #8–10 (and bring in anything relevant from #5–7).\n\nFormat:\nVibe Mission\nWhat they care about most in their work (2–3 bullets):\nKey frustrations / pain points (2–4 bullets):\nMission directions for their AI-coding project (1–3 bullets, action-oriented, based on their answers):\n“…”\n“…”` }]
  },
  'vibe-console': {
    name: 'Vibe Console Prompt',
    icon: 'terminal',
    components: [{ type: 'Text Block', content: `Output 3: Vibe Console\nPurpose: give AI agents enough context to support them while they build. Lean mostly on #3, #10, #11, and #12.\n\nFormat:\nVibe Console\nDevice and setup: (short summary from #11)\nCoding experience: (short description based on #12)\nFocus for this workshop (2–3 bullets, inferred from their big goals and what they want AI to change):\nGood ways for AI agents to support them (2–3 bullets, tailored to their experience and goals):\n(e.g., explain code step-by-step, offer starter templates, suggest small, safe experiments.)` }]
  }
};