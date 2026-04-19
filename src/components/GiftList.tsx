import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Gift } from '../types'
import GiftCard from './GiftCard'
import styles from './GiftList.module.css'

export default function GiftList() {
  const ref = useRef<HTMLElement>(null)
  const [gifts, setGifts] = useState<Gift[]>([])
  const [aliasMp, setAliasMp] = useState('[ALIAS A COMPLETAR]')
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
    const fetchAll = async () => {
      const [giftsRes, settingsRes] = await Promise.all([
        supabase.from('gifts').select('*').order('display_order'),
        supabase.from('settings').select('value').eq('key', 'alias_mp').single(),
      ])

      if (giftsRes.error) {
        setError('No se pudieron cargar los regalos.')
      } else {
        setGifts((giftsRes.data as Gift[]) ?? [])
      }

      if (settingsRes.data?.value) {
        setAliasMp(settingsRes.data.value as string)
      }

      setLoading(false)
    }

    fetchAll()
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
              <GiftCard key={gift.id} gift={gift} aliasMp={aliasMp} onGiftChosen={handleGiftChosen} />
            ))}
          </div>
        )}

        {!loading && (
          <div className={styles.aliasCard}>
            <div className={styles.aliasCardGlow} />
            <p className={styles.aliasCardEyebrow}>¿Todavía no elegiste un regalo?</p>
            <p className={styles.aliasCardText}>
              Podés hacernos un aporte a este alias
            </p>
            <div className={styles.aliasBadge}>
              <span className={styles.aliasBadgeText}>FAMILIA.BABY</span>
              <span className={styles.aliasBadgeHeart}>💕</span>
            </div>
            <p className={styles.aliasOwner}>a nombre de Alex Emanuel Frattesi · Mercado Pago</p>
            <p className={styles.aliasCardBody}>
              Con tu ayuda vamos a poder comprar pañales, medicamentos, ropita,
              productos de higiene, mantitas y otras cositas para el bebé.
            </p>
            <p className={styles.aliasCardThanks}>
              ¡Gracias por acompañarnos en este momento tan especial!
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
