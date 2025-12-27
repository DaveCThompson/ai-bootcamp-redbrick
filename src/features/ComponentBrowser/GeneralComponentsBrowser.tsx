// src/features/ComponentBrowser/GeneralComponentsBrowser.tsx
import { useSetAtom } from 'jotai';
import { isComponentBrowserVisibleAtom } from '../../data/atoms';
import { promptElements } from '../../data/promptElementsMock';
import { templates } from '../../data/templatesMock';
import { DraggableComponent } from '../../types';
import { PanelHeader } from '../../components/PanelHeader';
import { DraggableComponentItem } from './DraggableComponentItem';
import panelStyles from '../../components/panel.module.css';
import { SnippetsSection } from './SnippetsSection';
import { SnippetModal } from './SnippetModal';

interface GeneralComponentsBrowserProps {
  labId?: string;
}

export const GeneralComponentsBrowser = ({ labId = 'lab-1' }: GeneralComponentsBrowserProps) => {
  const setIsPanelVisible = useSetAtom(isComponentBrowserVisibleAtom);

  const handleClosePanel = () => {
    setIsPanelVisible(false);
  }

  const templateComponents: DraggableComponent[] = Object.entries(templates).map(([id, template]) => ({
    id,
    name: template.name,
    icon: template.icon,
    type: 'template'
  }));

  // Filter prompt elements by labId
  const filteredGroups = promptElements.filter(group => group.labId === labId);

  // Snippets and Templates only show on lab-1
  const showSnippetsAndTemplates = labId === 'lab-1';

  return (
    <div className={panelStyles.componentBrowserContainer}>
      <PanelHeader title="Prompt Elements" onClose={handleClosePanel} />
      <div className={panelStyles.componentListContainer}>
        <ul className={panelStyles.componentList}>
          {showSnippetsAndTemplates && <SnippetsSection />}
          {showSnippetsAndTemplates && templateComponents.length > 0 && (
            <li className={panelStyles.componentListGroup}>
              <h5 className={panelStyles.listGroupTitle}>Templates</h5>
              <ul className={panelStyles.componentListGroupItems}>
                {templateComponents.map((component) => (
                  <DraggableComponentItem key={component.id} component={component} isTemplate={true} />
                ))}
              </ul>
            </li>
          )}
          {filteredGroups.map((group) => (
            <li key={group.title} className={panelStyles.componentListGroup}>
              <h5 className={panelStyles.listGroupTitle}>{group.title}</h5>
              <ul className={panelStyles.componentListGroupItems}>
                {group.components.map((component) => (
                  <DraggableComponentItem key={component.id} component={component} />
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      {showSnippetsAndTemplates && <SnippetModal />}
    </div>
  );
};
