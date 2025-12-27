// src/features/EditorCanvas/AccordionHeader.tsx
import React from 'react';
import styles from './AccordionHeader.module.css';

interface AccordionHeaderProps {
    /** Material Symbol icon name */
    icon: string;
    /** Label content - can be string or ReactNode (e.g., inline select) */
    label: React.ReactNode;
    /** Optional action buttons (copy, etc.) */
    actions?: React.ReactNode;
    /** Whether the accordion is expanded */
    isExpanded?: boolean;
    /** Whether to show the chevron */
    showChevron?: boolean;
    /** Click handler for the entire header (toggle) */
    onToggle?: () => void;
    /** Whether the header should have hover background */
    interactive?: boolean;
}

/**
 * AccordionHeader - A shared header component for canvas accordion blocks.
 * 
 * Features:
 * - Icon slot (Material Symbol)
 * - Flexible label (text or ReactNode)
 * - Optional action buttons
 * - Animated chevron for collapse state
 * - Hover background state
 * - Focus-visible styling for accessibility
 */
export const AccordionHeader = ({
    icon,
    label,
    actions,
    isExpanded = true,
    showChevron = true,
    onToggle,
    interactive = true,
}: AccordionHeaderProps) => {
    const headerClasses = [
        styles.accordionHeader,
        interactive ? styles.interactive : '',
        isExpanded && showChevron ? styles.expanded : '',
    ].filter(Boolean).join(' ');

    const chevronClasses = [
        styles.chevron,
        isExpanded ? styles.chevronExpanded : '',
    ].filter(Boolean).join(' ');

    const handleClick = (e: React.MouseEvent) => {
        // Only toggle if clicking on the header itself, not on interactive children
        const target = e.target as HTMLElement;
        const isInteractiveChild = target.closest('[data-no-toggle]') ||
            target.closest('button') ||
            target.closest('select') ||
            target.closest('[role="combobox"]');
        if (isInteractiveChild) return;

        // Stop propagation to prevent parent selection handlers
        e.stopPropagation();
        onToggle?.();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            onToggle?.();
        }
    };

    return (
        <div
            className={headerClasses}
            onClick={interactive ? handleClick : undefined}
            onKeyDown={interactive ? handleKeyDown : undefined}
            tabIndex={interactive && showChevron ? 0 : undefined}
            role={interactive && showChevron ? 'button' : undefined}
            aria-expanded={showChevron ? isExpanded : undefined}
        >
            {/* Icon */}
            <span className={`material-symbols-rounded ${styles.headerIcon}`}>
                {icon}
            </span>

            {/* Label */}
            <div className={styles.headerLabel}>
                {label}
            </div>

            {/* Actions slot */}
            {actions && (
                <div className={styles.headerActions} onClick={e => e.stopPropagation()}>
                    {actions}
                </div>
            )}

            {/* Chevron */}
            {showChevron && (
                <span className={`material-symbols-rounded ${chevronClasses}`}>
                    expand_more
                </span>
            )}
        </div>
    );
};
