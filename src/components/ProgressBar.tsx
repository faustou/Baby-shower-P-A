import { useEffect, useRef, useState } from 'react'
import styles from './ProgressBar.module.css'

interface Props {
  current: number
  target: number
  hideAmounts?: boolean
}

export default function ProgressBar({ current, target, hideAmounts = false }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [animated, setAnimated] = useState(false)

  const pct = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true) },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const fmt = (n: number) =>
    n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

  return (
    <div className={styles.wrapper} ref={ref}>
      <div className={styles.track}>
        <div
          className={`${styles.fill} ${animated ? styles.animate : ''}`}
          style={{ width: animated ? `${pct}%` : '0%' }}
        />
      </div>
      <div className={styles.meta}>
        <span className={styles.percent}>{pct}% completado</span>
        {!hideAmounts && (
          <span className={styles.amounts}>
            {fmt(current)} / {fmt(target)}
          </span>
        )}
      </div>
    </div>
  )
}
