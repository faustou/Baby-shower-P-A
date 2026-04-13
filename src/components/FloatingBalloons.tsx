import styles from './FloatingBalloons.module.css'

const balloons = ['b1','b2','b3','b4','b5','b6','b7','b8','b9','b10','b11','b12'] as const

export default function FloatingBalloons() {
  return (
    <div className={styles.container} aria-hidden="true">
      {balloons.map((b) => (
        <div key={b} className={`${styles.balloon} ${styles[b]}`} />
      ))}
    </div>
  )
}
