// src/features/Editor/renderers/types.ts
import type { CanvasComponent } from '../../../types'; // FIX: Widened constraint to include all component types
import type { EditableProps } from '../../../data/useEditable';

export type RendererMode = 'canvas' | 'preview';

export interface RendererProps<T extends CanvasComponent> {
  component: T;
  mode: RendererMode;
}

export interface FormRendererProps<T extends CanvasComponent> extends RendererProps<T> {
  editableProps?: EditableProps<HTMLInputElement | HTMLTextAreaElement>;
}