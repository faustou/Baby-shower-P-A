import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import styles from './RSVPForm.module.css'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function RSVPForm() {
  const ref = useRef<HTMLElement>(null)
  const [name, setName] = useState('')
  const [guestsCount, setGuestsCount] = useState(1)
  const [message, setMessage] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setErrorMsg('Por favor ingresá tu nombre.')
      return
    }
    if (guestsCount < 1) {
      setErrorMsg('La cantidad mínima es 1 persona.')
      return
    }

    setFormState('loading')
    setErrorMsg('')

    const { error } = await supabase.from('confirmations').insert({
      name: name.trim(),
      guests_count: guestsCount,
      message: message.trim() || null,
    })

    if (error) {
      setFormState('error')
      setErrorMsg('Hubo un error al confirmar. Por favor intentá de nuevo.')
      return
    }

    setFormState('success')
    setName('')
    setGuestsCount(1)
    setMessage('')
  }

  return (
    <section className={`${styles.section} section-animate`} id="confirmar" ref={ref}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>¡Queremos verte!</p>
        <h2 className={styles.title}>Confirmá tu asistencia</h2>
        <p className={styles.subtitle}>
          Tu presencia hace aún más especial este momento
        </p>

        {formState === 'success' ? (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>🎉</div>
            <p className={styles.successTitle}>¡Nos vemos el 24!</p>
            <p className={styles.successText}>
              ¡Gracias por confirmar! Estamos muy emocionados de compartir este momento con vos.
            </p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor="rsvp-name" className={styles.label}>Nombre completo *</label>
              <input
                id="rsvp-name"
                type="text"
                className={styles.input}
                placeholder="Tu nombre y apellido"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={formState === 'loading'}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="rsvp-guests" className={styles.label}>¿Cuántos van?</label>
              <input
                id="rsvp-guests"
                type="number"
                className={styles.input}
                min={1}
                max={20}
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                disabled={formState === 'loading'}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="rsvp-message" className={styles.label}>Mensaje para los papás</label>
              <textarea
                id="rsvp-message"
                className={styles.textarea}
                placeholder="Escribí un mensaje de amor..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={formState === 'loading'}
              />
            </div>

            {errorMsg && <p className={styles.errorText}>{errorMsg}</p>}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={formState === 'loading'}
            >
              {formState === 'loading' ? 'Enviando...' : '¡Confirmo mi asistencia!'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
