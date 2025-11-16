// src/features/References/ReferencesPage.tsx
import { useAtom, useAtomValue } from 'jotai';
import { settingsLayoutModeAtom, focusIntentAtom } from '../../data/atoms';
import { settingsData, SettingsSection } from '../../data/settingsMock';
import { useScrollSpy } from '../../data/useScrollSpy';
import { useRef } from 'react';
// CORRECTED: Import path now points to the renamed CSS module.
import styles from './ReferencesPage.module.css';

const SettingsNav = ({ sections, activeSectionId }: { sections: SettingsSection[], activeSectionId: string }) => {
  const setFocusIntent = useAtom(focusIntentAtom)[1];
  return (
    <nav className={styles.settingsNav}>
      <ul>
        {sections.map(section => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={activeSectionId === section.id ? styles.active : ''}
              onClick={(e) => {
                e.preventDefault();
                setFocusIntent(section.id);
                document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
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
  const sectionIds = settingsData.map(s => s.id);
  const activeSectionId = useScrollSpy(sectionIds, { root: scrollContainerRef.current, rootMargin: "-50% 0px -50% 0px" }, scrollContainerRef);
  
  return (
    <div className={`${styles.settingsContainer} ${styles[layoutMode]}`}>
      {layoutMode === 'two-column' && <SettingsNav sections={settingsData} activeSectionId={activeSectionId} />}
      <div className={styles.settingsContent} ref={scrollContainerRef}>
        <h1>References</h1>
        <p>This page is a placeholder for future reference material.</p>
        <p>The settings from the previous version are displayed below as an example of content.</p>
        <br />
        {settingsData.map(section => (
          <section key={section.id} id={section.id} className={styles.settingsSection}>
            <h2>{section.title}</h2>
            <div className={styles.fieldsGrid}>
              {section.fields.map(field => (
                <div key={field.id} className={styles.fieldItem}>
                  <label htmlFor={field.id}>{field.label}</label>
                  {field.type === 'checkbox' ? (
                    <input type="checkbox" id={field.id} />
                  ) : field.type === 'select' ? (
                    <select id={field.id}>
                      {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea id={field.id} placeholder={field.placeholder} rows={4} />
                  ) : (
                    <input type="text" id={field.id} placeholder={field.placeholder} />
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};