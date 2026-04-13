# SPECS.md — Especificaciones funcionales

## Página principal (/)

### Sección 1 — Hero / Portada
- Fondo animado con globos marrones con profundidad (CSS puro, sin canvas)
- Signos de pregunta gigantes mitad rosa mitad azul como elemento decorativo
- Texto principal: **"MUY PRONTO LLEGARÁ UNA TIERNA SONRISA PARA LLENAR DE AMOR NUESTRO HOGAR..."**
- Tipografía grande, moderna, con mucho aire
- Scroll suave hacia la siguiente sección

### Sección 2 — Invitación
- Texto: **"HOLA, FAMILIA Y AMIGOS"** como encabezado
- Cuerpo: *"Hace meses vengo creciendo dentro de mi mami y alimentándome del amor de papi y queremos compartir contigo — ¡La revelación de mi género!"*
- Firma: **"Mis papitos Patricia y Alex te invitan a descubrirlo"**
- Elemento decorativo: osito tierno integrado en el diseño (SVG o CSS art)

### Sección 3 — Info del evento
- Fecha: **Domingo 24 de Mayo**
- Horario: **14:00 a 17:00 hs**
- Dirección: **[DIRECCIÓN A COMPLETAR]** (placeholder visible, fácil de reemplazar)
- Diseño tipo "tarjeta" grande con iconos minimalistas para fecha, hora y lugar

### Sección 4 — Confirmación de asistencia
- Formulario con:
  - Campo: Nombre completo (requerido)
  - Campo: ¿Cuántos van? (número, mínimo 1)
  - Campo: Mensaje para los papás (opcional, textarea)
  - Botón: **"¡Confirmo mi asistencia!"**
- Al enviar: mensaje de éxito animado, sin recargar la página
- Guardar en tabla `confirmations` de Supabase
- Validación en frontend antes de enviar

### Sección 5 — Lista de regalos
- Título de sección elegante
- Grid de tarjetas de regalo (2 columnas en mobile, 3 en desktop)
- **Tipo "Elijo este regalo" (choose):**
  - Imagen del producto
  - Nombre y descripción
  - Link al producto (ícono externo)
  - Si no fue elegido: botón **"Elijo este regalo"** activo
  - Al hacer click: modal pidiendo nombre → confirmar → producto se tacha, muestra "Elegido por [nombre]", botón deshabilitado
  - Si ya fue elegido: tarjeta visualmente distinta (tachada/opaca), texto "Ya fue elegido ♥"
- **Tipo "Aporte" (contribute):**
  - Imagen del producto
  - Nombre, descripción y monto objetivo
  - Barra de progreso animada (filled según contributed_amount / target_amount)
  - Porcentaje y monto actual vs objetivo
  - Texto: "Para aportar, transferí al alias: **[ALIAS A COMPLETAR]**"
  - Sin botón de acción (el aporte lo registra el admin)

### Footer
- Nombres de los papás
- Frase de cierre tierna
- Posiblemente el osito de nuevo

---

## Panel Admin (/admin)

### Login
- Campo de contraseña simple
- Comparar con `VITE_ADMIN_PASSWORD`
- Si es correcta: guardar en sessionStorage, mostrar panel
- Si es incorrecta: mensaje de error
- Sin Supabase Auth

### Vista de confirmados
- Tabla o lista de todos los que confirmaron
- Columnas: Nombre, Cantidad de personas, Mensaje, Fecha
- Total de personas confirmadas destacado arriba
- Opción de exportar a CSV (opcional, nice to have)

### Vista de regalos
- Lista de todos los regalos
- **Para tipo "choose":** ver si fue elegido y por quién. Botón para resetear si hubo error.
- **Para tipo "contribute":** ver barra de progreso + botón **"Registrar aporte"** que abre un modal con:
  - Nombre del que aportó
  - Monto
  - Nota opcional
  - Al guardar: suma a `contributed_amount` del regalo y crea fila en `contributions`
- Ver historial de aportes por regalo

### Navegación admin
- Dos tabs: "Confirmados" y "Regalos"
- Botón de cerrar sesión (limpia sessionStorage)

---

## Diseño — Guía de estilo

### Paleta de colores
```
--color-bg: #1a0f0a           /* marrón muy oscuro, casi negro */
--color-surface: #2d1f18      /* marrón oscuro para tarjetas */
--color-surface-2: #3d2b22    /* marrón medio para hover */
--color-brown-light: #8B5E3C  /* marrón cálido */
--color-brown-warm: #C4956A   /* marrón dorado */
--color-accent-pink: #F4A7B9  /* rosa suave revelación */
--color-accent-blue: #89C4E1  /* celeste suave revelación */
--color-text: #F5EDE4          /* crema cálido */
--color-text-muted: #A08070   /* texto secundario */
```

### Tipografía
- Display/títulos: fuente serif elegante o script moderna (Google Fonts)
- Body: sans-serif limpia y moderna
- Tamaños grandes — los títulos deben dominar la pantalla

### Elementos visuales clave
- Globos marrones animados flotando en el fondo (CSS keyframes, múltiples capas de profundidad)
- Signos "?" en degradado rosa→azul como motivo decorativo recurrente
- Osito como mascota del sitio (SVG simple, puede ser CSS art)
- Ondas o separadores orgánicos entre secciones
- Mucho padding y espaciado — diseño "grande" y aireado

### Animaciones
- Globos flotando: translateY suave, infinito, con diferentes delays por globo
- Entrada de secciones: fade + slide up al hacer scroll (Intersection Observer)
- Barra de progreso: animación de llenado al entrar en viewport
- Botón "Elijo este regalo": micro-interacción al hover y al confirmar

### Responsive
- Mobile-first
- Breakpoints: 640px (sm), 1024px (lg)
- En mobile: todo a una columna, tipografía proporcionalmente grande
