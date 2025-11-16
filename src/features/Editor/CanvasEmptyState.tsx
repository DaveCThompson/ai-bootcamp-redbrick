// src/features/Editor/CanvasEmptyState.tsx
import { useSetAtom } from 'jotai';
import { 
  startEditingOnEmptyCanvasAtom,
} from '../../data/historyAtoms';
import styles from './CanvasEmptyState.module.css';

export const CanvasEmptyState = () => {
  const startEditing = useSetAtom(startEditingOnEmptyCanvasAtom);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent canvas from deselecting
    startEditing();
  };

  return (
    <div className={styles.emptyStateContainer} onClick={handleClick}>
      <h3 className={styles.title}>Add prompt elements</h3>
      <p className={styles.subtitle}>
        Drag and drop elements here to create your prompt
      </p>
    </div>
  );
};