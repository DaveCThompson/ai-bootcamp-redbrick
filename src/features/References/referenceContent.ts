// src/features/References/referenceContent.ts

// --- DATA STRUCTURE & CONTENT ---

export type WordTip = { type: 'word'; text: string; tooltip: string };
export type IconTip = { type: 'icon'; icon: string; tooltip: string };
export type ContentFragment = string | WordTip | IconTip;

export interface ContentBlock {
  type: 'paragraph' | 'list';
  content: ContentFragment[] | ContentFragment[][];
}

export interface ReferenceSection {
  id: string;
  title: string;
  blocks: ContentBlock[];
}

export const referenceData: ReferenceSection[] = [
  {
    id: 'ai-101',
    title: 'AI 101: Core Concepts',
    blocks: [
      {
        type: 'paragraph',
        content: [
          'Modern AI is powered by Large Language Models, or ',
          { type: 'word', text: 'LLMs', tooltip: 'A type of AI trained on vast amounts of text to understand, generate, and interact in human-like language.' },
          '. Think of an LLM as an incredibly advanced auto-complete. It predicts the next most likely word based on the patterns it has learned from its training data.',
          { type: 'icon', icon: 'psychology', tooltip: 'An LLM doesn\'t "understand" in the human sense. It excels at statistical pattern matching on a massive scale.' },
        ],
      },
      {
        type: 'paragraph',
        content: [
          'LLMs process text in units called ',
          { type: 'word', text: 'tokens', tooltip: 'The fundamental building blocks of text for an LLM. A token is roughly 3/4 of a word.' },
          '. Every piece of input you provide and every word the model generates consumes tokens. This is important because models have a finite ',
          { type: 'word', text: 'context window', tooltip: 'The maximum number of tokens an LLM can consider at one time, including both the input prompt and its generated output.' },
          '—once the limit is reached, it starts to forget the beginning of the conversation.',
        ],
      },
    ],
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt Engineering Fundamentals',
    blocks: [
      {
        type: 'paragraph',
        content: [
          'Prompt Engineering is the art and science of designing effective inputs to guide an AI toward a desired output. A well-crafted prompt is the difference between a generic, useless response and a precise, valuable one. ',
          { type: 'icon', icon: 'rule', tooltip: 'Principle: Garbage in, garbage out. The quality of your output is directly proportional to the quality of your input.' },
        ],
      },
      {
        type: 'list',
        content: [
          [
            { type: 'word', text: 'Clarity and Specificity:', tooltip: 'Provide explicit instructions. Instead of "Write about dogs," try "Write a 3-paragraph summary about the history of dog domestication for a 5th-grade audience."' },
            ' Be direct. The more specific your instructions, the better the result.'
          ],
          [
            { type: 'word', text: 'Provide Context:', tooltip: 'Give the AI all the background information it needs to complete the task successfully. Don\'t assume it knows about your specific project or goals.' },
            ' If you\'re asking it to write code, provide existing code snippets. If you\'re asking for marketing copy, provide brand guidelines.'
          ],
          [
            { type: 'word', text: 'Use a Persona:', tooltip: 'Instruct the AI to act as a specific expert. For example, "You are a senior software architect specializing in React..." or "You are a skeptical financial analyst..."' },
            ' This frames the conversation and dramatically improves the quality and tone of the response.'
          ],
          [
            { type: 'word', text: 'Few-Shot Prompting:', tooltip: 'Provide 1 to 5 examples (shots) of the desired input/output format within your prompt. This is one of the most powerful techniques for getting structured data.' },
            ' This teaches the model the exact format you expect for the response, leaving less room for error.'
          ],
        ]
      }
    ],
  },
  {
    id: 'vibe-coding',
    title: 'Vibe Coding: Intuitive Development',
    blocks: [
      {
        type: 'paragraph',
        content: [
          '"Vibe Coding" is a development methodology that treats the AI as a collaborative partner. Instead of writing every line of code yourself, you guide the AI with high-level, conversational commands based on your intent—the "vibe." It prioritizes rapid iteration and allows you to stay focused on the "what" rather than the "how." ',
          { type: 'icon', icon: 'hub', tooltip: 'Vibe Coding is not about replacing developers; it\'s about augmenting them. It transforms the developer role from a bricklayer to an architect.' },
        ],
      },
      {
        type: 'paragraph',
        content: [
          'This approach works best when you combine clear instructions with iterative feedback. Start with a broad goal, review the AI\'s output, and then provide concise, corrective feedback to refine the result. Treat it like a conversation with a junior developer who is incredibly fast but needs precise guidance.',
        ],
      },
    ],
  },
];