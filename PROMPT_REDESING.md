# PROMPT — Rediseño visual del sitio

El sitio ya funciona. No tocar lógica de Supabase ni componentes TSX. Solo mejorar el CSS de los archivos `.module.css` y `index.css`.

---

## Problemas a resolver

1. **Fuentes pixeladas/rotas** — Playfair Display se usa en tamaños donde no se ve bien
2. **Diseño demasiado básico** — faltan capas, texturas, profundidad
3. **Mobile débil** — los títulos no dominan, falta impacto visual en pantallas chicas
4. **Falta de identidad** — el sitio no "siente" especial todavía

---

## Cambios en `index.css`

### Tipografía — cambiar el import de Google Fonts en `index.html`

Reemplazar el link actual por este (agrega Cormorant Garamond y DM Sans):

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
```

Luego en `index.css`, actualizar las variables:
```css
--font-display: 'Cormorant Garamond', Georgia, serif;
--font-body: 'DM Sans', system-ui, sans-serif;
```

**Regla de uso:**
- `--font-display` solo en títulos de 2rem o más. Nunca en texto pequeño, labels, ni botones.
- `--font-body` para todo lo demás: body, labels, botones, inputs, texto pequeño.
- El `font-weight: 300` del body global está bien, mantenerlo.

---

## Cambios en `HeroSection.module.css`

### Fondo — agregar textura y profundidad real

```css
.hero {
  background: 
    radial-gradient(ellipse at 20% 50%, rgba(139, 94, 60, 0.15) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, rgba(244, 167, 185, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 60% 80%, rgba(137, 196, 225, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at center, #2d1f18 0%, #1a0f0a 100%);
}
```

### Globos — agregar globos flotantes CSS al hero

Agregar estos estilos nuevos (los globos son elementos posicionados en el componente — ver instrucciones de TSX abajo):

```css
.balloonsContainer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.balloon {
  position: absolute;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  opacity: 0.55;
  animation: floatUp var(--duration, 8s) ease-in-out infinite;
  animation-delay: var(--delay, 0s);
  bottom: -120px;
  filter: blur(0.5px);
}

/* Hilo del globo */
.balloon::after {
  content: '';
  position: absolute;
  bottom: -18px;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: 18px;
  background: rgba(196, 149, 106, 0.4);
}

/* Brillo del globo */
.balloon::before {
  content: '';
  position: absolute;
  top: 20%;
  left: 22%;
  width: 28%;
  height: 28%;
  background: rgba(255,255,255,0.18);
  border-radius: 50%;
  transform: rotate(-30deg);
}

@keyframes floatUp {
  0%   { transform: translateY(0) rotate(var(--tilt, -3deg)); opacity: 0.55; }
  50%  { transform: translateY(-60px) rotate(calc(var(--tilt, -3deg) * -1)); opacity: 0.65; }
  100% { transform: translateY(0) rotate(var(--tilt, -3deg)); opacity: 0.55; }
}

/* Variantes de globos — colores marrones con toques de rosa y azul */
.balloon:nth-child(1)  { width: 90px;  height: 105px; background: radial-gradient(135deg, #8B5E3C, #5a3520); left: 5%;   --duration: 7s;  --delay: 0s;    --tilt: -4deg; bottom: 10%; }
.balloon:nth-child(2)  { width: 60px;  height: 72px;  background: radial-gradient(135deg, #C4956A, #8B5E3C); left: 12%;  --duration: 9s;  --delay: 1.5s;  --tilt: 3deg;  bottom: 30%; }
.balloon:nth-child(3)  { width: 110px; height: 128px; background: radial-gradient(135deg, #6b3f25, #3d2b22); left: 20%;  --duration: 11s; --delay: 0.8s;  --tilt: -6deg; bottom: 5%;  }
.balloon:nth-child(4)  { width: 45px;  height: 54px;  background: radial-gradient(135deg, rgba(244,167,185,0.7), rgba(196,149,106,0.5)); left: 35%;  --duration: 6s;  --delay: 2.2s;  --tilt: 5deg;  bottom: 60%; }
.balloon:nth-child(5)  { width: 80px;  height: 94px;  background: radial-gradient(135deg, #A0714F, #6b3f25); left: 50%;  --duration: 8.5s;--delay: 0.3s;  --tilt: -2deg; bottom: 15%; }
.balloon:nth-child(6)  { width: 55px;  height: 65px;  background: radial-gradient(135deg, rgba(137,196,225,0.6), rgba(139,94,60,0.4)); left: 63%;  --duration: 10s; --delay: 1s;    --tilt: 4deg;  bottom: 45%; }
.balloon:nth-child(7)  { width: 95px;  height: 110px; background: radial-gradient(135deg, #7a4a2e, #4a2d1a); left: 75%;  --duration: 7.5s;--delay: 3s;    --tilt: -5deg; bottom: 8%;  }
.balloon:nth-child(8)  { width: 50px;  height: 60px;  background: radial-gradient(135deg, #C4956A, #A0714F); left: 85%;  --duration: 9.5s;--delay: 0.6s;  --tilt: 2deg;  bottom: 35%; }
.balloon:nth-child(9)  { width: 70px;  height: 82px;  background: radial-gradient(135deg, #5a3520, #2d1f18); left: 92%;  --duration: 8s;  --delay: 1.8s;  --tilt: -3deg; bottom: 20%; }
.balloon:nth-child(10) { width: 40px;  height: 48px;  background: radial-gradient(135deg, rgba(244,167,185,0.5), rgba(244,167,185,0.2)); left: 28%;  --duration: 12s; --delay: 4s;    --tilt: 6deg;  bottom: 70%; }
```

### Signos "?" — hacer más dramáticos

```css
.qMark:nth-child(1) { font-size: clamp(180px, 35vw, 320px); top: -60px;   left: -50px;  transform: rotate(-15deg); opacity: 0.22; }
.qMark:nth-child(2) { font-size: clamp(120px, 22vw, 200px); top: 15%;     right: -30px; transform: rotate(12deg);  opacity: 0.18; }
.qMark:nth-child(3) { font-size: clamp(150px, 28vw, 240px); bottom: -80px;left: 25%;   transform: rotate(-8deg);  opacity: 0.14; }
.qMark:nth-child(4) { font-size: clamp(80px,  15vw, 130px); bottom: 20%;  right: 8%;   transform: rotate(20deg);  opacity: 0.16; }
```

### Título hero — más grande y más peso

```css
.title {
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 8vw, 6.5rem);
  font-weight: 600;
  line-height: 1.1;
  color: var(--color-text);
  margin-bottom: 3rem;
  letter-spacing: -0.01em;
}

.title em {
  font-style: italic;
  font-weight: 300;
  color: var(--color-brown-warm);
}
```

### Eyebrow del hero

```css
.eyebrow {
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--color-accent-pink);
  margin-bottom: 2rem;
  opacity: 0.9;
}
```

### En `HeroSection.tsx` — agregar los globos

Dentro del JSX del hero, agregar un div con 10 hijos para los globos:

```tsx
<div className={styles.balloonsContainer}>
  {Array.from({ length: 10 }).map((_, i) => (
    <div key={i} className={styles.balloon} />
  ))}
</div>
```

Ponerlo como primer hijo del `.hero`, antes de `.questionMarks`.

---

## Cambios en `InvitationSection.module.css`

### Sección más dramática

```css
.section {
  background: linear-gradient(180deg, var(--color-surface) 0%, #241810 100%);
  padding: 10rem 2rem;
  position: relative;
  overflow: hidden;
}

/* Línea decorativa superior */
.section::after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: 80px;
  background: linear-gradient(to bottom, transparent, var(--color-brown-warm));
}
```

### Heading más grande

```css
.heading {
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 6vw, 4.5rem);
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--color-brown-warm);
  margin-bottom: 3rem;
  line-height: 1.1;
}
```

### Body — NO usar font-display en texto corrido

```css
.body {
  font-family: var(--font-body);
  font-size: clamp(1.15rem, 2.5vw, 1.5rem);
  font-style: normal;
  font-weight: 300;
  color: var(--color-text);
  line-height: 2;
  margin-bottom: 3rem;
  letter-spacing: 0.01em;
}

/* La frase clave en itálica con la display font */
.bodyHighlight {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-style: italic;
  font-weight: 300;
  color: var(--color-accent-pink);
  margin-top: 1.5rem;
  line-height: 1.5;
}
```

### Nombres — grandes y con aire

```css
.signatureNames {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-style: italic;
  font-weight: 300;
  color: var(--color-brown-warm);
  margin-top: 0.6rem;
  line-height: 1.2;
}

.signature {
  font-family: var(--font-body);
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  color: var(--color-text-muted);
  text-transform: uppercase;
  font-weight: 400;
  margin-top: 2rem;
}
```

### Separador decorativo entre párrafo y firma

Agregar en el JSX entre `.body` y `.signature`:

```tsx
<div className={styles.divider}>
  <span>✦</span>
</div>
```

```css
.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  margin: 2.5rem 0;
  color: var(--color-brown-warm);
  font-size: 1rem;
  opacity: 0.6;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  max-width: 80px;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--color-brown-warm));
}

.divider::after {
  background: linear-gradient(to left, transparent, var(--color-brown-warm));
}
```

---

## Cambios en `EventInfoSection.module.css`

### Cards más grandes y con más presencia

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 3.5rem 2rem;
  text-align: center;
  box-shadow: var(--shadow-card), inset 0 1px 0 rgba(196, 149, 106, 0.1);
  transition: transform var(--transition-med), border-color var(--transition-med), box-shadow var(--transition-med);
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-brown-warm), transparent);
  opacity: 0;
  transition: opacity var(--transition-med);
}

.card:hover::before {
  opacity: 1;
}

.card:hover {
  transform: translateY(-6px);
  border-color: var(--color-brown-warm);
  box-shadow: var(--shadow-card), 0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(196, 149, 106, 0.2);
}
```

### Valor de card — más grande

```css
.cardValue {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.2;
  margin-top: 0.2rem;
}
```

### Título de sección

```css
.title {
  text-align: center;
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 5vw, 4rem);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 5rem;
  letter-spacing: -0.01em;
}
```

---

## Cambios en `RSVPForm.module.css`

### Título de sección

```css
.title {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 5vw, 4rem);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.8rem;
  letter-spacing: -0.01em;
}
```

### Botón submit — más llamativo

```css
.submitBtn {
  width: 100%;
  padding: 1.4rem 2rem;
  background: linear-gradient(135deg, var(--color-brown-warm) 0%, var(--color-brown-light) 50%, #A0714F 100%);
  background-size: 200% 200%;
  color: #1a0f0a;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  border-radius: var(--radius-md);
  transition: background-position var(--transition-med), transform var(--transition-fast), box-shadow var(--transition-fast);
  box-shadow: 0 4px 20px rgba(196, 149, 106, 0.3);
  margin-top: 0.5rem;
}

.submitBtn:hover:not(:disabled) {
  background-position: right center;
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(196, 149, 106, 0.45);
}
```

---

## Cambios en `GiftCard.module.css`

### Botón "Elijo este regalo" — más especial

```css
.chooseBtn {
  width: 100%;
  padding: 1rem;
  background: transparent;
  border: 1px solid var(--color-brown-warm);
  border-radius: var(--radius-sm);
  color: var(--color-brown-warm);
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  transition: all var(--transition-med);
  position: relative;
  overflow: hidden;
}

.chooseBtn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--color-brown-warm), var(--color-brown-light));
  opacity: 0;
  transition: opacity var(--transition-med);
}

.chooseBtn:hover:not(:disabled) {
  color: #1a0f0a;
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(196, 149, 106, 0.35);
}

.chooseBtn:hover:not(:disabled)::before {
  opacity: 1;
}

/* El texto del botón necesita estar sobre el ::before */
.chooseBtn span {
  position: relative;
  z-index: 1;
}
```

Asegurarse de que el texto del botón esté envuelto en `<span>` en el TSX:
```tsx
<button className={styles.chooseBtn} onClick={...}>
  <span>Elijo este regalo</span>
</button>
```

---

## Mobile — ajustes específicos

En todos los `.module.css`, agregar o mejorar los breakpoints para mobile:

### `HeroSection.module.css`
```css
@media (max-width: 640px) {
  .hero {
    padding: 1.5rem 1.5rem 6rem;
    justify-content: flex-end;
    min-height: 100svh;
  }

  .content {
    text-align: left;
  }

  .eyebrow {
    text-align: left;
  }

  .title {
    font-size: clamp(2.6rem, 11vw, 3.5rem);
    text-align: left;
  }

  /* En mobile los globos son más sutiles */
  .balloon {
    opacity: 0.35;
  }
}
```

### `InvitationSection.module.css`
```css
@media (max-width: 640px) {
  .section {
    padding: 7rem 1.5rem;
  }

  .heading {
    font-size: clamp(2rem, 9vw, 2.8rem);
    text-align: left;
  }

  .inner {
    text-align: left;
  }

  .divider {
    justify-content: flex-start;
  }

  .divider::after {
    display: none;
  }
}
```

### `EventInfoSection.module.css`
```css
@media (max-width: 640px) {
  .section {
    padding: 6rem 1.5rem;
  }

  .card {
    padding: 2.5rem 1.5rem;
  }

  .title {
    font-size: clamp(2rem, 9vw, 2.8rem);
    text-align: left;
    margin-bottom: 3rem;
  }
}
```

---

## Resumen de cambios en TSX (solo los mínimos necesarios)

1. **`HeroSection.tsx`** — agregar `<div className={styles.balloonsContainer}>` con 10 `<div className={styles.balloon} />`
2. **`InvitationSection.tsx`** — agregar `<div className={styles.divider}><span>✦</span></div>` entre el texto y la firma
3. **`GiftCard.tsx`** — envolver el texto del botón en `<span>`

---

## Lo que NO tocar
- Lógica de Supabase
- Interfaces TypeScript
- Routing
- Admin panel
- Cualquier archivo que no sea CSS o los 3 TSX mencionados arriba
