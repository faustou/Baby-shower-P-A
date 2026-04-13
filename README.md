# Baby Shower — Patricia & Alex 🍼

Sitio de invitación digital para el baby shower de revelación de género de Patricia y Alex. Incluye confirmación de asistencia y lista de regalos interactiva.

## Stack

- **Frontend:** React 19 + Vite + TypeScript
- **Estilos:** CSS Modules (sin librerías de UI)
- **Base de datos:** Supabase (PostgreSQL + RLS)
- **Deploy:** Vercel

---

## Setup

### 1. Clonar e instalar

```bash
git clone <repo>
cd baby-shower
npm install
```

### 2. Variables de entorno

Crear un archivo `.env.local` en la raíz del proyecto:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_ADMIN_PASSWORD=tu_contraseña_secreta
```

> Ver `.env.local.example` como referencia.

### 3. Configurar Supabase

1. Crear un proyecto en [supabase.com](https://supabase.com)
2. Ir a **SQL Editor** y ejecutar el contenido de `supabase/schema.sql`
3. Copiar la **Project URL** y la **anon public key** desde *Project Settings → API*
4. Pegarlas en `.env.local`

### 4. Correr en desarrollo

```bash
npm run dev
```

---

## Placeholders para completar

Buscar con **Ctrl+F** y reemplazar antes del lanzamiento:

| Placeholder | Dónde reemplazar |
|---|---|
| `[DIRECCIÓN A COMPLETAR]` | `src/components/EventInfoSection.tsx` |
| `[ALIAS A COMPLETAR]` | `src/components/GiftCard.tsx` |

---

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Página pública — invitación completa |
| `/admin` | Panel privado — protegido por contraseña |

---

## Agregar regalos

Los regalos se cargan directamente en Supabase. Podés usar el **Table Editor** o ejecutar SQL:

```sql
-- Regalo tipo "elegir" (se tacha al elegirlo)
insert into gifts (name, description, price, type, product_url, display_order)
values ('Kit de baño', 'Tina + accesorios Johnsons', 25000, 'choose', 'https://...', 1);

-- Regalo tipo "aporte" (barra de progreso)
insert into gifts (name, description, type, target_amount, display_order)
values ('Cochecito', 'Travel system liviano', 'contribute', 250000, 2);
```

**Campos clave:**
- `type`: `'choose'` (se elige) o `'contribute'` (se aporta dinero)
- `target_amount`: monto objetivo en ARS para regalos tipo `contribute`
- `display_order`: orden de aparición en la grilla (menor = primero)
- `image_url`: URL pública de una imagen (puede ser de Supabase Storage)

---

## Deploy en Vercel

1. Conectar el repositorio en [vercel.com](https://vercel.com)
2. En **Settings → Environment Variables**, agregar las mismas 3 variables de `.env.local`
3. Deploy — Vercel detecta Vite automáticamente

---

## Estructura del proyecto

```
src/
├── components/
│   ├── FloatingBalloons.tsx    # Globos animados del fondo
│   ├── HeroSection.tsx         # Portada con signos "?"
│   ├── InvitationSection.tsx   # Texto de invitación + osito
│   ├── EventInfoSection.tsx    # Fecha, hora, lugar
│   ├── RSVPForm.tsx            # Formulario de confirmación
│   ├── GiftList.tsx            # Grid de regalos
│   ├── GiftCard.tsx            # Tarjeta individual de regalo
│   ├── ChooseGiftModal.tsx     # Modal para elegir regalo
│   ├── ProgressBar.tsx         # Barra de progreso animada
│   ├── ContributeModal.tsx     # Modal para registrar aporte (admin)
│   ├── BearSVG.tsx             # Osito mascota en SVG
│   └── Footer.tsx              # Pie de página
├── pages/
│   ├── Home.tsx                # Página principal
│   └── Admin.tsx               # Panel de administración
├── lib/
│   └── supabase.ts             # Cliente de Supabase
├── types/
│   └── index.ts                # Interfaces TypeScript
├── App.tsx                     # Router
├── main.tsx                    # Entry point
└── index.css                   # Variables CSS globales + reset
supabase/
└── schema.sql                  # Schema SQL completo
```
