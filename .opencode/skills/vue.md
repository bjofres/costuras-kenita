# Vue 3

## Objetivos
- Dominar la Composition API con `<script setup>` y reactividad (ref/reactive/computed/watch)
- Implementar ciclos de vida, slots, Teleport, Suspense y provide/inject
- Optimizar rendimiento con v-memo, shallowRef y error boundaries

## Best Practices
- Usar `<script setup>` como estándar para todos los componentes
- Preferir `ref()` para valores primitivos y `reactive()` solo para objetos planos
- Utilizar `computed()` para valores derivados y `watch()` con `deep: true` solo cuando sea necesario
- Emplear `defineProps` / `defineEmits` con tipos TypeScript estrictos
- Mantener los efectos secundarios dentro de `onMounted` y `onUnmounted` con cleanup

## Anti-Patterns
- Mutar props directamente: viola el flujo unidireccional de datos, usar emit siempre
- Reactividad profunda innecesaria: `reactive()` sobre objetos grandes genera proxies costosos, preferir `shallowRef`
- Abusar de `watch`: muchos watchers pueden degradar rendimiento, preferir computed cuando sea derivación síncrona
- Mezclar Options API con Composition API en el mismo componente: genera confusión y duplicación

## Errores Comunes
- Olvidar desempaquetar `.value` en templates usando ref (aunque en `<script setup>` no es necesario)
- Usar `reactive` con primitivos (no es reactivo, usar `ref`)
- Perder reactividad al destructurar `reactive()` o un store de Pinia
- No limpiar event listeners o timers en `onUnmounted`

## Checklist
- [ ] ¿Se usa `<script setup lang="ts">` en todos los componentes?
- [ ] ¿Los `props` tienen tipos definidos con `defineProps`?
- [ ] ¿Los watchers y effects tienen cleanup en `onUnmounted`?
- [ ] ¿Se evita la mutación directa de props?
- [ ] ¿Se usa `shallowRef` para datos grandes o anidados?

## Convenciones
- Naming: componentes en PascalCase, archivos kebab-case
- Organización: primero script, luego template, último style scoped
- Eventos: emitir siempre con kebab-case (`update:model-value`)
- Provide/Inject: usar Symbols como claves para evitar colisiones

## Ejemplos
```vue
<script setup lang="ts">
import { ref, computed, shallowRef, onMounted, onUnmounted } from 'vue'

const count = ref(0)
const bigData = shallowRef([])
const double = computed(() => count.value * 2)

defineProps<{ title: string }>()
defineEmits<{ 'update:count': [value: number] }>()

const interval = setInterval(() => count.value++, 1000)
onMounted(() => fetchData())
onUnmounted(() => clearInterval(interval))
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <p>{{ double }}</p>
  </div>
</template>
```

## Referencias Oficiales
- Composition API: https://vuejs.org/guide/extras/composition-api-faq
- Reactivity Fundamentals: https://vuejs.org/guide/essentials/reactivity-fundamentals
- Performance: https://vuejs.org/guide/best-practices/performance