# Accessibility Patterns

## Skip Links

```vue
<template>
  <header>
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <nav>...</nav>
  </header>
</template>

<style scoped>
.skip-link {
  position: absolute; top: -999px; left: 0; z-index: 999;
  padding: 8px 16px; background: var(--color-primary); color: white;
}
.skip-link:focus { top: 0; }
</style>
```

```vue
<template>
  <div>
    <AppHeader />
    <main id="main-content" tabindex="-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
```

## Focus Management

```vue
<script setup lang="ts">
const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()
const modalRef = ref<HTMLElement>()
const previousFocus = ref<HTMLElement>()

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    previousFocus.value = document.activeElement as HTMLElement
    nextTick(() => modalRef.value?.focus())
  } else {
    previousFocus.value?.focus()
  }
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
  if (e.key === 'Tab') trapTabKey(e)
}

function trapTabKey(e: KeyboardEvent) {
  const modal = modalRef.value
  if (!modal) return
  const focusable = modal.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault(); last?.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault(); first?.focus()
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="modal-overlay" role="dialog" aria-modal="true"
         :aria-label="title" @click.self="emit('close')">
      <div ref="modalRef" class="modal" tabindex="-1" @keydown="onKeydown">
        <slot />
      </div>
    </div>
  </Teleport>
</template>
```

## ARIA Live Regions

| Role | aria-live | Usage |
|------|-----------|-------|
| `alert` | `assertive` | Critical, time-sensitive (errors, confirmations) |
| `status` | `polite` | Non-critical status (loading, results count) |
| `log` | `polite` | Chat messages, activity logs |
| `timer` | `off` | Countdown timers (read on demand) |

```vue
<template>
  <div role="alert" aria-live="assertive" aria-atomic="true" :class="`toast toast--${type}`">
    {{ message }}
  </div>
</template>
```

## Form Errors

```vue
<script setup lang="ts">
interface Props { label: string; name: string; error?: string; hint?: string; required?: boolean }
const props = defineProps<Props>()
const errorId = computed(() => `${props.name}-error`)
const hintId = computed(() => `${props.name}-hint`)
</script>

<template>
  <div class="form-field" :class="{ 'form-field--error': error }">
    <label :for="name">{{ label }}<span v-if="required" aria-hidden="true">*</span></label>
    <input :id="name" :name="name" :aria-required="required"
      :aria-describedby="[hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ')"
      :aria-invalid="!!error" v-bind="$attrs" />
    <p v-if="hint" :id="hintId" class="hint">{{ hint }}</p>
    <p v-if="error" :id="errorId" class="error" role="alert">{{ error }}</p>
  </div>
</template>
```

## Navigation

```vue
<template>
  <nav aria-label="Main navigation">
    <button aria-expanded="menuOpen" aria-controls="main-menu" @click="menuOpen = !menuOpen">
      <span class="sr-only">{{ menuOpen ? 'Close menu' : 'Open menu' }}</span>
    </button>
    <ul id="main-menu" role="list" :class="{ 'menu--open': menuOpen }">
      <li v-for="item in items" :key="item.path">
        <NuxtLink :to="item.path" :aria-current="isCurrentPage(item) ? 'page' : undefined">
          {{ item.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
```

## Color Contrast

```scss
:root {
  --color-text-primary: #1a1a1a;     // on white: 14.5:1 (AAA)
  --color-text-secondary: #5a5a5a;   // on white: 4.6:1 (AA)
  --color-primary: #0055aa;          // on white: 4.8:1 (AA)
  --color-primary-text: #ffffff;     // on blue: 4.8:1 (AA)
}
```

## Checklist

- [ ] Skip link visible on focus
- [ ] Focus trap in modals (TAB cycle, Escape to close)
- [ ] Return focus on close
- [ ] `aria-live` for dynamic content (assertive for errors, polite for updates)
- [ ] `aria-describedby` connects inputs to errors/hints
- [ ] `aria-current="page"` for active nav item
- [ ] Color contrast ≥ 4.5:1 (AA) for normal text, ≥ 3:1 for large
- [ ] Touch targets ≥ 44x44px
- [ ] Keyboard navigation (Tab, Enter, Space, Arrow keys)
- [ ] Screen reader testing with NVDA/VoiceOver
