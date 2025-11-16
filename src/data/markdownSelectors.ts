// src/data/markdownSelectors.ts
import { atom } from 'jotai';
import { canvasComponentsByIdAtom, rootComponentIdAtom } from './promptStateAtoms';
import { NormalizedCanvasComponents, WidgetComponent } from '../types';
import { roles } from './rolesMock';

const generateMarkdownRecursive = (
  componentId: string,
  allComponents: NormalizedCanvasComponents
): string => {
  const component = allComponents[componentId];
  if (!component) return '';

  let output = '';

  switch (component.componentType) {
    case 'layout':
      // Special handling for template containers
      if (component.properties.isTemplateContainer) {
        output += `## ${component.name}\n`;

        // Process children with special formatting
        const childMarkdown = component.children
          .map(childId => {
            const child = allComponents[childId] as WidgetComponent;
            if (!child) return '';
            const question = `### ${child.properties.label}`;
            const answer = child.properties.content?.trim() ? child.properties.content.trim() : '[not provided]';
            return `${question}\n${answer}`;
          })
          .join('\n\n');
        
        output += `\n${childMarkdown}`;
        
        return output; // Return early to prevent default child processing
      }

      // Default processing for normal layout groups
      if (component.children.length > 0) {
        output = component.children
          .map(childId => generateMarkdownRecursive(childId, allComponents))
          .join('\n\n');
      }
      break;

    case 'dynamic':
      if (component.dynamicType === 'role') {
        const roleDef = roles[component.properties.roleType];
        if (roleDef) {
          output += roleDef.promptSnippet;
        }
        if (component.children.length > 0) {
          const childrenOutput = component.children
            .map(childId => generateMarkdownRecursive(childId, allComponents))
            .join('\n\n');
          if (output && childrenOutput) {
            output += '\n\n';
          }
          output += childrenOutput;
        }
      }
      break;

    case 'widget':
    case 'field':
      switch (component.properties.controlType) {
        case 'plain-text':
          if (component.properties.textElement?.startsWith('h')) {
            const level = component.properties.textElement.charAt(1);
            output = `${'#'.repeat(parseInt(level, 10))} ${component.properties.content || ''}`;
          } else {
            output = component.properties.content || '';
          }
          break;
        case 'text-input':
          // This case is now handled by the template container logic.
          // For standalone variables, use the fieldName as a placeholder.
          output = `{{${component.properties.fieldName || component.properties.label}}}`;
          break;
        default:
          break;
      }
      break;
  }

  return output;
};

/**
 * A derived atom that generates the full Markdown string for the entire prompt.
 */
export const promptMarkdownAtom = atom<string>((get) => {
  const allComponents = get(canvasComponentsByIdAtom);
  const rootId = get(rootComponentIdAtom);
  if (!rootId) return '';
  // Trim to remove any leading/trailing newlines from the recursive generation
  return generateMarkdownRecursive(rootId, allComponents).trim();
});

/**
 * A derived atom that provides a function to get a snippet for any single component.
 */
export const componentSnippetSelectorAtom = atom((get) => {
  const allComponents = get(canvasComponentsByIdAtom);
  return (componentId: string) => {
    const component = allComponents[componentId];
    if (!component) return null;
    return generateMarkdownRecursive(componentId, allComponents).trim();
  };
})