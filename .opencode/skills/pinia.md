# Pinia

## Objetivos
- Crear stores usando setup syntax y options syntax según el caso de uso
- Implementar actions, getters, plugins y composables pattern con stores
- Manejar SSR, devtools, state hydration y tipado estricto

## Best Practices
- Preferir setup stores (`() =>`) sobre options stores para mejor composición y tipado
- Usar getters tipados con `state => state.valor` en lugar de funciones anónimas sin tipo
- Definir actions como funciones síncronas o asíncronas dentro del store (no usar `async` en options store fuera de actions)
- Utilizar `$reset()` solo en options stores; en setup stores implementar reset manual
- Emplear `storeToRefs()` para mantener reactividad al destructurar el store

## Anti-Patterns
- Destructurar el store directamente (`const { user, posts } = useUserStore()`): pierde reactividad
- Anidar watchers dentro de stores: los stores no deben tener lógica de efectos externos
- Mutar el estado directamente fuera de actions: rompe la trazabilidad y el devtools
- Usar Pinia sin `defineStore` o con múltiples stores con el mismo ID

## Errores Comunes
- Olvidar `storeToRefs()` al destructurar: el valor no se actualiza reactivamente
- Usar `actions` con arrow functions (pierden acceso a `this` en options stores)
- No tipar el estado inicial (TypeScript no infiere `null` como tipo de retorno)
- Llamar `useStore()` fuera de `setup()` o componentes (no funciona en SSR sin contexto)

## Checklist
- [ ] ¿El store usa `defineStore` con ID único y tipo definido?
- [ ] ¿Se usa `storeToRefs()` al destructurar el store?
- [ ] ¿Las actions mutan el estado solo a través de `this` (options) o asignación directa (setup)?
- [ ] ¿Los getters son funciones puras sin efectos secundarios?
- [ ] ¿El store es compatible con SSR (sin referencias al DOM)?

## Convenciones
- Naming: stores con prefijo `use` + nombre + `Store` (`useUserStore`)
- Archivos: un store por archivo en `stores/` con nombre kebab-case
- Setup stores: retornar `{ state, getters, actions }` explícitamente
- Plugins: archivos en `stores/plugins/` con función que recibe `context`

## Ejemplos
```typescript
// stores/counter.ts - Setup store
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const double = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  function $reset() {
    count.value = 0
  }

  return { count, double, increment, $reset }
})

// Component usage
import { useCounterStore, storeToRefs } from '~/stores/counter'
const store = useCounterStore()
const { count, double } = storeToRefs(store)
const { increment } = store
```

## Referencias Oficiales
- Getting Started: https://pinia.vuejs.org/getting-started.html
- Stores (Setup vs Options): https://pinia.vuejs.org/core-concepts/
- Plugins: https://pinia.vuejs.org/core-concepts/plugins
- SSR: https://pinia.vuejs.org/ssr/