// src/features/References/ReferencesPage.tsx
import { useRef } from 'react';
import { useAtomValue } from 'jotai';
import { settingsLayoutModeAtom } from '../../data/atoms';
import { useScrollSpy } from '../../data/useScrollSpy';
import { Tooltip } from '../../components/Tooltip';
import { referenceData, type ContentFragment, type ContentBlock } from './referenceContent';
import styles from './ReferencesPage.module.css';

// --- RENDERER HELPERS ---

const renderContentFragment = (fragment: ContentFragment, index: number) => {
  if (typeof fragment === 'string') {
    return fragment;
  }
  if (fragment.type === 'word') {
    return (
      <Tooltip key={index} content={fragment.tooltip}>
        <span className={styles.wordTip}>{fragment.text}</span>
      </Tooltip>
    );
  }
  if (fragment.type === 'icon') {
    return (
      <Tooltip key={index} content={fragment.tooltip}>
        <span className={styles.iconTip}>
          <span className="material-symbols-rounded">{fragment.icon}</span>
        </span>
      </Tooltip>
    );
  }
  return null;
};

const renderBlock = (block: ContentBlock, index: number) => {
  if (block.type === 'paragraph') {
    return (
      <p key={index} className={styles.paragraph}>
        {(block.content as ContentFragment[]).map(renderContentFragment)}
      </p>
    );
  }
  if (block.type === 'list') {
    return (
      <ul key={index} className={styles.list}>
        {(block.content as ContentFragment[][]).map((item, itemIndex) => (
          <li key={itemIndex}>{item.map(renderContentFragment)}</li>
        ))}
      </ul>
    );
  }
  return null;
};


// --- NAVIGATION COMPONENT ---

const ReferencesNav = ({ sections, activeSectionId }: { sections: { id: string, title: string }[], activeSectionId: string }) => {
  return (
    <nav className={styles.nav}>
      <ul>
        {sections.map(section => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={activeSectionId === section.id ? styles.active : ''}
              onClick={(e) => { e.preventDefault(); document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' }); }}
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav> 
  );
};


// --- MAIN PAGE COMPONENT ---

export const ReferencesPage = () => {
  const layoutMode = useAtomValue(settingsLayoutModeAtom);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const sectionIds = referenceData.map(s => s.id);
  const activeSectionId = useScrollSpy(
    sectionIds, 
    { root: scrollContainerRef.current, rootMargin: "-50% 0px -50% 0px" }, 
    scrollContainerRef
  );

  return (
    <div className={`${styles.container} ${styles[layoutMode]}`}>
      {layoutMode === 'two-column' && <ReferencesNav sections={referenceData} activeSectionId={activeSectionId} />}
      <div className={styles.content} ref={scrollContainerRef}>
        <header className={styles.header}>
          <h1>Reference Material</h1>
          <p>A collection of useful patterns, principles, and data structures for building high-craft AI prompts.</p>
        </header>
        {referenceData.map(section => (
          <section key={section.id} id={section.id} className={styles.pageSection}>
            <h2>{section.title}</h2>
            {section.blocks.map(renderBlock)}
          </section>
        ))}
      </div>
    </div>
  );
};