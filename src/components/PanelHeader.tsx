// src/components/PanelHeader.tsx
import React from 'react';
import { Tooltip } from './Tooltip';
import { Button } from './Button';
import panelStyles from './panel.module.css'; // Uses shared panel styles

interface PanelHeaderProps {
  title: string;
  onClose?: () => void;
  onToggle?: () => void;
  isCollapsed?: boolean;
  actions?: React.ReactNode;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({
  title,
  onClose,
  onToggle,
  isCollapsed = false,
  actions
}) => {
  // Determine which close/toggle button to show
  const renderCloseButton = () => {
    // If onToggle is provided, show chevron icons
    if (onToggle) {
      const icon = isCollapsed ? 'chevron_right' : 'chevron_left';
      const tooltip = isCollapsed ? 'Expand Panel' : 'Collapse Panel';
      return (
        <Tooltip content={tooltip}>
          <Button
            variant="quaternary"
            size="s"
            iconOnly
            aria-label={tooltip}
            onClick={onToggle}
          >
            <span className="material-symbols-rounded">{icon}</span>
          </Button>
        </Tooltip>
      );
    }

    // Otherwise, show close button if onClose provided
    if (onClose) {
      return (
        <Tooltip content="Close Panel">
          <Button
            variant="quaternary"
            size="s"
            iconOnly
            aria-label="Close Panel"
            onClick={onClose}
          >
            <span className="material-symbols-rounded">close</span>
          </Button>
        </Tooltip>
      );
    }

    return null;
  };

  return (
    <div className={panelStyles.componentBrowserHeader}>
      <h4>{title}</h4>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
        {actions}
        {renderCloseButton()}
      </div>
    </div>
  );
};