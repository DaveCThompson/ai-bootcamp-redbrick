// src/data/snippetUtils.ts
import { roles } from './rolesMock';
import { templates, TemplateItem } from './templatesMock';

/**
 * Generates a default markdown snippet for a component type.
 * Used by the Component Browser to enable "Copy Snippet" functionality.
 */
export function generateDefaultSnippet(
    componentType: 'layout' | 'dynamic' | 'widget' | 'template',
    options?: {
        dynamicType?: 'role';
        controlType?: 'plain-text' | 'text-input';
        textElement?: 'h1' | 'h2' | 'h3' | 'p';
        templateKey?: string;
    }
): string {
    switch (componentType) {
        case 'dynamic':
            if (options?.dynamicType === 'role') {
                // Default to the first role
                const defaultRoleKey = Object.keys(roles)[0];
                const roleDef = roles[defaultRoleKey];
                return `## ROLE\n\n${roleDef.promptSnippet}`;
            }
            return '';

        case 'widget':
            switch (options?.controlType) {
                case 'plain-text':
                    if (options.textElement?.startsWith('h')) {
                        const level = parseInt(options.textElement.charAt(1), 10);
                        return `${'#'.repeat(level)} Section Header`;
                    }
                    return 'This is a block of text.';

                case 'text-input':
                    return '{{Variable Name}}';

                default:
                    return '';
            }

        case 'template':
            // Generate content from actual template definition
            if (options?.templateKey && templates[options.templateKey]) {
                const template = templates[options.templateKey];
                return generateTemplateSnippet(template.components);
            }
            return '## Template Content';

        case 'layout':
            return ''; // Layout containers have no default content

        default:
            return '';
    }
}

/**
 * Recursively generates markdown from template components
 */
function generateTemplateSnippet(items: TemplateItem[]): string {
    const parts: string[] = [];

    for (const item of items) {
        if (item.type === 'group') {
            parts.push(generateTemplateSnippet(item.children));
        } else if (item.type === 'Section Header') {
            parts.push(`### ${item.content}`);
        } else if (item.type === 'Text Block') {
            parts.push(item.content);
        } else if (item.type === 'Text Input') {
            parts.push(`{{${item.props.label || 'Input'}}}`);
        }
    }

    return parts.join('\n\n');
}

