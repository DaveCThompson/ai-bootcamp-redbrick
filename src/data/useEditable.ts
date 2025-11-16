// src/data/useEditable.ts
import { useState, useRef, useEffect } from 'react';

interface UseEditableOptions {
  multiline?: boolean;
}

export interface EditableProps<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onBlur: () => void;
}

/**
 * A hook to manage the state and lifecycle of an inline editable text input.
 * It now internally handles focusing and selecting text when editing begins.
 */
export const useEditable = <T extends HTMLInputElement | HTMLTextAreaElement>(
  initialValue: string,
  onCommit: (newValue: string) => void,
  onCancel: () => void,
  isEditing: boolean,
  options: UseEditableOptions = {}
): EditableProps<T> => {
  const [value, setValue] = useState(initialValue);
  const ref = useRef<T>(null);

  useEffect(() => {
    if (isEditing) {
      const timer = setTimeout(() => {
        ref.current?.focus();
        ref.current?.select();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isEditing]);


  const handleKeyDown = (e: React.KeyboardEvent) => {
    const isEnter = e.key === 'Enter';
    const isCmdOrCtrl = e.metaKey || e.ctrlKey;

    // For multiline, commit on Cmd/Ctrl+Enter, otherwise just add a newline
    if (options.multiline) {
      if (isEnter && isCmdOrCtrl) {
        e.preventDefault();
        onCommit(value);
      }
    } else {
      // For single line, commit on Enter
      if (isEnter) {
        e.preventDefault();
        onCommit(value);
      }
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel(); // Revert to previous state/value
    }
  };

  const handleBlur = () => {
    onCommit(value);
  };

  return {
    ref,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(e.target.value),
    onKeyDown: handleKeyDown,
    onBlur: handleBlur,
  };
};