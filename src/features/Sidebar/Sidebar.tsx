// src/features/Sidebar/Sidebar.tsx
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
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

const toggleOptions: { mode: PrimaryNavMode; label: string }[] = [
    { mode: 'builder', label: 'Builder' },
    { mode: 'reference', label: 'Reference' },
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

            {/* Custom Toggle with Sliding Indicator */}
            <div className={styles.toggleSection}>
                <div className={styles.toggleTrack} role="radiogroup" aria-label="Primary navigation mode">
                    {toggleOptions.map((option) => (
                        <button
                            key={option.mode}
                            className={styles.toggleItem}
                            role="radio"
                            aria-pressed={primaryMode === option.mode}
                            onClick={() => handleToggle(option.mode)}
                        >
                            {primaryMode === option.mode && (
                                <motion.div
                                    className={styles.toggleIndicator}
                                    layoutId="toggleIndicator"
                                    transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
                                />
                            )}
                            <span className={styles.toggleLabel}>{option.label}</span>
                        </button>
                    ))}
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
