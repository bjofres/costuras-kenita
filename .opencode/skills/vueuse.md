# VueUse

## Objetivos
- Utilizar composables core (useMouse, useWindowScroll, useLocalStorage, useDark, etc.)
- Garantizar SSR compatibility y tree-shaking en imports
- Crear composables personalizados y extender VueUse con integración Nuxt

## Best Practices
- Importar solo los composables necesarios para mantener el bundle pequeño (VueUse es tree-shakeable)
- Usar `@vueuse/core` en proyectos Vue y `@vueuse/nuxt` para integración con Nuxt
- Preferir `useLocalStorage` / `useSessionStorage` sobre localStorage API nativa (serialización reactiva automática)
- Combinar `useDebounceFn` o `useThrottleFn` con eventos de scroll/resize para rendimiento
- Utilizar `useEventListener` en lugar de `addEventListener` manual (cleanup automático en onUnmounted)

## Anti-Patterns
- Importar VueUse entero (`import { useMouse } from '@vueuse/core'` está bien, pero evitar `import *`)
- Usar `useStorage` sin `watch: true` (por defecto no sincroniza cambios externos)
- Llamar composables que dependen del DOM (useMouse, useWindowSize) fuera del setup de un componente
- Mezclar `useAsyncState` con lógica de caché manual cuando `useFetch` de Nuxt es más adecuado

## Errores Comunes
- Olvidar que `useLocalStorage` lanza error si localStorage no está disponible (entornos SSR/privacy mode)
- No pasar `{ shallow: true }` a `useStorage` para objetos grandes (serialización JSON costosa)
- Usar `useDraggable` sin constraints (se sale del viewport)
- Confundir `useInterval` (callback) con `useTimestamp` (ref reactiva)

## Checklist
- [ ] ¿Solo se importan los composables específicos necesarios?
- [ ] ¿Los composables con dependencias DOM se usan dentro de `onMounted` si hay SSR?
- [ ] ¿`useStorage` tiene `{ shallow: true }` para objetos grandes?
- [ ] ¿Los event listeners usan `useEventListener` en lugar de addEventListener manual?
- [ ] ¿En Nuxt se usa `@vueuse/nuxt` y no `@vueuse/core` directamente?

## Convenciones
- Naming: todos los composables VueUse inician con `use` (convención de Vue)
- Archivos: crear composables personalizados en `composables/` con prefijo `use`
- SSR: envolver llamadas a composables DOM en `if (process.client)` o dentro de `onMounted`
- Nuxt: agregar `@vueuse/nuxt` a `modules` en nuxt.config (auto-importa composables)

## Ejemplos
```typescript
import { useLocalStorage, useDark, useToggle, useMouse, useEventListener } from '@vueuse/core'

// Tema oscuro persistente
const isDark = useDark()
const toggleDark = useToggle(isDark)

// Mouse tracking
const { x, y } = useMouse()

// localStorage reactivo
const preferences = useLocalStorage('preferences', { theme: 'light' }, { shallow: true })

// Event listener con cleanup automático
useEventListener(window, 'resize', () => {
  console.log('resize', window.innerWidth)
})
```

## Referencias Oficiales
- Functions Overview: https://vueuse.org/functions.html
- Nuxt Integration: https://vueuse.org/guide/nuxt
- Best Practices: https://vueuse.org/guide/best-practice