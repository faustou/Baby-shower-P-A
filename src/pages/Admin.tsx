import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Confirmation, Gift, Contribution } from '../types'
import ContributeModal from '../components/ContributeModal'
import ProgressBar from '../components/ProgressBar'
import styles from './Admin.module.css'

const STORAGE_KEY = 'admin_auth'
type Tab = 'confirmations' | 'gifts'

// ─── Login ────────────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true')
      onLogin()
    } else {
      setError('Contraseña incorrecta.')
    }
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginIcon}>🔒</div>
        <h1 className={styles.loginTitle}>Panel Admin</h1>
        <p className={styles.loginSubtitle}>Solo para Patricia & Alex</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.loginField}>
            <label className={styles.loginLabel} htmlFor="admin-password">Contraseña</label>
            <input
              id="admin-password"
              type="password"
              className={styles.loginInput}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          {error && <p className={styles.loginError}>{error}</p>}
          <button type="submit" className={styles.loginBtn}>Ingresar</button>
        </form>
      </div>
    </div>
  )
}

// ─── Confirmations Tab ────────────────────────────────────────────────────────
function ConfirmationsTab() {
  const [confirmations, setConfirmations] = useState<Confirmation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('confirmations')
        .select('*')
        .order('created_at', { ascending: false })
      setConfirmations((data as Confirmation[]) ?? [])
      setLoading(false)
    }
    fetch()
  }, [])

  const total = confirmations.reduce((sum, c) => sum + c.guests_count, 0)

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })

  if (loading) return <p className={styles.loadingText}>Cargando...</p>

  return (
    <>
      <div className={styles.statCard}>
        <span className={styles.statLabel}>Total personas confirmadas</span>
        <span className={styles.statValue}>{total}</span>
      </div>

      {confirmations.length === 0 ? (
        <p className={styles.emptyText}>Aún no hay confirmaciones.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Personas</th>
                <th>Mensaje</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {confirmations.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td><span className={styles.guestsBadge}>{c.guests_count}</span></td>
                  <td>
                    {c.message
                      ? <span className={styles.tableMessage}>"{c.message}"</span>
                      : <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>—</span>
                    }
                  </td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {formatDate(c.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

// ─── Gift Item ────────────────────────────────────────────────────────────────
interface GiftItemProps {
  gift: Gift
  onReset: (giftId: string) => void
  onContribute: (giftId: string, amount: number) => void
}

function GiftItem({ gift, onReset, onContribute }: GiftItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [loadingContribs, setLoadingContribs] = useState(false)
  const [showContribModal, setShowContribModal] = useState(false)

  const handleExpand = async () => {
    const next = !expanded
    setExpanded(next)
    if (next && gift.type === 'contribute' && contributions.length === 0) {
      setLoadingContribs(true)
      const { data } = await supabase
        .from('contributions')
        .select('*')
        .eq('gift_id', gift.id)
        .order('created_at', { ascending: false })
      setContributions((data as Contribution[]) ?? [])
      setLoadingContribs(false)
    }
  }

  const handleReset = async () => {
    if (!confirm(`¿Resetear "${gift.name}"? Esto lo marcará como disponible nuevamente.`)) return
    const { error } = await supabase
      .from('gifts')
      .update({ is_chosen: false, chosen_by: null })
      .eq('id', gift.id)
    if (!error) onReset(gift.id)
  }

  const fmt = (n: number) =>
    n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

  return (
    <>
      <div className={styles.giftItem}>
        <div className={styles.giftHeader} onClick={handleExpand}>
          {gift.image_url
            ? <img src={gift.image_url} alt={gift.name} className={styles.giftImg} />
            : <div className={styles.giftImgPlaceholder}>🎁</div>
          }

          <div className={styles.giftInfo}>
            <p className={styles.giftName}>{gift.name}</p>
            {gift.type === 'choose' ? (
              <p className={`${styles.giftStatus} ${gift.is_chosen ? styles.chosen : ''}`}>
                {gift.is_chosen ? `Elegido por ${gift.chosen_by} ♥` : 'Disponible'}
              </p>
            ) : (
              <p className={styles.giftStatus}>
                {fmt(gift.contributed_amount)} / {fmt(gift.target_amount ?? 0)} aportado
              </p>
            )}
          </div>

          <div className={styles.giftActions}>
            {gift.type === 'choose' && gift.is_chosen && (
              <button className={styles.resetBtn} onClick={(e) => { e.stopPropagation(); handleReset() }}>
                Resetear
              </button>
            )}
            {gift.type === 'contribute' && (
              <button
                className={styles.contributeBtn}
                onClick={(e) => { e.stopPropagation(); setShowContribModal(true) }}
              >
                Registrar aporte
              </button>
            )}
            <svg
              className={`${styles.chevron} ${expanded ? styles.open : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {expanded && (
          <div className={styles.giftExpanded}>
            {gift.type === 'contribute' && gift.target_amount !== null && (
              <ProgressBar current={gift.contributed_amount} target={gift.target_amount} />
            )}

            <p className={styles.contributionsTitle}>Historial de aportes</p>

            {loadingContribs && <p className={styles.noContributions}>Cargando...</p>}

            {!loadingContribs && contributions.length === 0 && (
              <p className={styles.noContributions}>Aún no hay aportes registrados.</p>
            )}

            {!loadingContribs && contributions.map((contrib) => (
              <div key={contrib.id} className={styles.contributionRow}>
                <span className={styles.contributionName}>
                  {contrib.contributor_name ?? 'Anónimo'}
                </span>
                <span className={styles.contributionAmount}>{fmt(contrib.amount)}</span>
                {contrib.note && (
                  <span className={styles.contributionNote}>{contrib.note}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showContribModal && (
        <ContributeModal
          giftId={gift.id}
          giftName={gift.name}
          currentAmount={gift.contributed_amount}
          onSuccess={(added) => {
            onContribute(gift.id, added)
            setContributions([])
            setShowContribModal(false)
          }}
          onClose={() => setShowContribModal(false)}
        />
      )}
    </>
  )
}

// ─── Gifts Tab ────────────────────────────────────────────────────────────────
function GiftsTab() {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('gifts').select('*').order('display_order')
      setGifts((data as Gift[]) ?? [])
      setLoading(false)
    }
    fetch()
  }, [])

  const handleReset = (giftId: string) => {
    setGifts((prev) =>
      prev.map((g) => g.id === giftId ? { ...g, is_chosen: false, chosen_by: null } : g)
    )
  }

  const handleContribute = (giftId: string, amount: number) => {
    setGifts((prev) =>
      prev.map((g) => g.id === giftId ? { ...g, contributed_amount: g.contributed_amount + amount } : g)
    )
  }

  if (loading) return <p className={styles.loadingText}>Cargando...</p>
  if (gifts.length === 0) return <p className={styles.emptyText}>No hay regalos cargados aún.</p>

  return (
    <div className={styles.giftsList}>
      {gifts.map((gift) => (
        <GiftItem
          key={gift.id}
          gift={gift}
          onReset={handleReset}
          onContribute={handleContribute}
        />
      ))}
    </div>
  )
}

// ─── Main Admin Component ─────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(STORAGE_KEY) === 'true')
  const [tab, setTab] = useState<Tab>('confirmations')

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    setAuthed(false)
  }

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />
  }

  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.headerTitle}>Panel Admin</span>
          <span className={styles.headerBadge}>Patricia & Alex</span>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>Cerrar sesión</button>
      </header>

      <nav className={styles.tabs}>
        <button
          className={`${styles.tabBtn} ${tab === 'confirmations' ? styles.active : ''}`}
          onClick={() => setTab('confirmations')}
        >
          Confirmados
        </button>
        <button
          className={`${styles.tabBtn} ${tab === 'gifts' ? styles.active : ''}`}
          onClick={() => setTab('gifts')}
        >
          Regalos
        </button>
      </nav>

      <div className={styles.content}>
        {tab === 'confirmations' && <ConfirmationsTab />}
        {tab === 'gifts' && <GiftsTab />}
      </div>
    </div>
  )
}
