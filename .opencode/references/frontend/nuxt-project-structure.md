# Nuxt 3 Project Structure

## Core Directories

```
app/
├── pages/          # File-based routing (auto-imported)
├── layouts/        # Page layouts
├── components/     # Vue components (auto-imported)
├── composables/    # Shared logic (auto-imported)
├── middleware/     # Route middleware
├── plugins/        # Nuxt plugins
├── server/         # Nitro server engine
└── app.vue         # Root component
```

## Pages

Files map directly to routes. Each page is a Vue component.

```vue
<!-- app/pages/index.vue → / -->
<!-- app/pages/login.vue → /login -->
<!-- app/pages/users/index.vue → /users -->
<!-- app/pages/users/[id].vue → /users/:id -->
<!-- app/pages/users/[id]/edit.vue → /users/:id/edit -->
<!-- app/pages/dashboard/settings.vue → /dashboard/settings -->

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  title: 'User Profile',
})
const route = useRoute()
const { data: user } = await useFetch(`/api/users/${route.params.id}`)
</script>

<template>
  <div>
    <h1>{{ user.name }}</h1>
  </div>
</template>
```

### Naming Conventions

| Pattern | Route |
|---------|-------|
| `index.vue` | `/` |
| `[id].vue` | `/:id` |
| `[id]/edit.vue` | `/:id/edit` |
| `users-[role].vue` | `/users-:role()` |
| `category-[-slug-].vue` | `/category--slug--` |
| `[...slug].vue` | Catch-all `/slug` |

## Layouts

```vue
<!-- app/layouts/default.vue -->
<template>
  <div>
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
</template>

<!-- app/layouts/auth.vue → Minimal layout for login/register -->
<template>
  <div class="auth-layout">
    <slot />
  </div>
</template>

<!-- app/layouts/dashboard.vue → Sidebar + Topbar -->
<template>
  <div class="dashboard">
    <Sidebar />
    <main>
      <Topbar />
      <slot />
    </main>
  </div>
</template>
```

## Components

Auto-imported from `components/`. Nesting affects the import name.

```
components/
├── common/
│   ├── BaseButton.vue       → <BaseButton />
│   ├── BaseInput.vue        → <BaseInput />
│   └── BaseModal.vue        → <BaseModal />
├── feature/
│   ├── UserCard.vue         → <UserCard />
│   └── UserTable.vue        → <UserTable />
├── ui/
│   ├── UiBadge.vue          → <UiBadge />
│   └── UiAvatar.vue         → <UiAvatar />
└── form/
    ├── FormTextField.vue    → <FormTextField />
    └── FormSelect.vue       → <FormSelect />
```

### Naming Rules

1. **Multi-word names** para evitar conflictos con HTML (`Button.vue → BaseButton.vue`)
2. **Prefix por categoría**: `Base`, `Ui`, `Form`, `App`, `Feature`
3. **PascalCase** en nombres de archivo

## Composables

Auto-imported de `composables/`. Retornan reactive state.

```typescript
// app/composables/useAuth.ts
export const useAuth = () => {
  const user = ref<User | null>(null)
  const loading = ref(false)

  async function login(email: string, password: string) {
    loading.value = true
    try {
      const { data } = await $fetch('/api/auth/login', { method: 'POST', body: { email, password } })
      user.value = data
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    navigateTo('/login')
  }

  return { user, loading, login, logout }
}
```

```typescript
// app/composables/usePagination.ts
export const usePagination = (fetchFn: (page: number) => Promise<any>) => {
  const page = ref(1)
  const totalPages = ref(1)
  const items = ref<any[]>([])

  async function loadPage(p: number) {
    page.value = p
    const result = await fetchFn(p)
    items.value = result.data
    totalPages.value = result.totalPages
  }

  return { page, totalPages, items, loadPage }
}
```

## Middleware

```typescript
// app/middleware/auth.global.ts → runs on every route
export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth()
  if (!user.value && to.path !== '/login') {
    return navigateTo('/login')
  }
})
```

```typescript
// app/middleware/logging.ts
export default defineNuxtRouteMiddleware((to) => {
  console.log(`[${new Date().toISOString()}] → ${to.path}`)
})
```

## Plugins

```typescript
// app/plugins/pinia.ts
export default defineNuxtPlugin((nuxtApp) => {
  // Pinia is already auto-configured, but custom plugins:
  nuxtApp.$pinia.use(somePlugin)
})

// app/plugins/api.ts
export default defineNuxtPlugin(() => {
  const api = $fetch.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
    onRequest({ request, options }) {
      const { token } = useAuth()
      if (token.value) {
        options.headers.set('Authorization', `Bearer ${token.value}`)
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        navigateTo('/login')
      }
    },
  })

  return {
    provide: { api }
  }
})
```

## Server (Nitro)

```typescript
// app/server/api/users/index.ts → GET /api/users
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const users = await User.findMany({
    skip: (query.page - 1) * 20,
    take: 20,
  })
  return { data: users, total: await User.count() }
})

// app/server/api/users/[id].ts → GET /api/users/:id
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const user = await User.findById(id)
  if (!user) throw createError({ statusCode: 404 })
  return user
})
```

```typescript
// app/server/middleware/log.ts
export default defineEventHandler((event) => {
  console.log(`[${new Date().toISOString()}] ${event.method} ${event.path}`)
})
```

## Config

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      title: 'My App',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  pages: true,
  components: {
    dirs: [
      '~/components/common',
      '~/components/feature',
      '~/components/ui',
    ]
  },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxt/image'],
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || '/api'
    }
  }
})
```

## Key Rules

1. **Nunca importar manualmente** desde `~/components/` o `~/composables/` (ya auto-importados)
2. **Composables para lógica compartida**, no mixins
3. **Server routes solo para BFF/API proxies**, no para lógica de negocio pesada
4. **Layouts para estructura**, no para lógica
5. **Middleware para redirects/guards**, no para data fetching
6. **Plugins solo para configuración one-time** (libraries, interceptors)
