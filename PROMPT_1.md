# PROMPT PRINCIPAL — Baby Shower Invitation App

Leé primero los archivos de contexto en este orden:
1. `CLAUDE.md` — stack, estructura y tablas de Supabase
2. `SPECS.md` — especificaciones funcionales completas
3. `ARCHITECTURE.md` — arquitectura técnica y queries

---

## Tu tarea

Construí una aplicación React + Vite + TypeScript completa según las specs. Es un sitio de invitación digital para un baby shower de revelación de género.

### Scaffolding inicial
```bash
npm create vite@latest . -- --template react-ts
npm install @supabase/supabase-js react-router-dom
```

### Lo que tenés que crear

**1. Configuración base**
- `src/lib/supabase.ts` — cliente de Supabase con las env vars
- `src/types/index.ts` — interfaces TypeScript para `Confirmation`, `Gift`, `Contribution`
- `src/main.tsx` — con BrowserRouter
- `src/App.tsx` — con rutas `/` y `/admin`
- `src/index.css` — variables CSS globales (paleta, tipografías, reset)

**2. Página principal (`src/pages/Home.tsx`)**

Construí estas secciones en orden vertical, con scroll suave entre ellas:

**Hero:**
- Fondo con globos marrones animados flotando (CSS puro, múltiples globos con diferentes tamaños, posiciones y delays de animación)
- Signos "?" gigantes en degradado rosa (#F4A7B9) a azul (#89C4E1) como decoración
- Texto: "MUY PRONTO LLEGARÁ UNA TIERNA SONRISA PARA LLENAR DE AMOR NUESTRO HOGAR..."
- Tipografía serif grande, color crema (#F5EDE4)
- Scroll indicator animado

**Invitación:**
- Encabezado: "HOLA, FAMILIA Y AMIGOS"
- Cuerpo: "Hace meses vengo creciendo dentro de mi mami y alimentándome del amor de papi y queremos compartir contigo — ¡La revelación de mi género!"
- Firma: "Mis papitos Patricia y Alex te invitan a descubrirlo"
- Elemento visual: osito SVG simple integrado en la sección
- Fondo de la sección: marrón oscuro (#2d1f18)

**Info del evento:**
- Tres "cards" horizontales: Fecha (Domingo 24 de Mayo), Hora (14:00 a 17:00 hs), Lugar ([DIRECCIÓN A COMPLETAR])
- Iconos SVG minimalistas para cada card
- Diseño grande, espaciado generoso

**Formulario RSVP:**
- Campos: nombre completo (required), cantidad de personas (number, min 1, default 1), mensaje para los papás (textarea, opcional)
- Botón: "¡Confirmo mi asistencia!"
- Al submit: INSERT en tabla `confirmations` de Supabase
- Estados: loading (botón deshabilitado), success (mensaje animado "¡Nos vemos el 24! 🎉"), error (mensaje de error)
- Reset del formulario tras éxito

**Lista de regalos:**
- Título de sección
- Grid responsivo: 1 col mobile, 2 col tablet, 3 col desktop
- Cargar regalos desde Supabase al montar
- Dos tipos de tarjeta (ver SPECS.md):
  - `type === 'choose'`: mostrar botón "Elijo este regalo" si `is_chosen === false`. Al hacer click, abrir modal pidiendo nombre. Al confirmar: UPDATE en Supabase. Post-éxito: tarjeta muestra "Elegido por [nombre] ♥" y se deshabilita visualmente.
  - `type === 'contribute'`: mostrar barra de progreso (`contributed_amount / target_amount`), porcentaje, montos, y texto con alias de transferencia placeholder: "Para aportar, transferí al alias: **[ALIAS A COMPLETAR]**"

**3. Panel admin (`src/pages/Admin.tsx`)**
- Pantalla de login con input de contraseña. Comparar con `import.meta.env.VITE_ADMIN_PASSWORD`. Si es correcta, guardar en `sessionStorage('admin_auth', 'true')`.
- Si no está autenticado: mostrar solo el login
- Panel con dos tabs: "Confirmados" y "Regalos"

**Tab Confirmados:**
- Número total de personas confirmadas (suma de guests_count) destacado arriba
- Lista/tabla con: nombre, cantidad, mensaje, fecha formateada
- Ordenado por fecha descendente

**Tab Regalos:**
- Lista de todos los regalos
- Para `type === 'choose'`: mostrar estado (elegido/disponible), quién lo eligió, botón "Resetear" que setea is_chosen=false y chosen_by=null
- Para `type === 'contribute'`: barra de progreso + botón "Registrar aporte" que abre modal con campos: nombre del aportante, monto (number), nota (opcional). Al guardar: INSERT en contributions + UPDATE contributed_amount en gifts.
- Historial de aportes por regalo (collapsible o expandible)

**4. Diseño (CSS Modules)**
- Cada componente tiene su `.module.css`
- Usar las variables CSS del `index.css`
- Animaciones de globos flotando: `@keyframes float` con `translateY` en loop, cada globo con diferente `animation-duration` (entre 6s y 12s) y `animation-delay`
- Globos: formas con CSS (`border-radius`, sin imágenes externas), colores variando entre los marrones de la paleta
- Entrada de secciones: `IntersectionObserver` para agregar clase `visible` con transición `opacity + translateY`
- Barra de progreso: `@keyframes` de llenado al hacerse visible
- Responsive mobile-first

### Consideraciones importantes
- Todo en TypeScript estricto, sin `any`
- Manejar estados de loading y error en todos los llamados a Supabase
- Los globos del fondo deben tener perspectiva/profundidad: variar tamaños (algunos grandes y cercanos, otros pequeños y lejanos), variar opacidad
- El diseño debe sentirse "grande" — títulos que dominen la pantalla, mucho padding, secciones de altura completa o casi completa
- Mobile-first pero con atención al desktop
- Incluir un `README.md` con instrucciones de setup (env vars, Supabase schema, deploy en Vercel)
- Incluir el SQL del schema completo en `supabase/schema.sql`

### Placeholders para reemplazar luego
Usar estos textos exactos para que sea fácil encontrarlos con Ctrl+F:
- `[DIRECCIÓN A COMPLETAR]` — dirección del evento
- `[ALIAS A COMPLETAR]` — alias de transferencia bancaria

### Orden de construcción sugerido
1. Setup del proyecto y env vars
2. Cliente Supabase y types
3. CSS variables y estilos globales
4. Componente de globos animados (el más complejo visualmente)
5. Secciones de Home en orden
6. Panel Admin
7. README y schema SQL
