// src/components/ActionToolbar.tsx
import { useRef } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
} from '@floating-ui/react-dom';
import styles from './ActionToolbar.module.css';

interface ActionToolbarProps {
  children: React.ReactNode;
  // FIX: Mode is now optional to allow for parent-controlled positioning.
  mode?: 'element-relative' | 'fixed';
  referenceElement?: HTMLElement | null;
}

export const ActionToolbar = ({
  children,
  mode,
  referenceElement,
}: ActionToolbarProps) => {
  const arrowRef = useRef(null);

  // useFloating is a hook, so it must be called unconditionally at the top level.
  const {
    refs,
    floatingStyles,
  } = useFloating({
    // Position at top, aligned to right edge but inset 32px
    placement: 'top-end',
    open: true,
    middleware:
      mode === 'element-relative'
        ? [
          // mainAxis: -20 to sit over top border, crossAxis: -48px insets toolbar from right edge
          offset({ mainAxis: -20, crossAxis: -48 }),
          flip({ padding: 8 }),
          shift({ padding: 8 }),
          arrow({ element: arrowRef }),
        ]
        : [],
    whileElementsMounted:
      mode === 'element-relative' ? autoUpdate : undefined,
  });

  // Conditionally apply floating styles only when needed.
  // This prevents conflicts with other positioning modes like 'fixed'.
  const finalStyles = mode === 'element-relative' ? floatingStyles : {};

  if (mode === 'element-relative' && referenceElement) {
    refs.setReference(referenceElement);
  }

  const isHidden = mode === 'element-relative' && !referenceElement;
  const toolbarClasses = `${styles.actionToolbar} ${mode === 'fixed' ? styles.fixed : ''
    } ${isHidden ? styles.hidden : ''}`;

  return (
    <div
      // FIX: Use a conditional ref. For 'fixed' or undefined mode, we don't need floating-ui's ref.
      ref={mode === 'element-relative' ? refs.setFloating : undefined}
      style={finalStyles}
      className={toolbarClasses}
      data-toolbar="true"
      // Bubble-wrap pattern: stop both pointer and click events from bubbling to parent handlers
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
};