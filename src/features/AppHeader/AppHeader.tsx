import { useAtom } from 'jotai';
import { appViewModeAtom, isToolbarCompactAtom, isSettingsMenuOpenAtom, AppViewMode } from '../../data/atoms';
import { Popover } from '../../components/Popover';
import { Button } from '../../components/Button';
import { Switch } from '../../components/Switch';
import { Tooltip } from '../../components/Tooltip';
import { useUndoRedo } from '../../data/useUndoRedo';
import { useIsMac } from '../../data/useIsMac';
import { ActionMenu, ActionMenuItem } from '../../components/ActionMenu';
import { AnimatedTabs, Tab } from '../../components/AnimatedTabs';
import styles from './AppHeader.module.css';

const HeaderMenu = () => {
    const { undo, redo, canUndo, canRedo } = useUndoRedo();
    const isMac = useIsMac();
    const [isCompact, setIsCompact] = useAtom(isToolbarCompactAtom);

    const menuItems: (ActionMenuItem | 'separator')[] = [
        { id: 'undo', icon: 'undo', label: 'Undo', onClick: undo, disabled: !canUndo, hotkey: isMac ? "⌘Z" : "Ctrl+Z" },
        { id: 'redo', icon: 'redo', label: 'Redo', onClick: redo, disabled: !canRedo, hotkey: isMac ? "⇧⌘Z" : "Ctrl+Y" },
    ];

    return (
        <div className={styles.settingsMenu}>
            <ActionMenu items={menuItems} />
            <div className={styles.menuDivider} />
            <div className={styles.menuItem}>
              <label htmlFor="compact-toolbar-toggle">Compact Toolbar</label>
              <Switch id="compact-toolbar-toggle" checked={isCompact} onCheckedChange={setIsCompact} />
            </div>
        </div>
    );
};

export const AppHeader = () => {
  const [viewMode, setViewMode] = useAtom(appViewModeAtom);
  const [isMenuOpen, setIsMenuOpen] = useAtom(isSettingsMenuOpenAtom);

  return (
    <header className={styles.appHeader}>
      <div className={styles.left}>
        <span className="material-symbols-rounded" style={{ color: 'var(--surface-fg-brand-primary)' }}>screen_share</span>
        <h3>Screen Studio</h3>
      </div>
      
      <div className={styles.center}>
        <AnimatedTabs value={viewMode} onValueChange={(value) => setViewMode(value as AppViewMode)}>
            <Tab value="editor">Editor</Tab>
            <Tab value="settings">Settings</Tab>
        </AnimatedTabs>
      </div>
      
      <div className={styles.right}>
        <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen} trigger={
          <Tooltip content="More Options">
            <Button variant="secondary" size="m" iconOnly>
              <span className="material-symbols-rounded">more_vert</span>
            </Button>
          </Tooltip>
        }>
          <HeaderMenu />
        </Popover>
      </div>
    </header>
  );
};