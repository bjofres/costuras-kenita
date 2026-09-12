# Performance

## Objetivos
- Optimizar Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1
- Reducir bundle size con tree-shaking, code splitting y dynamic imports
- Implementar caching efectivo (service worker, CDN, HTTP cache) para recargas instantáneas

## Best Practices
- Preload recursos críticos (fuentes, hero images, LCP element) con <link rel="preload">
- Optimizar imágenes a WebP/AVIF, usar srcset para responsive y lazy loading con loading="lazy"
- Code splitting por rutas y componentes pesados con lazy() + Suspense
- Configurar HTTP cache con Cache-Control (inmutable para hashed assets) y ETag
- Establecer performance budgets en Lighthouse CI para evitar regresiones

## Anti-Patterns
- Cargar todo el bundle JS en la primera paint: dividir por rutas y componentes
- Imágenes sin dimensiones explícitas (sin width/height) causan CLS elevado
- Usar librerías enteras por una función: importar solo lo necesario (tree-shaking)

## Errores Comunes
- Font-display: block por defecto bloquea el texto; usar font-display: swap
- No comprimir assets en producción (Brotli > Gzip en tamaño y velocidad)
- Ignorar long tasks (> 50ms) en el hilo principal: descomponer con setTimeout o scheduler.yield

## Checklist
- [ ] LCP: preload elemento LCP, optimizar imagen, servidor rápido (TTFB < 800ms)
- [ ] INP: debounce event handlers, code splitting, evitar long tasks
- [ ] CLS: width/height explícito en imágenes, font-display: swap, evitar inyección tardía de DOM
- [ ] Imágenes en WebP/AVIF con srcset y lazy loading
- [ ] Performance budgets configurados en CI

## Convenciones
- Webpack/Rollup/Vite config con splitChunks para vendors y common chunks
- Service worker con Workbox para precaching de assets críticos
- Logging de Web Vitals en producción con web-vitals library para monitoreo

## Ejemplos
```typescript
// Dynamic import + preload
const HeavyChart = defineAsyncComponent(() => import('./HeavyChart.vue'));

// En vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          ui: ['@headlessui/vue', '@heroicons/vue'],
        },
      },
    },
  },
});

// Service worker con Workbox
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST);
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new StaleWhileRevalidate()
);
```

## Referencias Oficiales
- Web Vitals: https://web.dev/vitals/
- Lighthouse CI: https://github.com/GoogleChrome/lighthouse-ci
- Workbox: https://developer.chrome.com/docs/workbox/
