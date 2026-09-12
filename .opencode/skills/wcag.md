# WCAG Accessibility

## Objetivos
- Cumplir WCAG 2.2 niveles A y AA usando POUR (Perceivable, Operable, Understandable, Robust)
- Implementar ARIA roles, estados y propiedades correctamente
- Garantizar navegación por teclado, contraste 4.5:1 y etiquetas semánticas

## Best Practices
- Usar HTML semántico (nav, main, button, heading h1-h6) antes que ARIA
- Asegurar contraste de color mínimo 4.5:1 para texto normal y 3:1 para texto grande
- Proporcionar texto alternativo (alt) descriptivo en todas las imágenes informativas
- Soportar navegación completa por teclado con focus visible en todos los elementos interactivos
- Usar aria-label y aria-describedby solo cuando el HTML semántico no sea suficiente

## Anti-Patterns
- ARIA Overuse: usar ARIA en lugar de HTML semántico nativo duplica esfuerzo y es frágil
- Eliminar outline: focus visible es obligatorio; nunca poner outline: none sin alternativa
- Contraste insuficiente: texto gris sobre fondo gris (#999 sobre #fff no pasa 4.5:1)

## Errores Comunes
- No etiquetar formularios (olvidar <label> o aria-label en inputs)
- Modales y diálogos sin gestión de foco (no atrapar foco, no cerrar con Escape)
- Mensajes de error sin role="alert" o aria-live que no son anunciados por lectores de pantalla

## Checklist
- [ ] Verificar contraste 4.5:1 con axe DevTools o WAVE
- [ ] Navegar toda la app solo con teclado (Tab, Enter, Escape, flechas)
- [ ] Probar con NVDA o VoiceOver en las pantallas principales
- [ ] Añadir alt text descriptivo en imágenes informativas
- [ ] Validar heading hierarchy (h1 único, sin saltos de nivel)

## Convenciones
- Componentes botón usan <button> nativo, no <div> con role="button" sin necesidad
- Formularios con <label> explícito y aria-describedby para ayudas
- Modales con focus trap y aria-modal="true", foco inicial en el primer elemento interactivo

## Ejemplos
```vue
<!-- Modal accesible -->
<template>
  <Teleport to="body">
    <div
      v-if="visible"
      role="dialog"
      aria-modal="true"
      :aria-label="title"
      @keydown.escape="close"
      ref="modal"
      tabindex="-1"
    >
      <div class="modal-backdrop" @click="close" />
      <div class="modal-content">
        <h2 id="modal-title">{{ title }}</h2>
        <slot />
        <button @click="close" aria-label="Cerrar modal">X</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';

const props = defineProps<{ visible: boolean; title: string }>();
const emit = defineEmits<{ close: [] }>();
const modal = ref<HTMLElement>();

watch(() => props.visible, async (val) => {
  if (val) {
    await nextTick();
    modal.value?.focus();
  }
});

function close() { emit('close'); }
</script>
```

## Referencias Oficiales
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/
- axe DevTools: https://www.deque.com/axe/
