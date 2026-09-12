# Motion (Framer Motion / Motion Vue)

## Objetivos
- Crear animaciones con variants, animate prop y layout animations
- Implementar AnimatePresence, gestures (drag, hover, tap) y shared layout animations
- Manejar SVG animations y accesibilidad con reduced motion

## Best Practices
- Usar `variants` para animaciones reutilizables y organizadas por estado visual
- Emplear `layoutId` en elementos que cambian de posición para shared layout animations fluidas
- Envolver animaciones de entrada/salida con `<AnimatePresence>` y usar `mode="popLayout"` para evitar saltos
- Respetar `prefers-reduced-motion` con `useReducedMotion` y desactivar animaciones complejas
- Preferir `whileHover`/`whileTap` sobre event handlers para gestos simples (más declarativo)

## Anti-Patterns
- Animar propiedades que no están en `will-change` (el navegador repinta innecesariamente)
- Usar `AnimatePresence` sin `key` único en children (las animaciones de salida no funcionan)
- Abusar de `drag` sin constraints (el elemento se sale del viewport)
- Poner `layout` en todos los elementos (causa layout thrashing en listas grandes)

## Errores Comunes
- Olvidar la prop `key` en elementos dentro de `AnimatePresence`
- Usar `initial={false}` en elementos que deben animarse en mount
- No definir `exit` variants cuando se usa `AnimatePresence` (la animación de salida no se ejecuta)
- Mezclar `animate` con `whileHover` (whileHover tiene prioridad, pero se solapan)

## Checklist
- [ ] ¿`AnimatePresence` tiene children con `key` único?
- [ ] ¿Los elementos animados tienen `exit` variant definida?
- [ ] ¿Se usa `useReducedMotion()` para respetar preferencias de accesibilidad?
- [ ] ¿Los elementos con `drag` tienen `dragConstraints` definidos?
- [ ] ¿`layout` se usa solo en elementos que realmente cambian de posición?

## Convenciones
- Variants: nombres en camelCase (`hidden`, `visible`, `exit`)
- Layout: usar `layoutId` compartido entre elementos que representan la misma entidad
- Gestures: `whileHover: { scale: 1.05 }`, `whileTap: { scale: 0.95 }`
- SVG: animar `pathLength`, `pathOffset`, `fill`, `stroke` con variants

## Ejemplos
```vue
<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-vue'
import { useReducedMotion } from 'motion-vue'

const prefersReduced = useReducedMotion()

const variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
}

const items = ref([1, 2, 3])

function removeItem(id: number) {
  items.value = items.value.filter(i => i !== id)
}
</script>

<template>
  <AnimatePresence mode="popLayout">
    <motion.div
      v-for="item in items"
      :key="item"
      :variants="!prefersReduced ? variants : {}"
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      whileHover="hover"
      @click="removeItem(item)"
      class="item"
    >
      {{ item }}
    </motion.div>
  </AnimatePresence>
</template>

<style scoped>
.item { cursor: pointer; padding: 1rem; background: #eee; margin: 0.5rem; }
</style>
```

## Referencias Oficiales
- Motion Vue Docs: https://motion-vue.vercel.app/
- Framer Motion Docs: https://www.framer.com/motion/
- AnimatePresence: https://www.framer.com/motion/animate-presence/
- Gestures: https://www.framer.com/motion/gestures/