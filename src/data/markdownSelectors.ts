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
        // The title "User Context" is now derived from the component's name property.
        output += `## ${component.name}\n`;

        // Process children with special formatting
        const childMarkdown = component.children
          .map(childId => {
            const child = allComponents[childId] as WidgetComponent; // We know children of templates are widgets
            if (!child) return '';
            // The label of the child widget is the question
            const question = `### ${child.properties.label}`;
            // The content of the child widget is the answer
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
          // Add the H2 "ROLE" header before the snippet.
          output += `## ROLE\n\n${roleDef.promptSnippet}`;
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

    case 'snippet-instance':
      output = component.properties.content || '';
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
});