# SEO

## Objetivos
- Optimizar meta tags, structured data y sitemap para indexación correcta
- Implementar SSR/SSG y Core Web Vitals para mejorar ranking en buscadores
- Auditar y monitorear SEO con Lighthouse y Google Search Console

## Best Practices
- Incluir meta title único (50-60 chars) y meta description (150-160 chars) en cada página
- Implementar JSON-LD con Schema.org para Organization, BreadcrumbList, Article, FAQ, etc.
- Generar sitemap.xml dinámico y robots.txt con referencias a sitemap
- Usar SSR (Nuxt/Next) o SSG para contenido indexable, no CSR sin prerender
- Configurar canonical URLs y hreflang para contenido multilingüe

## Anti-Patterns
- Meta keywords: Google no los usa desde 2009; es ruido innecesario
- Duplicación de contenido sin canonical: páginas con mismo contenido en distintas URLs
- JavaScript client-side rendering sin prerender: crawlers no ejecutan JS completo

## Errores Comunes
- Olvidar alt text en imágenes: perjudica accesibilidad y SEO de imágenes
- Títulos H1 vacíos, múltiples o ausentes: rompe jerarquía de encabezados
- Ignorar Core Web Vitals: LCP > 2.5s o CLS > 0.1 penalizan el ranking

## Checklist
- [ ] Meta title y description únicos por página
- [ ] JSON-LD estructurado al menos para Organization y BreadcrumbList
- [ ] Sitemap.xml actualizado y referenciado en robots.txt
- [ ] Canonical URL en todas las páginas
- [ ] hreflang configurado para cada idioma/región

## Convenciones
- Archivo robots.txt en public/robots.txt con Allow/Disallow por entorno
- Sitemap generado por script en build, no manual
- Imágenes con alt text descriptivo de hasta 125 caracteres

## Ejemplos
```typescript
// Meta tags con Nuxt 3
export default definePageMeta({
  title: 'Template - Desarrollo Web Profesional',
  description: 'Plantilla moderna para aplicaciones web con Vue 3, TypeScript y buenas prácticas',
  og: {
    title: 'Template - Desarrollo Web Profesional',
    description: 'Plantilla moderna para aplicaciones web',
    image: '/og-image.png',
    type: 'website',
  },
  twitterCard: 'summary_large_image',
});

// JSON-LD para breadcrumbs
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://example.com' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://example.com/blog' },
    { '@type': 'ListItem', position: 3, name: 'Artículo Actual', item: 'https://example.com/blog/post' },
  ],
};
```

## Referencias Oficiales
- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Schema.org: https://schema.org/
- Google Search Console: https://search.google.com/search-console
