import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Confirmation, Gift, Contribution } from '../types'
import ContributeModal from '../components/ContributeModal'
import ProgressBar from '../components/ProgressBar'
import styles from './Admin.module.css'

const STORAGE_KEY = 'admin_auth'
type Tab = 'confirmations' | 'gifts'

// ─── Inline SVG icons ─────────────────────────────────────────────────────────
function IconPencil() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconX() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

// ─── Login ────────────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: { preventDefault(): void }) => {
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
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingCount, setEditingCount] = useState(1)
  const [savingId, setSavingId] = useState<string | null>(null)

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

  const startEdit = (c: Confirmation) => {
    setEditingId(c.id)
    setEditingCount(c.guests_count)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveCount = async (id: string) => {
    if (editingCount < 1) return
    setSavingId(id)
    const { error } = await supabase
      .from('confirmations')
      .update({ guests_count: editingCount })
      .eq('id', id)
    if (!error) {
      setConfirmations((prev) =>
        prev.map((c) => c.id === id ? { ...c, guests_count: editingCount } : c)
      )
    }
    setEditingId(null)
    setSavingId(null)
  }

  const deleteConfirmation = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar la confirmación de "${name}"? Esta acción no se puede deshacer.`)) return
    const { error } = await supabase.from('confirmations').delete().eq('id', id)
    if (!error) {
      setConfirmations((prev) => prev.filter((c) => c.id !== id))
    }
  }

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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {confirmations.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>

                  {/* Editable guests_count */}
                  <td>
                    {editingId === c.id ? (
                      <div className={styles.inlineEdit}>
                        <input
                          type="number"
                          min={1}
                          max={30}
                          className={styles.inlineInput}
                          value={editingCount}
                          onChange={(e) => setEditingCount(Number(e.target.value))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveCount(c.id)
                            if (e.key === 'Escape') cancelEdit()
                          }}
                          autoFocus
                        />
                        <button
                          className={`${styles.iconBtn} ${styles.iconBtnSuccess}`}
                          onClick={() => saveCount(c.id)}
                          disabled={savingId === c.id}
                          title="Guardar"
                        >
                          <IconCheck />
                        </button>
                        <button
                          className={styles.iconBtn}
                          onClick={cancelEdit}
                          title="Cancelar"
                        >
                          <IconX />
                        </button>
                      </div>
                    ) : (
                      <div className={styles.inlineEdit}>
                        <span className={styles.guestsBadge}>{c.guests_count}</span>
                        <button
                          className={`${styles.iconBtn} ${styles.iconBtnMuted}`}
                          onClick={() => startEdit(c)}
                          title="Editar cantidad"
                        >
                          <IconPencil />
                        </button>
                      </div>
                    )}
                  </td>

                  <td>
                    {c.message
                      ? <span className={styles.tableMessage}>"{c.message}"</span>
                      : <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>—</span>
                    }
                  </td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {formatDate(c.created_at)}
                  </td>

                  {/* Delete */}
                  <td>
                    <button
                      className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                      onClick={() => deleteConfirmation(c.id, c.name)}
                      title="Eliminar confirmación"
                    >
                      <IconTrash />
                    </button>
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
<<<<<<< HEAD
  onDeleteContrib: (giftId: string, amount: number) => void
}

function GiftItem({ gift, onReset, onContribute, onDeleteContrib }: GiftItemProps) {
=======
  onEditAmount: (giftId: string, newAmount: number) => void
}

function GiftItem({ gift, onReset, onContribute, onEditAmount }: GiftItemProps) {
>>>>>>> 63a927b775fa2d45c1cfabd903dd0a9cce800213
  const [expanded, setExpanded] = useState(false)
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [loadingContribs, setLoadingContribs] = useState(false)
  const [showContribModal, setShowContribModal] = useState(false)
  const [editingAmount, setEditingAmount] = useState(false)
  const [editAmountValue, setEditAmountValue] = useState('')
  const [savingAmount, setSavingAmount] = useState(false)
  const [editingContribId, setEditingContribId] = useState<string | null>(null)
  const [editingContribName, setEditingContribName] = useState('')
  const [editingContribAmount, setEditingContribAmount] = useState('')
  const [savingContrib, setSavingContrib] = useState(false)

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

<<<<<<< HEAD
  const handleDeleteContribution = async (contrib: Contribution) => {
    if (!confirm(`¿Eliminar el aporte de ${contrib.contributor_name ?? 'Anónimo'} por ${fmt(contrib.amount)}?`)) return
    const { error: delError } = await supabase.from('contributions').delete().eq('id', contrib.id)
    if (delError) return
    const newAmount = Math.max(0, gift.contributed_amount - contrib.amount)
    await supabase.from('gifts').update({ contributed_amount: newAmount }).eq('id', gift.id)
    setContributions((prev) => prev.filter((c) => c.id !== contrib.id))
    onDeleteContrib(gift.id, contrib.amount)
=======
  const startEditAmount = () => {
    setEditAmountValue(String(gift.contributed_amount))
    setEditingAmount(true)
  }

  const cancelEditAmount = () => {
    setEditingAmount(false)
    setEditAmountValue('')
  }

  const saveEditAmount = async () => {
    const parsed = parseInt(editAmountValue, 10)
    if (isNaN(parsed) || parsed < 0) return
    setSavingAmount(true)
    const { error } = await supabase
      .from('gifts')
      .update({ contributed_amount: parsed })
      .eq('id', gift.id)
    if (!error) {
      onEditAmount(gift.id, parsed)
      setContributions([]) // reset historial para que se recargue si abre de nuevo
    }
    setEditingAmount(false)
    setEditAmountValue('')
    setSavingAmount(false)
  }

  const startEditContrib = (contrib: Contribution) => {
    setEditingContribId(contrib.id)
    setEditingContribName(contrib.contributor_name ?? '')
    setEditingContribAmount(String(contrib.amount))
  }

  const cancelEditContrib = () => {
    setEditingContribId(null)
    setEditingContribName('')
    setEditingContribAmount('')
  }

  const saveEditContrib = async (contribId: string) => {
    const parsedAmount = parseInt(editingContribAmount, 10)
    if (!editingContribName.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return
    setSavingContrib(true)
    const { error } = await supabase
      .from('contributions')
      .update({ contributor_name: editingContribName.trim(), amount: parsedAmount })
      .eq('id', contribId)
    if (!error) {
      setContributions((prev) =>
        prev.map((c) =>
          c.id === contribId
            ? { ...c, contributor_name: editingContribName.trim(), amount: parsedAmount }
            : c
        )
      )
    }
    setEditingContribId(null)
    setEditingContribName('')
    setEditingContribAmount('')
    setSavingContrib(false)
>>>>>>> 63a927b775fa2d45c1cfabd903dd0a9cce800213
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
              <>
                <ProgressBar current={gift.contributed_amount} target={gift.target_amount} />

                {/* Edit total acumulado */}
                <div className={styles.editAmountSection}>
                  {editingAmount ? (
                    <div className={styles.editAmountRow}>
                      <span className={styles.editAmountLabel}>Total acumulado:</span>
                      <input
                        type="number"
                        min={0}
                        className={styles.editAmountInput}
                        value={editAmountValue}
                        onChange={(e) => setEditAmountValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEditAmount()
                          if (e.key === 'Escape') cancelEditAmount()
                        }}
                        autoFocus
                      />
                      <button
                        className={`${styles.iconBtn} ${styles.iconBtnSuccess}`}
                        onClick={saveEditAmount}
                        disabled={savingAmount}
                        title="Guardar"
                      >
                        <IconCheck />
                      </button>
                      <button
                        className={styles.iconBtn}
                        onClick={cancelEditAmount}
                        title="Cancelar"
                      >
                        <IconX />
                      </button>
                    </div>
                  ) : (
                    <button
                      className={styles.editAmountBtn}
                      onClick={startEditAmount}
                    >
                      <IconPencil />
                      Editar total acumulado
                    </button>
                  )}
                </div>
              </>
            )}

            <p className={styles.contributionsTitle}>Historial de aportes</p>

            {loadingContribs && <p className={styles.noContributions}>Cargando...</p>}

            {!loadingContribs && contributions.length === 0 && (
              <p className={styles.noContributions}>Aún no hay aportes registrados.</p>
            )}

            {!loadingContribs && contributions.map((contrib) => (
              <div key={contrib.id} className={styles.contributionRow}>
                {editingContribId === contrib.id ? (
                  <>
                    <input
                      className={styles.inlineInput}
                      style={{ flex: 1, width: 'auto' }}
                      value={editingContribName}
                      onChange={(e) => setEditingContribName(e.target.value)}
                      placeholder="Nombre"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEditContrib(contrib.id)
                        if (e.key === 'Escape') cancelEditContrib()
                      }}
                      autoFocus
                    />
                    <input
                      className={styles.inlineInput}
                      style={{ width: 90 }}
                      type="number"
                      min={1}
                      value={editingContribAmount}
                      onChange={(e) => setEditingContribAmount(e.target.value)}
                      placeholder="Monto"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEditContrib(contrib.id)
                        if (e.key === 'Escape') cancelEditContrib()
                      }}
                    />
                    <button
                      className={`${styles.iconBtn} ${styles.iconBtnSuccess}`}
                      onClick={() => saveEditContrib(contrib.id)}
                      disabled={savingContrib}
                      title="Guardar"
                    >
                      <IconCheck />
                    </button>
                    <button
                      className={styles.iconBtn}
                      onClick={cancelEditContrib}
                      title="Cancelar"
                    >
                      <IconX />
                    </button>
                  </>
                ) : (
                  <>
                    <span className={styles.contributionName}>
                      {contrib.contributor_name ?? 'Anónimo'}
                    </span>
                    <span className={styles.contributionAmount}>{fmt(contrib.amount)}</span>
                    {contrib.note && (
                      <span className={styles.contributionNote}>{contrib.note}</span>
                    )}
                    <button
                      className={`${styles.iconBtn} ${styles.iconBtnMuted}`}
                      onClick={() => startEditContrib(contrib)}
                      title="Editar aporte"
                      style={{ marginLeft: 'auto' }}
                    >
                      <IconPencil />
                    </button>
                  </>
                )}
                <button
                  className={styles.deleteContribBtn}
                  onClick={() => handleDeleteContribution(contrib)}
                  title="Eliminar aporte"
                >
                  ✕
                </button>
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

<<<<<<< HEAD
  const handleDeleteContrib = (giftId: string, amount: number) => {
    setGifts((prev) =>
      prev.map((g) => g.id === giftId ? { ...g, contributed_amount: Math.max(0, g.contributed_amount - amount) } : g)
=======
  const handleEditAmount = (giftId: string, newAmount: number) => {
    setGifts((prev) =>
      prev.map((g) => g.id === giftId ? { ...g, contributed_amount: newAmount } : g)
>>>>>>> 63a927b775fa2d45c1cfabd903dd0a9cce800213
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
<<<<<<< HEAD
          onDeleteContrib={handleDeleteContrib}
=======
          onEditAmount={handleEditAmount}
>>>>>>> 63a927b775fa2d45c1cfabd903dd0a9cce800213
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
