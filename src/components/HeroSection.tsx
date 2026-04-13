import FloatingBalloons from './FloatingBalloons'
import styles from './HeroSection.module.css'

export default function HeroSection() {
  return (
    <section className={styles.hero} id="hero">
      <div className={styles.balloonsContainer} aria-hidden="true">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={styles.balloon} />
        ))}
      </div>

      <FloatingBalloons />

      {/* Decorative question marks */}
      <div className={styles.questionMarks} aria-hidden="true">
        <span className={styles.qMark}>?</span>
        <span className={styles.qMark}>?</span>
        <span className={styles.qMark}>?</span>
        <span className={styles.qMark}>?</span>
      </div>

      <div className={styles.content}>
        <p className={styles.eyebrow}>Un nuevo amor llega al mundo</p>
        <h1 className={styles.title}>
          MUY PRONTO LLEGARÁ<br />
          UNA <em>TIERNA SONRISA</em><br />
          PARA LLENAR DE AMOR<br />
          NUESTRO HOGAR...
        </h1>
      </div>

      <div className={styles.scrollIndicator} aria-hidden="true">
        <div className={styles.scrollLine} />
        <div className={styles.scrollDot} />
      </div>
    </section>
  )
}
