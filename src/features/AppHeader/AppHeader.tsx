import { useAtom } from 'jotai';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { appViewModeAtom, isToolbarCompactAtom, AppViewMode } from '../../data/atoms';
import { Button } from '../../components/Button';
import { Switch } from '../../components/Switch';
import { useUndoRedo } from '../../data/useUndoRedo';
import { useIsMac } from '../../data/useIsMac';
import { AnimatedTabs, Tab } from '../../components/AnimatedTabs';
import styles from './AppHeader.module.css';

const HeaderMenu = () => {
    const { undo, redo, canUndo, canRedo } = useUndoRedo();
    const isMac = useIsMac();
    const [isCompact, setIsCompact] = useAtom(isToolbarCompactAtom);

    return (
        <DropdownMenu.Portal>
            <DropdownMenu.Content
                className="menu-popover"
                sideOffset={8}
                align="start"
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <DropdownMenu.Item className="menu-item" onSelect={undo} disabled={!canUndo}>
                    <span className="checkmark-container"><span className="material-symbols-rounded">undo</span></span>
                    <span>Undo</span>
                    <span className="hotkey">{isMac ? "⌘Z" : "Ctrl+Z"}</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item className="menu-item" onSelect={redo} disabled={!canRedo}>
                    <span className="checkmark-container"><span className="material-symbols-rounded">redo</span></span>
                    <span>Redo</span>
                    <span className="hotkey">{isMac ? "⇧⌘Z" : "Ctrl+Y"}</span>
                </DropdownMenu.Item>
                <DropdownMenu.Separator className={styles.menuSeparator} />
                {/* Custom item for the switch to prevent menu from closing on click */}
                <DropdownMenu.Item className="menu-item" onSelect={(e) => e.preventDefault()}>
                    <div className={styles.menuItem}>
                        <label htmlFor="compact-toolbar-toggle">Compact Toolbar</label>
                        <Switch id="compact-toolbar-toggle" checked={isCompact} onCheckedChange={setIsCompact} />
                    </div>
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Portal>
    );
};

export const AppHeader = () => {
  const [viewMode, setViewMode] = useAtom(appViewModeAtom);

  return (
    <header className={styles.appHeader}>
      <div className={styles.left}>
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <Button variant="tertiary" size="m" iconOnly aria-label="Main menu">
                    <span className="material-symbols-rounded">menu</span>
                </Button>
            </DropdownMenu.Trigger>
            <HeaderMenu />
        </DropdownMenu.Root>
        <div className={styles.divider} />
        <span className={styles.appTitle}>BestHuman x Redbrick | AI Bootcamp</span>
      </div>
      
      <div className={styles.center}>
        <AnimatedTabs value={viewMode} onValueChange={(value) => setViewMode(value as AppViewMode)}>
            <Tab value="editor">Editor</Tab>
            <Tab value="settings">Settings</Tab>
        </AnimatedTabs>
      </div>
      
      <div className={styles.right}>
        {/* Right side is intentionally empty */}
      </div>
    </header>
  );
};