// src/features/ComponentBrowser/GeneralComponentsBrowser.tsx
import { useSetAtom } from 'jotai';
import { useDraggable } from '@dnd-kit/core';
import { isComponentBrowserVisibleAtom } from '../../data/atoms';
import { promptElements } from '../../data/promptElementsMock';
import { templates } from '../../data/templatesMock';
import { DraggableComponent, DndData, WidgetComponent } from '../../types';
import { PanelHeader } from '../../components/PanelHeader';
import panelStyles from '../../components/panel.module.css';

const DraggableListItem = ({ component, isTemplate = false }: { component: DraggableComponent, isTemplate?: boolean }) => {
  const idPrefix = isTemplate ? `new-template-` : `new-`;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${idPrefix}${component.id}`,
    data: {
      id: component.id,
      name: component.name,
      type: component.type,
      icon: component.icon,
      isNew: true,
      isTemplate,
      controlType: 
        (component.id === 'heading' || component.id === 'paragraph') ? 'plain-text' : 
        (component.type === 'widget') ? component.id as WidgetComponent['properties']['controlType'] : undefined,
      controlTypeProps: 
        component.id === 'heading' ? { textElement: 'h2', content: 'Section Header' } :
        component.id === 'paragraph' ? { textElement: 'p', content: 'This is a block of text.' } :
        undefined,
      dynamicType: component.type === 'dynamic' ? 'role' : undefined,
    } satisfies DndData,
  });

  const iconStyle = {};

  return (
    <li
      ref={setNodeRef}
      style={{ opacity: isDragging ? 0.4 : 1, touchAction: 'none' }}
      {...listeners}
      {...attributes}
      className={`menu-item ${panelStyles.dataNavItem}`}
    >
      <span className={`material-symbols-rounded ${panelStyles.componentIcon}`} style={iconStyle}>{component.icon}</span>
      <span className={panelStyles.componentName}>{component.name}</span>
    </li>
  );
};

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
          {templateComponents.length > 0 && (
            <li className={panelStyles.componentListGroup}>
              <h5 className={panelStyles.listGroupTitle}>Templates</h5>
              <ul className={panelStyles.componentListGroupItems}>
                {templateComponents.map((component) => (
                  <DraggableListItem key={component.id} component={component} isTemplate={true} />
                ))}
              </ul>
            </li>
          )}
          {promptElements.map((group) => (
            <li key={group.title} className={panelStyles.componentListGroup}>
              <h5 className={panelStyles.listGroupTitle}>{group.title}</h5>
              <ul className={panelStyles.componentListGroupItems}>
                {group.components.map((component) => (
                  <DraggableListItem key={component.id} component={component} />
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};