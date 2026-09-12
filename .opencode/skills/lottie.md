# Lottie

## Objetivos
- Implementar animaciones Lottie de alta calidad y rendimiento
- Integrar Lottie con Vue 3 y Nuxt 3
- Optimizar la carga y reproducción de animaciones
- Mantener interactividad sin sacrificar rendimiento

## Best Practices
- Usar dotLottie format para mejor compresión y múltiples states
- Elegir renderizador según caso: SVG para calidad, Canvas para muchas animaciones, HTML para texto
- Cachear animaciones cargadas para evitar re-descargas
- Usar segmentos y markers para navegación precisa dentro de la animación
- Implementar lazy loading para animaciones fuera de viewport
- Usar `playSegments` para loops específicos en lugar de animaciones completas
- Respetar prefers-reduced-motion desactivando animaciones decorativas

## Anti-Patterns
- Cargar múltiples animaciones grandes en paralelo sin lazy loading
- Usar Lottie para animaciones simples que podrían ser CSS
- No optimizar archivos JSON/Lottie (remover features no usados)
- Ignorar el tamaño de archivo de las animaciones

## Errores Comunes
- No desmontar animaciones al destruir el componente (memory leaks)
- Usar renderizador SVG para animaciones con muchos elementos (usar Canvas)
- No manejar errores de carga de archivos Lottie
- Animaciones que no responden al scroll o interacción del usuario

## Checklist
- [ ] Formato optimizado (dotLottie o JSON comprimido)
- [ ] Renderizador adecuado para el caso de uso
- [ ] Lazy loading implementado
- [ ] prefers-reduced-motion respetado
- [ ] Cleanup en onUnmounted
- [ ] Animación probada en múltiples dispositivos
- [ ] Tamaño de archivo aceptable (< 500KB recomendado)

## Convenciones
- Nombrar archivos: `animacion-[nombre].json` o `animacion-[nombre].lottie`
- Centralizar configuración en un archivo de constantes
- Usar componentes Vue wrapper para cada animación Lottie

## Ejemplos
```typescript
// Ejemplo de componente Lottie con lazy loading
const { useLottie } = useLottieComposable()
const { play, stop, destroy } = useLottie(animationData, {
  renderer: 'canvas',
  loop: true,
  autoplay: false,
})
```

## Referencias Oficiales
- Lottie Web Player: https://airbnb.io/lottie/#/web
- dotLottie Player: https://dotlottie.io/
- LottieFiles: https://lottiefiles.com/
