import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Gift } from '../types'
import GiftCard from './GiftCard'
import styles from './GiftList.module.css'

export default function GiftList() {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [aliasMp, setAliasMp] = useState('[ALIAS A COMPLETAR]')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCopyAlias = async () => {
    await navigator.clipboard.writeText('FAMILIA.BABY')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
    <section className={styles.section} id="regalos">
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
            <button className={styles.aliasBadge} onClick={handleCopyAlias} title="Copiar alias">
              <span className={styles.aliasBadgeText}>FAMILIA.BABY</span>
              <span className={styles.aliasBadgeHeart}>💕</span>
              <span className={styles.aliasCopyIcon}>
                {copied ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </span>
            </button>
            {copied && <p className={styles.aliasCopiedMsg}>¡Alias copiado!</p>}
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
