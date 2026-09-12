# Nuxt 3

## Objetivos
- Implementar App Router con pages, layouts y middleware correctamente
- Manejar data fetching con useFetch, useAsyncData y distintos modos de renderizado (SSR, SSG, SWR, ISR)
- Optimizar SEO con useHead, useSeoMeta y aprovechar auto-imports, módulos y layers

## Best Practices
- Usar `useFetch` en lugar de `useAsyncData` para peticiones simples (evita boilerplate)
- Estructurar layouts anidados para aprovechar la herencia de layouts de Nuxt
- Definir middleware en archivos separados dentro de `middleware/` con nombres descriptivos
- Configurar `nuxt.config.ts` con tipos estrictos y `pages: true` para el router basado en archivos
- Preferir server routes (`server/api/`) para lógica que nunca debe exponerse al cliente

## Anti-Patterns
- Fetch de datos en `onMounted` con `useFetch` fuera de page/layout: rompe la hidratación SSR y genera waterfall requests
- Usar `$fetch` directamente en páginas: pierde la integración con el lifecycle de Nuxt y el cache
- Importar componentes manualmente: Nuxt auto-importa componentes, imports redundantes duplican bundles
- Ignorar el modo de renderizado: SSG no debe usar `useFetch` sin `static: true`

## Errores Comunes
- Olvidar `await` en `useAsyncData` / `useFetch` dentro de páginas
- No manejar el estado `pending` y `error` en templates durante la carga SSR
- Confundir `navigateTo` (cliente) con redirect en `definePageMeta` (servidor)
- Usar cookies/localeStorage directamente sin `useCookie` (no hidrata correctamente)

## Checklist
- [ ] ¿Se usa `useFetch` o `useAsyncData` en lugar de `$fetch` dentro de componentes de página?
- [ ] ¿Los layouts están correctamente anidados y nombrados?
- [ ] ¿Los middleware tienen `definePageMeta` correspondiente?
- [ ] ¿Se manejan estados `pending` y `error` en todas las páginas con fetch?
- [ ] ¿Las server routes están bajo `server/api/` y retornan tipos definidos?

## Convenciones
- Naming: páginas en kebab-case, layouts con prefijo `default.vue`
- Composable: crear en `composables/` con `use` prefix (auto-importados)
- Middleware: archivos en `middleware/`, usar `definePageMeta({ middleware: 'name' })`
- Módulos: instalar vía `npm install` y agregar a `modules` en `nuxt.config.ts`

## Ejemplos
```typescript
// pages/index.vue
<script setup lang="ts">
const { data, pending, error } = await useFetch('/api/posts', {
  lazy: true,
  server: false
})

useSeoMeta({
  title: 'Inicio',
  description: 'Página principal'
})
</script>

<template>
  <div>
    <Loading v-if="pending" />
    <ErrorState v-else-if="error" :error="error" />
    <PostList v-else :posts="data" />
  </div>
</template>
```

## Referencias Oficiales
- Data Fetching: https://nuxt.com/docs/getting-started/data-fetching
- Rendering Modes: https://nuxt.com/docs/getting-started/rendering
- SEO: https://nuxt.com/docs/getting-started/seo-meta