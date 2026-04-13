# CLAUDE.md — Baby Shower Invitation App

## Descripción del proyecto
Sitio web de invitación digital para un baby shower de revelación de género. Los invitados pueden ver la info del evento, confirmar asistencia y participar en una lista de regalos. Los papás tienen un panel privado para ver confirmados y gestionar aportes.

## Stack
- **Frontend:** React + Vite + TypeScript
- **Estilos:** CSS Modules con CSS puro (sin librerías de UI)
- **DB/Auth:** Supabase (JS client directo, sin backend)
- **Deploy:** Vercel
- **Routing:** React Router v6

## Estructura del proyecto
```
src/
  components/        # Componentes reutilizables
  pages/
    Home.tsx         # Página principal (invitación completa)
    Admin.tsx        # Panel privado de los papás
  lib/
    supabase.ts      # Cliente de Supabase
  styles/            # CSS Modules por componente
  types/             # TypeScript interfaces
```

## Variables de entorno
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_ADMIN_PASSWORD=    # Contraseña simple para /admin
```

## Supabase — Tablas requeridas

### confirmations
```sql
id uuid primary key default gen_random_uuid()
created_at timestamptz default now()
name text not null
guests_count integer not null default 1
message text
```

### gifts
```sql
id uuid primary key default gen_random_uuid()
name text not null
description text
price integer                  -- en pesos ARS, null si es tipo "elijo"
type text not null             -- 'choose' | 'contribute'
product_url text               -- solo para type='choose'
image_url text
is_chosen boolean default false
chosen_by text                 -- nombre del que eligió
contributed_amount integer default 0   -- solo para type='contribute'
target_amount integer          -- monto objetivo para type='contribute'
display_order integer default 0
```

### contributions
```sql
id uuid primary key default gen_random_uuid()
created_at timestamptz default now()
gift_id uuid references gifts(id)
contributor_name text
amount integer not null
note text
```

## RLS (Row Level Security)
- `confirmations`: INSERT público, SELECT solo autenticado (usamos contraseña en frontend)
- `gifts`: SELECT público, UPDATE solo autenticado
- `contributions`: INSERT público (para "elijo este regalo"), SELECT/UPDATE solo autenticado

Nota: La "autenticación" del admin es una contraseña simple en frontend comparada con VITE_ADMIN_PASSWORD. No usar Supabase Auth.

## Comandos
```bash
npm run dev
npm run build
npm run preview
```
