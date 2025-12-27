// src/features/EditorCanvas/renderers/RoleRenderer.tsx
import { useRef } from 'react';
import { useSetAtom } from 'jotai';
import { DynamicComponent } from '../../../types';
import { RendererProps } from './types';
import { useEditorInteractions } from '../useEditorInteractions';
import { CanvasSelectionToolbar } from '../CanvasSelectionToolbar';
import { commitActionAtom } from '../../../data/promptStateAtoms';
import { roles } from '../../../data/rolesMock';
import { Select, SelectItem } from '../../../components/Select';
import styles from '../EditorCanvas.module.css';

/**
 * Renders the "Role" component with a clean, title-like design.
 * Uses the design system Select component for high-craft dropdown.
 */
export const RoleRenderer = ({ component, mode }: RendererProps<DynamicComponent>) => {
  const { isSelected, isDragging, isOnlySelection, sortableProps, selectionProps, dndListeners } = useEditorInteractions(component);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const commitAction = useSetAtom(commitActionAtom);

  const roleInfo = roles[component.properties.roleType];

  const setMergedRefsForSortable = (node: HTMLDivElement | null) => {
    wrapperRef.current = node;
    sortableProps.ref(node);
  };

  const handleRoleChange = (newRoleType: string) => {
    commitAction({
      action: {
        type: 'COMPONENT_UPDATE_DYNAMIC_PROPERTIES',
        payload: { componentId: component.id, newProperties: { roleType: newRoleType } }
      },
      message: `Set role to '${roles[newRoleType].label}'`
    });
  };

  // Clean, title-like view with actual role content
  const RoleView = () => (
    <div className={styles.roleBlock}>
      {/* Title row with design system Select on canvas */}
      <div className={styles.roleTitle}>
        <span className="material-symbols-rounded">person</span>
        {mode === 'canvas' ? (
          <div className={styles.roleSelectWrapper} onClick={e => e.stopPropagation()}>
            <Select
              value={component.properties.roleType}
              onValueChange={handleRoleChange}
              placeholder="Select a role..."
            >
              {Object.entries(roles).map(([key, roleDef]) => (
                <SelectItem key={key} value={key}>
                  {roleDef.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        ) : (
          <span className={styles.roleTitleText}>{roleInfo?.label || 'Role'}</span>
        )}
      </div>

      {/* Actual role prompt text */}
      <p className={styles.rolePromptText}>{roleInfo?.promptSnippet}</p>
    </div>
  );

  if (mode === 'preview') {
    return <RoleView />;
  }

  const wrapperClasses = `${styles.sortableItem} ${isDragging ? styles.isDragging : ''}`;
  const selectionClasses = `${styles.selectableWrapper} ${isSelected ? styles.selected : ''}`;

  return (
    <div className={wrapperClasses} {...sortableProps} data-id={component.id} ref={setMergedRefsForSortable}>
      <div className={selectionClasses} {...selectionProps} {...dndListeners}>
        {isOnlySelection && <CanvasSelectionToolbar componentId={component.id} referenceElement={wrapperRef.current} dndListeners={dndListeners} />}
        <RoleView />
      </div>
    </div>
  );
};