// src/features/EditorCanvas/renderers/RoleRenderer.tsx
import { useRef, useState } from 'react';
import { useSetAtom } from 'jotai';
import * as Collapsible from '@radix-ui/react-collapsible';
import { DynamicComponent } from '../../../types';
import { RendererProps } from './types';
import { useEditorInteractions } from '../useEditorInteractions';
import { CanvasSelectionToolbar } from '../CanvasSelectionToolbar';
import { AccordionHeader } from '../AccordionHeader';
import { commitActionAtom } from '../../../data/promptStateAtoms';
import { roles } from '../../../data/rolesMock';
import { Select, SelectItem } from '../../../components/Select';
import styles from '../EditorCanvas.module.css';

/**
 * Renders the "Role" component as a collapsible accordion.
 * Uses AccordionHeader with inline Select for role type selection.
 */
export const RoleRenderer = ({ component, mode }: RendererProps<DynamicComponent>) => {
  const { isSelected, isDragging, isOnlySelection, sortableProps, selectionProps, contextMenuProps, dndListeners } = useEditorInteractions(component);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const commitAction = useSetAtom(commitActionAtom);
  // Local expand state (ephemeral, not undo-able)
  const [isExpanded, setIsExpanded] = useState(true);

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

  const handleToggle = () => {
    setIsExpanded(prev => !prev);
  };

  // Inline Select as the label for canvas mode
  // Layout: "Role" [gap] [dropdown]
  const labelContent = mode === 'canvas' ? (
    <>
      <span style={{ fontWeight: 600, marginRight: 'var(--spacing-2)' }}>Role</span>
      <div
        className={styles.roleSelectWrapper}
        data-no-toggle
        onPointerDown={e => e.stopPropagation()}
        onClick={e => e.stopPropagation()}
      >
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
    </>
  ) : (
    <span className={styles.roleTitleText}>{roleInfo?.label || 'Role'}</span>
  );

  if (mode === 'preview') {
    return (
      <div className={styles.sortableItem}>
        <AccordionHeader
          icon="person"
          label={roleInfo?.label || 'Role'}
          showChevron={false}
          interactive={false}
        />
        <p className={styles.rolePromptText}>{roleInfo?.promptSnippet}</p>
      </div>
    );
  }

  const wrapperClasses = `${styles.sortableItem} ${isDragging ? styles.isDragging : ''}`;
  const selectionClasses = `${styles.selectableWrapper} ${isSelected ? styles.selected : ''}`;

  return (
    <div className={wrapperClasses} {...sortableProps} data-id={component.id} ref={setMergedRefsForSortable}>
      <div className={selectionClasses} {...selectionProps} {...contextMenuProps} {...dndListeners}>
        {isOnlySelection && <CanvasSelectionToolbar componentId={component.id} referenceElement={wrapperRef.current} dndListeners={dndListeners} />}

        <div className={styles.roleBlock}>
          <Collapsible.Root open={isExpanded} onOpenChange={setIsExpanded}>
            <AccordionHeader
              icon="person"
              label={labelContent}
              isExpanded={isExpanded}
              onToggle={handleToggle}
            />

            <Collapsible.Content className={styles.accordionContent}>
              <p className={styles.rolePromptText}>{roleInfo?.promptSnippet}</p>
            </Collapsible.Content>
          </Collapsible.Root>
        </div>
      </div>
    </div>
  );
};