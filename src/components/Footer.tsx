import BearSVG from './BearSVG'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.bear}>
        <BearSVG />
      </div>
      <p className={styles.names}>Patricia & Alex</p>
      <div className={styles.divider} />
      <p className={styles.tagline}>
        "Con mucho amor te esperamos para compartir
        el momento más especial de nuestras vidas"
      </p>
      <p className={styles.copy}>Baby Shower · Domingo 24 de Mayo 2025</p>
    </footer>
  )
}
