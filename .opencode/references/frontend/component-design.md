# Component Design Patterns

## Presentational / Container

Separa presentación de lógica.

```vue
<!-- Container: lógica, estado, data fetching -->
<!-- components/feature/UserCardContainer.vue -->
<script setup lang="ts">
const props = defineProps<{ userId: string }>()
const { data: user, pending, error } = await useFetch(`/api/users/${props.userId}`)
const { canEdit } = useAuth()
</script>

<template>
  <UserCard
    v-if="user"
    :user="user"
    :loading="pending"
    :can-edit="canEdit"
    @edit="handleEdit"
  />
  <UiError v-else-if="error" :error="error" />
</template>
```

```vue
<!-- Presentational: solo props, events, slots -->
<!-- components/feature/UserCard.vue -->
<script setup lang="ts">
interface Props {
  user: User
  loading?: boolean
  canEdit?: boolean
}
const props = defineProps<Props>()
const emit = defineEmits<{
  edit: [userId: string]
  delete: [userId: string]
}>()
</script>

<template>
  <div :class="['card', { loading }]">
    <UiAvatar :src="user.avatar" :alt="user.name" />
    <h3>{{ user.name }}</h3>
    <p>{{ user.email }}</p>
    <slot name="actions">
      <BaseButton v-if="canEdit" @click="emit('edit', user.id)">
        Edit
      </BaseButton>
    </slot>
  </div>
</template>
```

## Composables

Lógica reusable sin componente.

```typescript
// composables/useForm.ts
interface UseFormOptions<T> {
  initial: T
  validate?: (values: T) => Partial<Record<keyof T, string>>
  onSubmit: (values: T) => Promise<void>
}

export function useForm<T extends Record<string, any>>(opts: UseFormOptions<T>) {
  const values = reactive({ ...opts.initial })
  const errors = reactive<Partial<Record<keyof T, string>>>({})
  const submitting = ref(false)
  const submitted = ref(false)

  function setField<K extends keyof T>(key: K, value: T[K]) {
    values[key] = value
    if (errors[key]) errors[key] = undefined
  }

  async function handleSubmit() {
    if (opts.validate) {
      const v = opts.validate(values)
      Object.assign(errors, v)
      if (Object.keys(v).length) return
    }
    submitting.value = true
    try {
      await opts.onSubmit(values)
      submitted.value = true
    } finally {
      submitting.value = false
    }
  }

  return { values, errors, submitting, submitted, setField, handleSubmit }
}

// Usage in component:
const { values, errors, submitting, setField, handleSubmit } = useForm({
  initial: { email: '', password: '' },
  validate: (v) => ({
    ...(!v.email && { email: 'Required' }),
    ...(!v.password && { password: 'Required' }),
  }),
  onSubmit: (v) => fetch('/api/login', { method: 'POST', body: v }),
})
```

## Slots Patterns

### Default slot

```vue
<!-- BaseCard.vue -->
<template>
  <div class="card">
    <slot />
  </div>
</template>
```

### Named slots

```vue
<!-- BaseModal.vue -->
<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal">
        <header><slot name="header" /></header>
        <main><slot /></main>
        <footer><slot name="footer" /></footer>
      </div>
    </div>
  </Teleport>
</template>

<!-- Usage -->
<BaseModal @close="show = false">
  <template #header>Confirm Delete</template>
  <p>Are you sure?</p>
  <template #footer>
    <BaseButton @click="show = false">Cancel</BaseButton>
    <BaseButton variant="danger" @click="confirm">Delete</BaseButton>
  </template>
</BaseModal>
```

### Scoped slots

```vue
<!-- DataTable.vue -->
<script setup lang="ts">
interface Props<T> {
  items: T[]
  columns: { key: string; label: string }[]
}
const props = defineProps<Props<any>>()
</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, i) in items" :key="i">
        <td v-for="col in columns" :key="col.key">
          <slot :name="`cell-${col.key}`" :item :value="item[col.key]">
            {{ item[col.key] }}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<!-- Usage -->
<DataTable :items="users" :columns="columns">
  <template #cell-status="{ item }">
    <UiBadge :variant="item.active ? 'success' : 'muted'">
      {{ item.active ? 'Active' : 'Inactive' }}
    </UiBadge>
  </template>
</DataTable>
```

## Renderless Components

Componentes sin template que proveen lógica via scoped slots.

```vue
<!-- RenderlessFetch.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ url: string }>()
const data = ref(null)
const error = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    data.value = await $fetch(props.url)
  } catch (e) {
    error.value = e
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <slot :data :error :loading />
</template>

<!-- Usage -->
<RenderlessFetch url="/api/users">
  <template #default="{ data, loading }">
    <div v-if="loading">Loading...</div>
    <UserList v-else :users="data" />
  </template>
</RenderlessFetch>
```

## Props & Events Naming

| Pattern | Example |
|---------|---------|
| **Props: camelCase** | `userName`, `isActive`, `onUpdate` |
| **Events: kebab-case en template** | `@update:user="handler"`, `@close` |
| **Event names: past tense** | `@clicked`, `@submitted`, `@closed` |
| **v-model** | `modelValue` + `@update:modelValue` |
| **v-model:name** | `name` + `@update:name` |
| **Boolean props** | `isLoading`, `hasError`, `showFooter` |

```vue
<script setup lang="ts">
// v-model
const model = defineModel<string>()

// v-model:name
const title = defineModel<string>('title')

// Regular props
const props = defineProps<{
  items: string[]
  isLoading?: boolean
}>()

// Events
const emit = defineEmits<{
  select: [id: string]
  'update:title': [value: string]
}>()
</script>
```

## Component Composition

```vue
<!-- Prefer composition over inheritance -->
<script setup lang="ts">
// Composable para lógica
const { user, isAdmin } = useAuth()

// Composable para UI state
const { open, openModal, closeModal } = useModal()

// Composable para data
const { data: posts, refresh } = await useFetch('/api/posts')
</script>

<template>
  <div>
    <BaseButton v-if="isAdmin" @click="openModal">New Post</BaseButton>
    <BaseModal :open="open" @close="closeModal">
      <PostForm @saved="refresh" />
    </BaseModal>
    <PostList :posts="posts" />
  </div>
</template>
```

## Key Rules

1. **Container components** para lógica, **presentational** para UI
2. **Composables** para lógica compartida entre componentes
3. **Slots** para personalización, no props de configuración
4. **v-model** para two-way binding estándar
5. **Event names** describen acción completada (`@clicked`, no `@click`)
6. **Renderless components** cuando necesitas lógica sin markup
7. **Prop drilling > 2 niveles** → Provide/Inject o Store
