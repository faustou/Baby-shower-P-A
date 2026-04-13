import { useEffect, useRef } from 'react'
import BearSVG from './BearSVG'
import styles from './InvitationSection.module.css'

export default function InvitationSection() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className={`${styles.section} section-animate`} id="invitation" ref={ref}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>HOLA, FAMILIA Y AMIGOS</h2>

        <p className={styles.body}>
          "Hace meses vengo creciendo dentro de mi mami y alimentándome del amor de papi
          y queremos compartir contigo —
          <span className={styles.bodyHighlight}>¡La revelación de mi género!</span>"
        </p>

        <div className={styles.divider}><span>✦</span></div>

        <p className={styles.signature}>Mis papitos</p>
        <p className={styles.signatureNames}>Patricia & Alex</p>
        <p className={styles.signature} style={{ marginTop: '0.5rem' }}>te invitan a descubrirlo</p>

        <div className={styles.bearWrapper}>
          <BearSVG />
        </div>
      </div>
    </section>
  )
}
