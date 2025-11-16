// src/features/Editor/ScreenToolbar.tsx
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { EditorLayoutMode } from '../../data/atoms';
import styles from './ScreenToolbar.module.css';

interface ScreenToolbarProps {
  layoutMode: EditorLayoutMode;
  onLayoutModeChange: (mode: EditorLayoutMode) => void;
}

const layoutOptions: { value: EditorLayoutMode; label: string }[] = [
  { value: 'split', label: 'Split' },
  { value: 'builder', label: 'Builder' },
  { value: 'preview', label: 'Preview' },
];

export const ScreenToolbar = ({ layoutMode, onLayoutModeChange }: ScreenToolbarProps) => {
  const handleValueChange = (newValue: EditorLayoutMode) => {
    if (newValue) { // Radix onValueChange can be empty if all are deselected
      onLayoutModeChange(newValue);
    }
  };

  return (
    <div className={styles.screenToolbarWrapper}>
      <ToggleGroup.Root
        type="single"
        className={styles.screenToolbar}
        value={layoutMode}
        onValueChange={handleValueChange}
        aria-label="Editor layout mode"
      >
        {layoutOptions.map((option) => (
          <ToggleGroup.Item
            key={option.value}
            value={option.value}
            className={styles.toolbarButton}
            aria-label={option.label}
          >
            {option.label}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  );
};