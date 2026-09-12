# GSAP

## Objetivos
- Construir timelines y tweens con easing, ScrollTrigger (scrub, pin, markers, toggleActions)
- Implementar motionPath, Flip plugin y Text plugin
- Optimizar rendimiento con will-change, force3D y cleanup de animaciones

## Best Practices
- Usar `gsap.timeline()` para secuencias complejas en lugar de múltiples tweens individuales
- Configurar `scrollTrigger: { scrub: true }` para animaciones ligadas al scroll con suavizado
- Activar `force3D: true` en propiedades de transform (translate, scale, rotate) para aceleración GPU
- Aplicar `will-change: transform, opacity` en elementos animados para evitar repaints
- Guardar referencia de timelines/animaciones y llamar `.kill()` en cleanup (onUnmounted)

## Anti-Patterns
- Animar propiedades que causan layout (width, height, top, left): usar transform (x, y, scale) en su lugar
- Usar ScrollTrigger sin `markers: false` en producción (los markers son solo debug)
- Crear tweens sin cleanup en componentes SPA: las animaciones continúan incluso si el componente se destruye
- Animar múltiples propiedades en un solo tween cuando deben tener easings diferentes (usar timeline)

## Errores Comunes
- Olvidar importar ScrollTrigger (`gsap.registerPlugin(ScrollTrigger)`)
- No sincronizar scrubs con pinned sections (el pin interfiere con el diseño de scroll)
- Usar `fromTo` sin valores iniciales explícitos (comportamiento inesperado)
- Depender de elementos que cambian dinámicamente (animar antes de que existan en el DOM)

## Checklist
- [ ] ¿ScrollTrigger está registrado con `gsap.registerPlugin(ScrollTrigger)`?
- [ ] ¿Las animaciones tienen cleanup con `.kill()` en onUnmounted?
- [ ] ¿Se usa `transform` en lugar de propiedades de layout (width/height/top)?
- [ ] ¿`force3D: true` está activado en tweens de transform?
- [ ] ¿Los markers de ScrollTrigger están desactivados en producción?

## Convenciones
- Naming: variables de timeline con prefijo `tl` (`tlHero`, `tlGallery`)
- Plugins: registrar al inicio del archivo o en un plugin global
- Easing: usar `"power2.out"` por defecto, `"none"` para lineales
- ScrollTrigger: definir `id` único para debuggear

## Ejemplos
```typescript
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Timeline con scroll trigger
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.section',
    start: 'top center',
    end: 'bottom top',
    scrub: 2,
    toggleActions: 'play none none reverse',
    markers: false,
    pin: true
  }
})

tl.fromTo('.element', 
  { x: -100, opacity: 0, scale: 0.8 },
  { x: 0, opacity: 1, scale: 1, duration: 1, ease: 'power2.out', force3D: true }
)
 .to('.element', { rotation: 360, duration: 2, ease: 'none' })

// Cleanup
onUnmounted(() => {
  tl.kill()
  ScrollTrigger.getAll().forEach(st => st.kill())
})
```

## Referencias Oficiales
- GSAP Docs: https://gsap.com/docs/v3/
- ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- Performance: https://gsap.com/resources/performance/
- Flip Plugin: https://gsap.com/docs/v3/Plugins/Flip/