import { useEffect, useRef } from 'react'
import styles from './EventInfoSection.module.css'

function CalendarIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function MapsLinkIcon() {
  return (
    <svg className={styles.mapsIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335"/>
      <path d="M12 11.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill="#fff"/>
    </svg>
  )
}

export default function EventInfoSection() {
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
    <section className={`${styles.section} section-animate`} id="evento" ref={ref}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Nos vemos en</p>
        <h2 className={styles.title}>El Gran Día</h2>

        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <CalendarIcon />
            </div>
            <p className={styles.cardLabel}>Fecha</p>
            <p className={styles.cardValue}>Domingo<br />24 de Mayo</p>
          </div>

          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <ClockIcon />
            </div>
            <p className={styles.cardLabel}>Horario</p>
            <p className={styles.cardValue}>14:00<br />a 17:00 hs</p>
          </div>

          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <MapPinIcon />
            </div>
            <p className={styles.cardLabel}>Lugar</p>
            <a
              className={styles.cardValue + ' ' + styles.cardAddressLink}
              href="https://www.google.com.ar/maps/place/Av.+Ing.+Eduardo+Madero+2355,+B1669CLB+Del+Viso,+Provincia+de+Buenos+Aires/@-34.4592789,-58.8075223,20.5z/data=!4m6!3m5!1s0x95bc994ab44764d1:0xc7254d2be4a1b491!8m2!3d-34.4593734!4d-58.8072488!16s%2Fg%2F11ykhv7n4q?hl=es&entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
            >
              Av. Ing. Eduardo Madero 2355, Del Viso
            </a>
            <a
              className={styles.mapsButton}
              href="https://www.google.com.ar/maps/place/Av.+Ing.+Eduardo+Madero+2355,+B1669CLB+Del+Viso,+Provincia+de+Buenos+Aires/@-34.4592789,-58.8075223,20.5z/data=!4m6!3m5!1s0x95bc994ab44764d1:0xc7254d2be4a1b491!8m2!3d-34.4593734!4d-58.8072488!16s%2Fg%2F11ykhv7n4q?hl=es&entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapsLinkIcon />
              Ver en Maps
            </a>
            <p className={styles.cardSub}>Te esperamos con mucho amor</p>
          </div>
        </div>
      </div>
    </section>
  )
}
