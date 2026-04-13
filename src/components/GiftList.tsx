import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Gift } from '../types'
import GiftCard from './GiftCard'
import styles from './GiftList.module.css'

export default function GiftList() {
  const ref = useRef<HTMLElement>(null)
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
      { threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const fetchGifts = async () => {
      const { data, error: supaError } = await supabase
        .from('gifts')
        .select('*')
        .order('display_order')

      if (supaError) {
        setError('No se pudieron cargar los regalos.')
      } else {
        setGifts((data as Gift[]) ?? [])
      }
      setLoading(false)
    }

    fetchGifts()
  }, [])

  const handleGiftChosen = (giftId: string, chosenBy: string) => {
    setGifts((prev) =>
      prev.map((g) =>
        g.id === giftId ? { ...g, is_chosen: true, chosen_by: chosenBy } : g
      )
    )
  }

  return (
    <section className={`${styles.section} section-animate`} id="regalos" ref={ref}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Con tu ayuda</p>
        <h2 className={styles.title}>Lista de Regalos</h2>
        <p className={styles.subtitle}>
          Elegí un regalo o sumá tu aporte — cada detalle llena de alegría este momento
        </p>

        {loading && <p className={styles.loading}>Cargando regalos...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && gifts.length === 0 && (
          <p className={styles.empty}>Los regalos se anunciarán pronto ✨</p>
        )}

        {!loading && !error && gifts.length > 0 && (
          <div className={styles.grid}>
            {gifts.map((gift) => (
              <GiftCard key={gift.id} gift={gift} onGiftChosen={handleGiftChosen} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
