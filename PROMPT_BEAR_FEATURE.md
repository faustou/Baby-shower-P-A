# PROMPT — Feature: Osito alternante con bebé revelación de género

## Objetivo
Modificar `BearSVG.tsx` para que el componente alterne en loop entre dos estados visuales:
- **Estado 1:** El osito actual (marrón, tal como está)
- **Estado 2:** Un bebé tierno vestido mitad rosa (#F4A7B9) mitad celeste (#89C4E1)

La transición entre estados debe ser suave, con crossfade CSS (opacity), sin librerías externas.

---

## Implementación

### Estructura del componente

Reemplazar `BearSVG.tsx` completamente. El componente tiene dos SVGs superpuestos con `position: absolute`, y alterna la opacidad entre ellos usando un estado booleano que cambia cada 3 segundos con `setInterval`.

```tsx
import { useState, useEffect } from 'react'
import styles from './InvitationSection.module.css'

export default function BearSVG() {
  const [showBaby, setShowBaby] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setShowBaby(prev => !prev)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.bearContainer}>
      {/* Estado 1: Osito */}
      <svg
        className={styles.bear}
        style={{ opacity: showBaby ? 0 : 1 }}
        width="140" height="140" viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* --- PEGAR AQUÍ EL SVG DEL OSITO ACTUAL SIN CAMBIOS --- */}
        {/* Left ear */}
        <circle cx="30" cy="28" r="16" fill="#8B5E3C" />
        <circle cx="30" cy="28" r="9" fill="#C4956A" />
        {/* Right ear */}
        <circle cx="90" cy="28" r="16" fill="#8B5E3C" />
        <circle cx="90" cy="28" r="9" fill="#C4956A" />
        {/* Head */}
        <circle cx="60" cy="52" r="38" fill="#8B5E3C" />
        {/* Face highlight */}
        <ellipse cx="60" cy="66" rx="20" ry="14" fill="#C4956A" />
        {/* Eyes */}
        <circle cx="48" cy="46" r="5" fill="#1a0f0a" />
        <circle cx="72" cy="46" r="5" fill="#1a0f0a" />
        {/* Eye shine */}
        <circle cx="50" cy="44" r="1.5" fill="white" />
        <circle cx="74" cy="44" r="1.5" fill="white" />
        {/* Nose */}
        <ellipse cx="60" cy="58" rx="6" ry="4" fill="#4A2810" />
        {/* Mouth */}
        <path d="M54 63 Q60 69 66 63" stroke="#4A2810" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        {/* Rosy cheeks */}
        <circle cx="40" cy="56" r="6" fill="#F4A7B9" opacity="0.5" />
        <circle cx="80" cy="56" r="6" fill="#F4A7B9" opacity="0.5" />
        {/* Body */}
        <ellipse cx="60" cy="98" rx="28" ry="22" fill="#8B5E3C" />
        {/* Tummy */}
        <ellipse cx="60" cy="100" rx="16" ry="13" fill="#C4956A" />
        {/* Heart on tummy */}
        <path d="M57 98 C57 95.5 54 94 54 96.5 C54 99 57 101 57 101 C57 101 60 99 60 96.5 C60 94 57 95.5 57 98 Z" fill="#F4A7B9" opacity="0.9" />
      </svg>

      {/* Estado 2: Bebé mitad rosa / mitad celeste */}
      <svg
        className={styles.bear}
        style={{ opacity: showBaby ? 1 : 0, position: 'absolute', top: 0, left: 0 }}
        width="140" height="140" viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Bebé revelación de género"
      >
        {/* Definir clipPath para dividir el SVG al medio */}
        <defs>
          <clipPath id="leftHalf">
            <rect x="0" y="0" width="60" height="120" />
          </clipPath>
          <clipPath id="rightHalf">
            <rect x="60" y="0" width="60" height="120" />
          </clipPath>
        </defs>

        {/* === CABEZA BASE (skin tone neutro) === */}
        {/* Cabeza izquierda — rosa */}
        <g clipPath="url(#leftHalf)">
          {/* Orejita izquierda */}
          <circle cx="28" cy="48" r="10" fill="#F4A7B9" />
          {/* Cabeza */}
          <circle cx="60" cy="52" r="36" fill="#FDDBB4" />
          {/* Gorrito lado nena — rosa */}
          <ellipse cx="60" cy="20" rx="28" ry="18" fill="#F4A7B9" />
          <rect x="32" y="18" width="28" height="8" fill="#F4A7B9" />
          {/* Pompón gorrito nena */}
          <circle cx="36" cy="14" r="6" fill="#fff" opacity="0.8" />
          {/* Cachete rosa */}
          <circle cx="38" cy="60" r="7" fill="#F4A7B9" opacity="0.5" />
        </g>

        {/* Cabeza derecha — celeste */}
        <g clipPath="url(#rightHalf)">
          {/* Orejita derecha */}
          <circle cx="92" cy="48" r="10" fill="#89C4E1" />
          {/* Cabeza */}
          <circle cx="60" cy="52" r="36" fill="#FDDBB4" />
          {/* Gorrito lado nene — celeste */}
          <ellipse cx="60" cy="20" rx="28" ry="18" fill="#89C4E1" />
          <rect x="60" y="18" width="28" height="8" fill="#89C4E1" />
          {/* Pompón gorrito nene */}
          <circle cx="84" cy="14" r="6" fill="#fff" opacity="0.8" />
          {/* Cachete celeste */}
          <circle cx="82" cy="60" r="7" fill="#89C4E1" opacity="0.5" />
        </g>

        {/* === CARA (encima de todo, sin clip) === */}
        {/* Ojos */}
        <circle cx="46" cy="50" r="4.5" fill="#2d1f18" />
        <circle cx="74" cy="50" r="4.5" fill="#2d1f18" />
        {/* Brillo ojos */}
        <circle cx="48" cy="48" r="1.5" fill="white" />
        <circle cx="76" cy="48" r="1.5" fill="white" />
        {/* Naricita */}
        <ellipse cx="60" cy="60" rx="4" ry="2.5" fill="#E8A080" />
        {/* Boquita sonriente */}
        <path d="M53 65 Q60 72 67 65" stroke="#C47060" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        {/* Línea divisoria central sutil */}
        <line x1="60" y1="16" x2="60" y2="120" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="3,3" />

        {/* === CUERPO === */}
        {/* Cuerpo izquierda — rosa */}
        <g clipPath="url(#leftHalf)">
          <ellipse cx="60" cy="100" rx="26" ry="20" fill="#F4A7B9" />
          {/* Detalle ropa nena: volado */}
          <ellipse cx="46" cy="82" rx="14" ry="5" fill="#F78FA7" opacity="0.7" />
        </g>
        {/* Cuerpo derecha — celeste */}
        <g clipPath="url(#rightHalf)">
          <ellipse cx="60" cy="100" rx="26" ry="20" fill="#89C4E1" />
          {/* Detalle ropa nene: botón */}
          <circle cx="74" cy="84" r="3" fill="#5BA8C9" opacity="0.8" />
          <circle cx="74" cy="92" r="3" fill="#5BA8C9" opacity="0.8" />
        </g>

        {/* Signo ? central en la panza */}
        <text
          x="60" y="105"
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fill="white"
          opacity="0.85"
          fontFamily="serif"
        >?</text>
      </svg>
    </div>
  )
}
```

---

## CSS a agregar en `InvitationSection.module.css`

```css
.bearContainer {
  position: relative;
  width: 140px;
  height: 140px;
  margin: 3rem auto 0;
}

.bearContainer svg {
  transition: opacity 0.8s ease-in-out;
}
```

Reemplazar el `.bear` y `.bearWrapper` existentes por `.bearContainer`. Eliminar el `.bearWrapper` del módulo CSS si ya no se usa.

---

## Notas importantes
- El `setInterval` debe limpiarse en el return del `useEffect` (ya está en el código)
- Los `clipPath` ids `leftHalf` y `rightHalf` son globales en SVG — si hay múltiples instancias del componente en la misma página podrían colisionar. Como solo hay una instancia, no es problema.
- NO tocar `InvitationSection.tsx` — solo `BearSVG.tsx` y `InvitationSection.module.css`
- NO tocar ningún otro archivo
