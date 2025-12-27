import { useAtom } from 'jotai'
import { appViewModeAtom, AppViewMode } from '../../data/atoms'
import { AnimatedTabs, Tab } from '../../components/AnimatedTabs'
import { AnimatedLogo } from '../../components/AnimatedLogo/AnimatedLogo'
import { PartnerLogo } from '../../components/PartnerLogo/PartnerLogo'
import styles from './AppHeader.module.css'

export const AppHeader = () => {
  const [viewMode, setViewMode] = useAtom(appViewModeAtom)

  return (
    <header className={styles.appHeader}>
      <div className={styles.left}>
        <div className={styles.logoGroup}>
          <AnimatedLogo size="header" />
          <span className="material-symbols-rounded" aria-hidden="true">close</span>
          <PartnerLogo size="header" />
        </div>
      </div>

      <div className={styles.center}>
        <AnimatedTabs value={viewMode} onValueChange={(value) => setViewMode(value as AppViewMode)}>
          <Tab value="welcome">Welcome</Tab>
          <Tab value="editor">Prompt Builder</Tab>
          <Tab value="references">References</Tab>
        </AnimatedTabs>
      </div>

      <div className={styles.right}>{/* Right side is intentionally empty */}</div>
    </header>
  )
}