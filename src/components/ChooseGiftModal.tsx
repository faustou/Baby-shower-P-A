import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import styles from './ChooseGiftModal.module.css'

interface Props {
  giftId: string
  giftName: string
  onSuccess: (chosenBy: string) => void
  onClose: () => void
}

export default function ChooseGiftModal({ giftId, giftName, onSuccess, onClose }: Props) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleConfirm = async () => {
    if (!name.trim()) {
      setError('Por favor ingresá tu nombre.')
      return
    }
    setLoading(true)
    setError('')

    const { error: supaError } = await supabase
      .from('gifts')
      .update({ is_chosen: true, chosen_by: name.trim() })
      .eq('id', giftId)
      .eq('is_chosen', false)

    if (supaError) {
      setLoading(false)
      setError('No se pudo guardar. Intentá de nuevo.')
      return
    }

    onSuccess(name.trim())
  }

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h3 className={styles.title} id="modal-title">¡Elegís este regalo!</h3>
        <p className={styles.subtitle}>"{giftName}" — Ingresá tu nombre para reservarlo</p>

        <label className={styles.label} htmlFor="chooser-name">Tu nombre</label>
        <input
          id="chooser-name"
          type="text"
          className={styles.input}
          placeholder="Ej: Ana García"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          autoFocus
        />
        {error && <p className={styles.errorText}>{error}</p>}

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button className={styles.confirmBtn} onClick={handleConfirm} disabled={loading}>
            {loading ? 'Guardando...' : '¡Lo elijo!'}
          </button>
        </div>
      </div>
    </div>
  )
}
