// src/features/References/ReferencesPage.tsx
import { useRef } from 'react';
import { useAtomValue } from 'jotai';
import { settingsLayoutModeAtom } from '../../data/atoms';
import { useScrollSpy } from '../../data/useScrollSpy';
import styles from './ReferencesPage.module.css';

interface ReferenceSection {
  id: string;
  title: string;
}

const referenceSections: ReferenceSection[] = [
    { id: 'personas', title: 'AI Personas' },
    { id: 'prompt-structure', title: 'Prompt Structure' },
    { id: 'advanced-techniques', title: 'Advanced Techniques' },
    { id: 'style-guides', title: 'Style Guides' },
    { id: 'examples', title: 'Example Library' },
];

const ReferencesNav = ({ sections, activeSectionId }: { sections: ReferenceSection[], activeSectionId: string }) => {
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

export const ReferencesPage = () => {
  const layoutMode = useAtomValue(settingsLayoutModeAtom);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const sectionIds = referenceSections.map(s => s.id);
  const activeSectionId = useScrollSpy(
    sectionIds, 
    { root: scrollContainerRef.current, rootMargin: "-50% 0px -50% 0px" }, 
    scrollContainerRef
  );

  return (
    <div className={`${styles.container} ${styles[layoutMode]}`}>
      {layoutMode === 'two-column' && <ReferencesNav sections={referenceSections} activeSectionId={activeSectionId} />}
      <div className={styles.content} ref={scrollContainerRef}>
        <header className={styles.header}>
          <h1>Reference Material</h1>
          <p>A collection of useful patterns, principles, and data structures for building high-craft AI prompts.</p>
        </header>
        {referenceSections.map(section => (
          <section key={section.id} id={section.id} className={styles.pageSection}>
            <h2>{section.title}</h2>
            <p>
              This section is a placeholder. Content related to "{section.title}" will be added here.
              It will include best practices, examples, and detailed explanations to help users
              construct more effective and reliable prompts.
            </p>
          </section>
        ))}
      </div>
    </div>
  );
};