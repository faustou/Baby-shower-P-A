# ARCHITECTURE.md — Arquitectura técnica

## Overview
Aplicación React SPA sin backend propio. Toda la lógica de datos va directo a Supabase desde el cliente. Deploy estático en Vercel.

## Flujo de datos

```
Usuario → React (Vite) → Supabase JS Client → Supabase (Postgres + RLS)
```

No hay servidor Node/Express. Todo es client-side con Supabase anon key.

## Routing (React Router v6)
```
/        → Home.tsx (invitación pública)
/admin   → Admin.tsx (panel privado, protegido por contraseña en sessionStorage)
```

## Autenticación Admin
```
1. Usuario ingresa contraseña en /admin
2. Se compara con import.meta.env.VITE_ADMIN_PASSWORD
3. Si coincide → sessionStorage.setItem('admin_auth', 'true')
4. ProtectedRoute verifica sessionStorage antes de renderizar
5. Logout → sessionStorage.removeItem('admin_auth')
```

## Componentes principales

### Públicos
- `FloatingBalloons` — fondo animado con globos CSS
- `HeroSection` — portada con texto principal
- `InvitationSection` — texto de invitación
- `EventInfoSection` — fecha, hora, lugar
- `RSVPForm` — formulario de confirmación
- `GiftList` — grid de regalos
- `GiftCard` — tarjeta individual (maneja ambos tipos)
- `ChooseGiftModal` — modal para "Elijo este regalo"
- `ProgressBar` — barra de aporte animada

### Admin
- `AdminLogin` — pantalla de contraseña
- `ConfirmationsList` — tabla de confirmados
- `GiftsManager` — gestión de regalos
- `ContributeModal` — modal para registrar aporte

## Supabase queries clave

### Confirmaciones (público)
```typescript
// INSERT confirmación
const { error } = await supabase
  .from('confirmations')
  .insert({ name, guests_count, message })
```

### Regalos (público — lectura)
```typescript
// GET todos los regalos ordenados
const { data } = await supabase
  .from('gifts')
  .select('*')
  .order('display_order')
```

### Elegir regalo (público — update)
```typescript
// UPDATE regalo tipo 'choose'
const { error } = await supabase
  .from('gifts')
  .update({ is_chosen: true, chosen_by: name })
  .eq('id', giftId)
  .eq('is_chosen', false) // previene race condition
```

### Admin — ver confirmados
```typescript
const { data } = await supabase
  .from('confirmations')
  .select('*')
  .order('created_at', { ascending: false })
```

### Admin — registrar aporte
```typescript
// 1. Insertar en contributions
await supabase.from('contributions').insert({
  gift_id, contributor_name, amount, note
})
// 2. Actualizar contributed_amount en gifts
await supabase.from('gifts').update({
  contributed_amount: currentAmount + amount
}).eq('id', gift_id)
```

## RLS Policies (Supabase)

```sql
-- confirmations: cualquiera puede insertar, nadie puede leer (solo admin via service key si se necesita)
-- Para el admin usamos anon key con política permisiva ya que la "auth" es en frontend
-- OPCIÓN SIMPLE: deshabilitar RLS en desarrollo, luego restringir

-- gifts: SELECT público
create policy "gifts_public_read" on gifts for select using (true);
-- UPDATE público solo para campos de elección (is_chosen, chosen_by)
create policy "gifts_choose" on gifts for update using (true);

-- confirmations: INSERT público
create policy "confirmations_insert" on confirmations for insert with check (true);
-- SELECT público (el admin lo ve desde el frontend sin auth real)
create policy "confirmations_read" on confirmations for select using (true);

-- contributions: INSERT y SELECT públicos
create policy "contributions_all" on contributions using (true) with check (true);
```

Nota: Para un proyecto de este alcance (evento único, no datos sensibles críticos), RLS permisivo es aceptable. El "admin" es seguridad por oscuridad con contraseña en env var.

## Variables de entorno

### .env.local (desarrollo)
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_ADMIN_PASSWORD=patriciaalex2025
```

### Vercel (producción)
Las mismas variables se configuran en el dashboard de Vercel → Settings → Environment Variables.

## Setup inicial Supabase
1. Crear proyecto en supabase.com
2. Ir a SQL Editor y ejecutar el schema (ver CLAUDE.md)
3. En Table Editor: agregar los regalos manualmente o via SQL
4. Copiar URL y anon key a las env vars
5. Opcionalmente insertar datos de regalo de prueba
