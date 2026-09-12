# Motion Design System

## Design Tokens

```scss
// Duration tokens
:root {
  --duration-instant: 0ms;
  --duration-fast: 150ms;    // Micro-interactions, hover states
  --duration-normal: 250ms;  // Transitions, modals
  --duration-slow: 400ms;    // Page transitions
  --duration-glacial: 700ms; // Emphasis, hero animations
}
```

```scss
// Easing tokens
:root {
  --ease-linear: linear;

  // Standard (for moving elements)
  --ease-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
  --ease-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1); // Entering
  --ease-accelerate: cubic-bezier(0.4, 0.0, 1.0, 1); // Exiting

  // Emphasis (for large, expressive motion)
  --ease-emphasis: cubic-bezier(0.2, 0.0, 0.0, 1.0);
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275); // Overshoot
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.27, 1.55);
}
```

```scss
// Delay tokens
:root {
  --delay-none: 0ms;
  --delay-short: 50ms;
  --delay-medium: 100ms;
  --delay-long: 200ms;
  --delay-stagger: 80ms; // For staggered children animations
}
```

## CSS Utility Classes

```scss
// Enter animations
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(24px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

// Exit animations (shorter duration)
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes slideDown {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(16px); }
}

// Utility classes
.animate-fade-in { animation: fadeIn var(--duration-normal) var(--ease-standard); }
.animate-slide-up { animation: slideUp var(--duration-normal) var(--ease-decelerate); }
.animate-slide-in-right { animation: slideInRight var(--duration-normal) var(--ease-decelerate); }
.animate-scale-in { animation: scaleIn var(--duration-fast) var(--ease-spring); }
.animate-fade-out { animation: fadeOut var(--duration-fast) var(--ease-accelerate) forwards; }
.animate-slide-down { animation: slideDown var(--duration-fast) var(--ease-accelerate) forwards; }
```

## Micro-interactions

### Button Hover

```vue
<script setup lang="ts">
const hovered = ref(false)
</script>

<template>
  <button
    class="btn"
    :class="{ 'btn--hovered': hovered }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  transition:
    transform var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard);
}

.btn--hovered {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.btn:active {
  transform: translateY(0);
  transition-duration: var(--duration-instant);
}
</style>
```

### Input Focus

```vue
<style scoped>
.input {
  border: 2px solid var(--color-border);
  transition:
    border-color var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard);
}

.input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0,85,170,0.15);
  outline: none;
}
</style>
```

### Loading Spinner

```vue
<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  width: 24px; height: 24px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin var(--duration-slow) var(--ease-linear) infinite;
}
</style>
```

## Page Transitions

```vue
<!-- app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage :transition="{
      name: 'page',
      mode: 'out-in',
      onBeforeEnter: () => window.scrollTo(0, 0),
    }" />
  </NuxtLayout>
</template>

<style>
.page-enter-active {
  animation: slideUp var(--duration-slow) var(--ease-decelerate);
}
.page-leave-active {
  animation: slideDown var(--duration-normal) var(--ease-accelerate);
}
</style>
```

```vue
<!-- Layout transitions -->
<template>
  <div>
    <header>...</header>
    <main>
      <slot />
    </main>
  </div>
</template>

<style>
/* Shared element transitions */
.layout-enter-active .sidebar { animation: slideInRight var(--duration-normal) var(--ease-decelerate); }
</style>
```

## Staggered List Animations

```vue
<script setup lang="ts">
interface Props { items: any[]; entering?: boolean }
const props = defineProps<{ items: any[] }>()
</script>

<template>
  <ul class="stagger-list">
    <li v-for="(item, i) in items" :key="item.id"
        :style="{ animationDelay: `${i * 80}ms` }">
      {{ item.name }}
    </li>
  </ul>
</template>

<style scoped>
.stagger-list > li {
  opacity: 0;
  animation: slideUp var(--duration-normal) var(--ease-decelerate) forwards;
}
</style>
```

## Vue Transition Components

```vue
<!-- components/common/FadeTransition.vue -->
<template>
  <Transition name="fade" mode="out-in" v-bind="$attrs">
    <slot />
  </Transition>
</template>

<style>
.fade-enter-active { transition: opacity var(--duration-normal) var(--ease-standard); }
.fade-leave-active { transition: opacity var(--duration-fast) var(--ease-standard); }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
```

```vue
<!-- components/common/SlideTransition.vue -->
<template>
  <Transition name="slide" v-bind="$attrs">
    <slot />
  </Transition>
</template>

<style>
.slide-enter-active { transition: all var(--duration-normal) var(--ease-decelerate); }
.slide-leave-active { transition: all var(--duration-fast) var(--ease-accelerate); }
.slide-enter-from { opacity: 0; transform: translateX(16px); }
.slide-leave-to { opacity: 0; transform: translateX(-16px); }
</style>
```

```vue
<!-- Usage -->
<FadeTransition>
  <p v-if="show">This fades in/out</p>
</FadeTransition>

<SlideTransition>
  <div v-if="notifications.length" class="notification">
    {{ notifications[0].message }}
  </div>
</SlideTransition>
```

## Scroll Animations

```vue
<!-- composables/useScrollReveal.ts -->
export function useScrollReveal(options = { threshold: 0.2 }) {
  const el = ref<HTMLElement>()
  const isVisible = ref(false)

  onMounted(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true
        observer.unobserve(entry.target)
      }
    }, options)

    if (el.value) observer.observe(el.value)
    onUnmounted(() => observer.disconnect())
  })

  return { el, isVisible }
}
```

```vue
<script setup lang="ts">
const { el, isVisible } = useScrollReveal()
</script>

<template>
  <div ref="el" :class="{ 'is-visible': isVisible }" class="reveal">
    <slot />
  </div>
</template>

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: all var(--duration-slow) var(--ease-decelerate);
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
```

## Consistency Rules

1. **Same easing for same type** - All enters: decelerate, all exits: accelerate
2. **Duration proportional to distance** - Small moves: fast, big moves: slow
3. **Don't animate everything** - Only state changes, hovers, and enters
4. **Prefers-reduced-motion** - Respect user preference:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

5. **Motion debugging** - Use `paused` state for design review:

```css
.debug-motion * { animation-play-state: paused !important; }
```
