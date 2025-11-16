// src/features/PropertiesPanel/RoleEditor.tsx
import { useSetAtom } from 'jotai';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { commitActionAtom } from '../../data/promptStateAtoms';
import { registerPropertyEditor, type PropertyEditorProps } from './propertyEditorRegistry';
import { roles } from '../../data/rolesMock';
import styles from './PropertiesPanel.module.css';
import radioStyles from '../../components/RadioGroup.module.css';

const RoleEditor = ({ component }: PropertyEditorProps) => {
  const commitAction = useSetAtom(commitActionAtom);

  if (component.componentType !== 'dynamic' || component.dynamicType !== 'role') {
    return null;
  }
  
  const selectedRoleKey = component.properties.roleType;

  const handleRoleChange = (newRoleType: string) => {
    if (!newRoleType) return;
    commitAction({
      action: {
        type: 'COMPONENT_UPDATE_DYNAMIC_PROPERTIES',
        payload: { componentId: component.id, newProperties: { roleType: newRoleType } }
      },
      message: `Set role to '${roles[newRoleType].label}'`
    });
  };

  return (
    <div className={styles.propSection}>
      <h4>Role Type</h4>
      <RadioGroup.Root
        className={radioStyles.radioGroupRoot}
        value={selectedRoleKey}
        onValueChange={handleRoleChange}
        aria-label="Select a role type"
      >
        {Object.entries(roles).map(([key, roleDef]) => (
          <label key={key} className={radioStyles.radioGroupItemWrapper} htmlFor={`role-${key}`}>
            <RadioGroup.Item className={radioStyles.radioGroupItem} value={key} id={`role-${key}`}>
              <RadioGroup.Indicator className={radioStyles.radioGroupIndicator} />
            </RadioGroup.Item>
            <span className={radioStyles.label}>
              {roleDef.label}
            </span>
          </label>
        ))}
      </RadioGroup.Root>
    </div>
  );
};

registerPropertyEditor('role', RoleEditor);

export default RoleEditor;