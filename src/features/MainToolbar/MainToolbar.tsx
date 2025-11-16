// src/features/MainToolbar/MainToolbar.tsx
import React from 'react'; // CORRECTED: This import is essential for JSX to work.
import { useAtom, useAtomValue } from 'jotai';
import { isToolbarCompactAtom, activeToolbarTabAtom, isComponentBrowserVisibleAtom, ToolbarTabId } from '../../data/atoms';
import { Tooltip } from '../../components/Tooltip';
import styles from './MainToolbar.module.css';

const toolbarGroups: { id: ToolbarTabId; label: string; icon: string }[][] = [
  [
    { id: 'lab-1', label: 'Lab 1', icon: 'science' },
    { id: 'lab-2', label: 'Lab 2', icon: 'biotech' },
  ],
  [
    { id: 'lab-3', label: 'Lab 3', icon: 'experiment' },
    { id: 'lab-4', label: 'Lab 4', icon: 'labs' },
  ],
];

export const MainToolbar = () => {
  const isCompact = useAtomValue(isToolbarCompactAtom);
  const [activeTabId, setActiveTabId] = useAtom(activeToolbarTabAtom);
  const [isPanelVisible, setIsPanelVisible] = useAtom(isComponentBrowserVisibleAtom);
  
  const toolbarClassName = `${styles.mainToolbar} ${isCompact ? styles.compact : styles.normal}`;

  const handleTabClick = (id: ToolbarTabId) => {
    if (id === activeTabId) {
      setIsPanelVisible(prev => !prev);
    } else {
      setActiveTabId(id);
      setIsPanelVisible(true);
    }
  };

  const renderButton = (item: { id: ToolbarTabId; label: string; icon: string }) => {
    const isActive = item.id === activeTabId;
    const isCurrentlyActiveAndOpen = isActive && isPanelVisible;
    const buttonClasses = `${styles.toolbarButton} ${isCurrentlyActiveAndOpen ? styles.active : ''}`;
    return (
      <Tooltip content={item.label} side="right" key={item.id}>
        <button 
          className={buttonClasses} 
          aria-label={item.label}
          onClick={() => handleTabClick(item.id)}
        >
          <span className="material-symbols-rounded">{item.icon}</span>
          {!isCompact && (
            <span className={styles.toolbarLabel}>{item.label}</span>
          )}
        </button>
      </Tooltip>
    );
  };

  return (
    <div className={toolbarClassName}>
      {toolbarGroups.map((group, groupIndex) => (
        <React.Fragment key={groupIndex}>
          <div className={styles.toolbarGroup}>
            {group.map(renderButton)}
          </div>
          {groupIndex < toolbarGroups.length - 1 && (
            <div className={styles.toolbarDividerHorizontal} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};