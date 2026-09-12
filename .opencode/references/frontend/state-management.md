# State Management with Pinia

## When to Use What

| Approach | When to Use | Example |
|----------|------------|---------|
| **Local ref/reactive** | State within single component | Form input values, toggle visibility |
| **Composable** | Logic reused across components, no persistence needed | `useAuth()`, `usePagination()` |
| **Props/Events** | Parent-child communication | Passing data to presentational components |
| **Provide/Inject** | Deep prop drilling (3+ levels) | Theme configuration, current user |
| **Pinia Store** | Global state, server state cache, cross-feature data | Auth token, user preferences, cart |
| **Async State (useAsyncData)** | Server-side fetched data in Nuxt | Page data, initial props |

## Pinia Store Patterns

### Option Store (clásico)

```typescript
// stores/user.ts
export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    currentUserId: null as string | null,
    loading: false,
  }),

  getters: {
    currentUser: (state) =>
      state.users.find((u) => u.id === state.currentUserId),
    userCount: (state) => state.users.length,
    activeUsers: (state) => state.users.filter((u) => u.isActive),
  },

  actions: {
    async fetchUsers() {
      this.loading = true
      try {
        const { data } = await $fetch('/api/users')
        this.users = data
      } finally {
        this.loading = false
      }
    },

    async deleteUser(id: string) {
      await $fetch(`/api/users/${id}`, { method: 'DELETE' })
      this.users = this.users.filter((u) => u.id !== id)
    },

    selectUser(id: string) {
      this.currentUserId = id
    },
  },
})
```

### Setup Store (composition API)

```typescript
// stores/auth.ts
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(useCookie('auth-token').value || null)
  const loading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // Actions
  async function login(email: string, password: string) {
    loading.value = true
    try {
      const { token: newToken, user: userData } = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      token.value = newToken
      user.value = userData
      useCookie('auth-token').value = newToken
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    token.value = null
    user.value = null
    useCookie('auth-token').value = null
    navigateTo('/login')
  }

  return { user, token, loading, isAuthenticated, isAdmin, login, logout }
})
```

## Composable vs Store

```typescript
// ✅ Usa composable: lógica reusable sin estado global
export function useDebounce<T>(fn: (args: T) => void, delay = 300) {
  const timeout = ref<ReturnType<typeof setTimeout>>()
  return (args: T) => {
    clearTimeout(timeout.value)
    timeout.value = setTimeout(() => fn(args), delay)
  }
}

// ✅ Usa store: estado compartido entre features
export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const total = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0))
  function addItem(item: CartItem) { items.value.push(item) }
  function removeItem(id: string) { items.value = items.value.filter((i) => i.id !== id) }
  return { items, total, addItem, removeItem }
})

// ❌ No hagas: store con estado de un solo componente
export const useFormStore = defineStore('loginForm', () => {
  const email = ref('')
  const password = ref('')
  return { email, password }
})
// ✅ Mejor: local refs en el componente
const email = ref(''); const password = ref('')
```

## SSR Considerations

```typescript
// stores/counter.ts
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)

  // ❌ No: hydration mismatch
  const random = ref(Math.random())

  // ✅ Sí: lazy initialization
  const random = shallowRef(0)
  onMounted(() => { random.value = Math.random() })

  function increment() {
    count.value++
  }

  return { count, random, increment }
})
```

```typescript
// En pages, usar useAsyncData + store para SSR
const store = useUserStore()

// ✅ SSR-safe: data fetched en server, disponible en cliente
const { data } = await useAsyncData('users', () => $fetch('/api/users'))
store.users = data.value ?? []

// ❌ Peligro: store action que llama API en setup
store.fetchUsers() // Se ejecuta en server y cliente → doble fetch
```

## Data Caching

```typescript
// stores/posts.ts
export const usePostStore = defineStore('posts', () => {
  const posts = ref<Post[]>([])
  const lastFetched = ref<number>(0)
  const CACHE_TTL = 60_000 // 1 minute

  async function fetchPosts(force = false) {
    if (!force && Date.now() - lastFetched.value < CACHE_TTL) return
    const { data } = await $fetch('/api/posts')
    posts.value = data
    lastFetched.value = Date.now()
  }

  // Invalidation
  function invalidate() {
    lastFetched.value = 0
  }

  return { posts, fetchPosts, invalidate }
})
```

## Store-to-Store Communication

```typescript
// stores/cart.ts
export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  async function checkout() {
    const auth = useAuthStore()
    if (!auth.isAuthenticated) throw new Error('Login required')

    const order = useOrderStore()
    await order.create(items.value)

    items.value = []
  }

  return { items, checkout }
})
```

## Plugins

```typescript
// plugins/pinia-persist.ts
export default defineNuxtPlugin(({ $pinia }) => {
  $pinia.use(({ store }) => {
    // Hydrate from localStorage
    const saved = localStorage.getItem(store.$id)
    if (saved) store.$patch(JSON.parse(saved))

    // Persist on change
    store.$subscribe((_, state) => {
      localStorage.setItem(store.$id, JSON.stringify(state))
    })
  })
})
```

## Patterns Summary

| Pattern | State Scope | Testability | SSR Safe | Use Case |
|---------|------------|-------------|----------|----------|
| `ref()` | Component | Easy | Yes | Form fields, toggles |
| Composable | Reused logic | Easy | Yes | Debounce, validation |
| Option Store | Global | Medium | With care | CRUD data |
| Setup Store | Global | Medium | With care | Complex state |
| `useAsyncData` | Page/Component | Hard | Yes | Server data |
| Cookie | Cross-request | Hard | Yes | Auth tokens |
