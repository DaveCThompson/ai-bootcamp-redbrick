// src/features/Editor/PropertiesPanel/RoleEditor.tsx
import { useSetAtom } from 'jotai';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { commitActionAtom } from '../../../data/historyAtoms';
import type { CanvasComponent } from '../../../types';
import { registerPropertyEditor, type PropertyEditorProps } from './propertyEditorRegistry';
import { roles, type RoleDefinition } from '../../../data/rolesMock';
import { Button } from '../../../components/Button';
import { addToastAtom } from '../../../data/toastAtoms';
import styles from './PropertiesPanel.module.css';
import radioStyles from '../../../components/RadioGroup.module.css';

const RoleEditor = ({ component }: PropertyEditorProps<CanvasComponent>) => {
  const commitAction = useSetAtom(commitActionAtom);
  const addToast = useSetAtom(addToastAtom);

  if (component.componentType !== 'dynamic' || component.dynamicType !== 'role') {
    return null;
  }

  const selectedRoleKey = component.properties.roleType;
  const selectedRole: RoleDefinition | undefined = roles[selectedRoleKey];

  const handleRoleChange = (newRoleType: string) => {
    commitAction({
      action: {
        type: 'COMPONENT_UPDATE_DYNAMIC_PROPERTIES',
        payload: { componentId: component.id, newProperties: { roleType: newRoleType } }
      },
      message: `Set role to '${roles[newRoleType].label}'`
    });
  };

  const handleCopySnippet = () => {
    if (selectedRole) {
      // FIX: Added 'void' to explicitly ignore the returned promise, satisfying the ESLint rule.
      void navigator.clipboard.writeText(selectedRole.promptSnippet);
      addToast({ message: 'Snippet copied to clipboard', icon: 'content_copy' });
    }
  };

  return (
    <>
      <div className={styles.propSection}>
        <h4>Role Type</h4>
        <RadioGroup.Root
          className={radioStyles.radioGroupRoot}
          value={selectedRoleKey}
          onValueChange={handleRoleChange}
          aria-label="Select a role type"
        >
          {Object.entries(roles).map(([key, roleDef]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center' }}>
              <RadioGroup.Item className={radioStyles.radioGroupItem} value={key} id={`role-${key}`}>
                <RadioGroup.Indicator className={radioStyles.radioGroupIndicator} />
              </RadioGroup.Item>
              <label className={radioStyles.label} htmlFor={`role-${key}`}>
                {roleDef.label}
              </label>
            </div>
          ))}
        </RadioGroup.Root>
      </div>

      {selectedRole && (
        <div className={styles.propSection}>
          <div className={styles.snippetHeader}>
            <h4>Prompt Snippet</h4>
            <Button variant="secondary" size="s" onClick={handleCopySnippet}>
              <span className="material-symbols-rounded">content_copy</span>
              Copy
            </Button>
          </div>
          <pre className={styles.codeSnippet}>
            {selectedRole.promptSnippet}
          </pre>
        </div>
      )}
    </>
  );
};

registerPropertyEditor('dynamic', RoleEditor);

export default RoleEditor;