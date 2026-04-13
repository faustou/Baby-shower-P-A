import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import styles from './ContributeModal.module.css'

interface Props {
  giftId: string
  giftName: string
  currentAmount: number
  onSuccess: (addedAmount: number) => void
  onClose: () => void
}

export default function ContributeModal({ giftId, giftName, currentAmount, onSuccess, onClose }: Props) {
  const [contributorName, setContributorName] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSave = async () => {
    if (!contributorName.trim()) {
      setError('Ingresá el nombre del aportante.')
      return
    }
    const parsedAmount = parseInt(amount, 10)
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Ingresá un monto válido.')
      return
    }

    setLoading(true)
    setError('')

    const { error: insertError } = await supabase.from('contributions').insert({
      gift_id: giftId,
      contributor_name: contributorName.trim(),
      amount: parsedAmount,
      note: note.trim() || null,
    })

    if (insertError) {
      setLoading(false)
      setError('Error al guardar el aporte.')
      return
    }

    const newTotal = currentAmount + parsedAmount
    const { error: updateError } = await supabase
      .from('gifts')
      .update({ contributed_amount: newTotal })
      .eq('id', giftId)

    if (updateError) {
      setLoading(false)
      setError('El aporte se guardó pero no se pudo actualizar el total.')
      return
    }

    onSuccess(parsedAmount)
  }

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="contribute-title">
        <h3 className={styles.title} id="contribute-title">Registrar aporte</h3>
        <p className={styles.subtitle}>{giftName}</p>

        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="contrib-name">Nombre del aportante</label>
            <input
              id="contrib-name"
              type="text"
              className={styles.input}
              placeholder="Ej: Juan Pérez"
              value={contributorName}
              onChange={(e) => setContributorName(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="contrib-amount">Monto (ARS)</label>
            <input
              id="contrib-amount"
              type="number"
              className={styles.input}
              placeholder="Ej: 5000"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="contrib-note">Nota (opcional)</label>
            <textarea
              id="contrib-note"
              className={styles.textarea}
              placeholder="Mensaje o referencia de la transferencia..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          <div className={styles.actions}>
            <button className={styles.cancelBtn} onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button className={styles.saveBtn} onClick={handleSave} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar aporte'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
