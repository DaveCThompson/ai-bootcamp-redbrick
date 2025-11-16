import styles from './PartnerLogo.module.css'

type PartnerLogoProps = {
  size: 'header' | 'welcome'
  className?: string
}

export const PartnerLogo = ({ size, className }: PartnerLogoProps) => {
  return (
    <svg
      className={`${styles.logoSvg} ${className ?? ''}`}
      data-size={size}
      viewBox="0 0 90 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="partner-logo-title"
    >
      <title id="partner-logo-title">Redbrick Logo</title>
      <text
        x="45"
        y="15"
        fontFamily="var(--font-family-sans)"
        fontSize="14"
        fontWeight="600"
        fill="var(--surface-fg-secondary)"
        textAnchor="middle"
        letterSpacing="1"
      >
        REDBRICK
      </text>
    </svg>
  )
}