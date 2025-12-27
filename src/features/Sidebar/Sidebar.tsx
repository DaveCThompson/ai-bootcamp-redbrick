// src/features/Sidebar/Sidebar.tsx
import { useAtom } from 'jotai';
import {
    primaryNavModeAtom,
    sidebarNavItemAtom,
    PrimaryNavMode,
    SidebarNavItem,
} from '../../data/atoms';
import { AnimatedLogo } from '../../components/AnimatedLogo/AnimatedLogo';
import { PartnerLogo } from '../../components/PartnerLogo/PartnerLogo';
import styles from './Sidebar.module.css';

const navItems: { id: SidebarNavItem; label: string; icon: string }[] = [
    { id: 'welcome', label: 'Welcome', icon: 'home' },
    { id: 'lab-1', label: 'Lab 1', icon: 'science' },
    { id: 'lab-2', label: 'Lab 2', icon: 'biotech' },
    { id: 'lab-3', label: 'Lab 3', icon: 'experiment' },
    { id: 'lab-4', label: 'Lab 4', icon: 'labs' },
];

export const Sidebar = () => {
    const [primaryMode, setPrimaryMode] = useAtom(primaryNavModeAtom);
    const [activeNavItem, setActiveNavItem] = useAtom(sidebarNavItemAtom);

    const handleToggle = (mode: PrimaryNavMode) => {
        setPrimaryMode(mode);
    };

    const handleNavClick = (id: SidebarNavItem) => {
        setActiveNavItem(id);
        if (primaryMode === 'reference') {
            setPrimaryMode('builder');
        }
    };

    return (
        <aside className={styles.sidebar}>
            {/* Logo Section */}
            <div className={styles.logoSection}>
                <div className={styles.logoGroup}>
                    <AnimatedLogo size="header" />
                    <span className={styles.logoSeparator}>×</span>
                    <PartnerLogo size="header" />
                </div>
            </div>

            {/* Custom Toggle: Builder / Reference */}
            <div className={styles.toggleSection}>
                <div className={styles.toggleTrack} role="radiogroup" aria-label="Primary navigation mode">
                    <button
                        className={styles.toggleItem}
                        role="radio"
                        aria-pressed={primaryMode === 'builder'}
                        onClick={() => handleToggle('builder')}
                    >
                        Builder
                    </button>
                    <button
                        className={styles.toggleItem}
                        role="radio"
                        aria-pressed={primaryMode === 'reference'}
                        onClick={() => handleToggle('reference')}
                    >
                        Reference
                    </button>
                </div>
            </div>

            {/* Secondary Navigation List */}
            <nav className={styles.navSection} aria-label="Sidebar navigation">
                <ul className={styles.navList}>
                    {navItems.map((item) => {
                        const isSelected = activeNavItem === item.id && primaryMode === 'builder';
                        return (
                            <li key={item.id}>
                                <button
                                    className={styles.navItem}
                                    aria-pressed={isSelected}
                                    onClick={() => handleNavClick(item.id)}
                                >
                                    <span className="material-symbols-rounded">{item.icon}</span>
                                    <span className={styles.navLabel}>{item.label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
};
