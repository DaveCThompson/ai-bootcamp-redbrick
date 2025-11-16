import { AnimatedLogo } from '../../components/AnimatedLogo/AnimatedLogo'
import { PartnerLogo } from '../../components/PartnerLogo/PartnerLogo'
import styles from './WelcomePage.module.css'

export const WelcomePage = () => {
  return (
    <div className={styles.welcomeContainer}>
      <div className={styles.welcomeContent}>
        <div className={styles.logoStack}>
          <AnimatedLogo size="welcome" />
          <span className="material-symbols-rounded">close</span>
          <PartnerLogo size="welcome" />
        </div>
        <h1>Welcome to AI Bootcamp</h1>
        <p>This is the central hub for building, testing, and managing structured AI prompts.</p>
        <p>
          Navigate to the <strong>Prompt Builder</strong> to get started.
        </p>
      </div>
    </div>
  )
}