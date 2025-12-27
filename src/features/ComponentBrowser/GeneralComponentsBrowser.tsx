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


export const GeneralComponentsBrowser = () => {
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

  return (
    <div className={panelStyles.componentBrowserContainer}>
      <PanelHeader title="Prompt Elements" onClose={handleClosePanel} />
      <div className={panelStyles.componentListContainer}>
        <ul className={panelStyles.componentList}>
          <SnippetsSection />
          {templateComponents.length > 0 && (
            <li className={panelStyles.componentListGroup}>
              <h5 className={panelStyles.listGroupTitle}>Templates</h5>
              <ul className={panelStyles.componentListGroupItems}>
                {templateComponents.map((component) => (
                  <DraggableComponentItem key={component.id} component={component} isTemplate={true} />
                ))}
              </ul>
            </li>
          )}
          {promptElements.map((group) => (
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
      <SnippetModal />
    </div>
  );
};