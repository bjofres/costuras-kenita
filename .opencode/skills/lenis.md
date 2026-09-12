# Lenis

## Objetivos
- Implementar smooth scrolling horizontal y vertical con easing functions
- Integrar Lenis con GSAP ScrollTrigger para animaciones sincronizadas
- Configurar infinite scroll, touch/mouse wheel y modo Virtual Scroll
- Optimizar rendimiento usando raf en lugar de wheel events

## Best Practices
- Usar Lenis con `raf` (requestAnimationFrame) como modo principal para máximo rendimiento
- Integrar Lenis con GSAP mediante `lenis.on('scroll', ScrollTrigger.update)` para sincronización perfecta
- Configurar `easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))` para easing natural suave
- Ajustar `duration` según la sensación deseada: 1.0-1.2 para general, 1.5-2.0 para narrativo
- Destruir instancia Lenis con `lenis.destroy()` en cleanup de componentes SPA

## Anti-Patterns
- Usar Lenis con `wheelMultiplier > 2` sin testing en macOS (scroll acelerado puede resultar mareante)
- Ignorar el método `lenis.stop()` durante animaciones de ScrollTrigger scrub (causa saltos)
- Aplicar Lenis en páginas con overflow-x horizontal sin configurar `orientation: 'horizontal'`
- Mezclar Lenis con `overscroll-behavior: none` sin manejar el bounce en iOS (genera UX pobre)

## Errores Comunes
- No detener Lenis durante ScrollTrigger scrubs (doble control del scroll causa desincronización)
- Olvidar `lenis.destroy()` al desmontar el componente (la instancia sigue consumiendo RAF)
- Usar `lenis.scrollTo()` sin `{ immediate: false }` para animaciones suaves
- Confundir `direction: 'vertical'` (default) con orientación de escroll horizontal
- No actualizar `ScrollTrigger.refresh()` después de cambios dinámicos en el DOM

## Checklist
- [ ] ¿Lenis está sincronizado con GSAP via `ScrollTrigger.update()`?
- [ ] ¿`lenis.destroy()` se llama en `onUnmounted`?
- [ ] ¿El easing configurado produce un scroll natural?
- [ ] ¿`wheelMultiplier` está entre 1.0 y 1.5?
- [ ] ¿Lenis se pausa durante animaciones de ScrollTrigger con scrub?

## Convenciones
- Naming: instancia como `lenis` en minúsculas
- Config: definir en un composable `useSmoothScroll` reutilizable
- ScrollTrigger: integrar con `lenis.on('scroll', ScrollTrigger.update)` en el setup
- Virtual Scroll: activar solo cuando `touch` no es soportado nativamente

## Ejemplos
```typescript
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Setup con integración GSAP
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1.2,
  touchMultiplier: 1.5
})

// Sincronizar con GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update)

// RAF loop
function raf(time: number) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Pausar para scrubs de ScrollTrigger
ScrollTrigger.addEventListener('scrollStart', () => lenis.stop())
ScrollTrigger.addEventListener('scrollEnd', () => lenis.start())

// Navegación suave
function scrollToSection(id: string) {
  lenis.scrollTo(`#${id}`, { offset: -50, duration: 1.5, easing: (t) => t })
}

// Cleanup
onUnmounted(() => {
  lenis.destroy()
})
```

## Referencias Oficiales
- Lenis GitHub: https://github.com/studio-freight/lenis
- Lenis Docs: https://lenis.studiofreight.com/
- ScrollTrigger + Lenis: https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.update()