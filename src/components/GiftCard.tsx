import { useEffect, useState } from 'react'
import type { Gift } from '../types'
import { supabase } from '../lib/supabase'
import ProgressBar from './ProgressBar'
import ChooseGiftModal from './ChooseGiftModal'
import styles from './GiftCard.module.css'

interface Props {
  gift: Gift
  aliasMp: string
  onGiftChosen: (giftId: string, chosenBy: string) => void
}

export default function GiftCard({ gift, aliasMp, onGiftChosen }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [contributors, setContributors] = useState<string[]>([])

  useEffect(() => {
    if (gift.type !== 'contribute') return
    supabase
      .from('contributions')
      .select('contributor_name')
      .eq('gift_id', gift.id)
      .order('created_at')
      .then(({ data }) => {
        const names = (data ?? [])
          .map((r: { contributor_name: string | null }) => r.contributor_name)
          .filter((n): n is string => Boolean(n))
        setContributors(names)
      })
  }, [gift.id, gift.type])

  const fmt = (n: number) =>
    n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

  return (
    <>
      <article className={`${styles.card} ${gift.is_chosen ? styles.chosen : ''}`}>
        {/* Image */}
        <div className={styles.imageWrapper}>
          {gift.image_url ? (
            <img src={gift.image_url} alt={gift.name} className={styles.image} loading="lazy" />
          ) : (
            <div className={styles.imagePlaceholder} aria-hidden="true">🎁</div>
          )}
          {gift.is_chosen && (
            <span className={styles.chosenBadge}>Elegido ♥</span>
          )}
        </div>

        {/* Body */}
        <div className={styles.body}>
          <h3 className={`${styles.name} ${gift.is_chosen ? styles.strikethrough : ''}`}>
            {gift.name}
          </h3>

          {gift.description && (
            <p className={styles.description}>{gift.description}</p>
          )}

          {gift.type === 'choose' && gift.price !== null && (
            <p className={styles.price}>{fmt(gift.price)}</p>
          )}

          {gift.type === 'contribute' && gift.target_amount !== null && (
            <p className={styles.price}>Objetivo: {fmt(gift.target_amount)}</p>
          )}

          {gift.type === 'choose' && gift.is_chosen && gift.chosen_by && (
            <p className={styles.chosenBy}>Elegido por {gift.chosen_by} ♥</p>
          )}

          {gift.type === 'choose' && gift.product_url && !gift.is_chosen && (
            <a
              href={gift.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.productLink}
            >
              Ver producto
              <svg className={styles.productLinkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          )}

          {gift.type === 'contribute' && gift.target_amount !== null && (
            <ProgressBar
              current={gift.contributed_amount}
              target={gift.target_amount}
            />
          )}

          {gift.type === 'contribute' && contributors.length > 0 && (
            <div className={styles.contributorsList}>
              <span className={styles.contributorsLabel}>Aportaron ♥</span>
              <div className={styles.contributorNames}>
                {contributors.map((name, i) => (
                  <span key={i} className={styles.contributorChip}>{name}</span>
                ))}
              </div>
            </div>
          )}

          {gift.type === 'contribute' && (
            <div className={styles.contributeInfo}>
              Para aportar, transferí al alias:{' '}
              <span className={styles.aliasText}>{aliasMp}</span>
            </div>
          )}
        </div>

        {/* Choose button */}
        {gift.type === 'choose' && (
          <div className={styles.footer}>
            <button
              className={styles.chooseBtn}
              onClick={() => setShowModal(true)}
              disabled={gift.is_chosen}
              aria-label={gift.is_chosen ? 'Regalo ya elegido' : `Elegir regalo: ${gift.name}`}
            >
              <span>{gift.is_chosen ? 'Ya fue elegido ♥' : 'Elijo este regalo'}</span>
            </button>
          </div>
        )}
      </article>

      {showModal && (
        <ChooseGiftModal
          giftId={gift.id}
          giftName={gift.name}
          onSuccess={(chosenBy) => {
            onGiftChosen(gift.id, chosenBy)
            setShowModal(false)
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
