# SEO Checklist

## Meta Tags

```vue
<!-- app.vue or useHead -->
<script setup lang="ts">
useHead({
  title: 'My App',
  titleTemplate: '%s | My App',
  htmlAttrs: { lang: 'es' },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'Description of the page' },
    { name: 'keywords', content: 'keyword1, keyword2' },
    { name: 'author', content: 'Company Name' },
    // Robots
    { name: 'robots', content: 'index, follow' },
    { name: 'googlebot', content: 'index, follow' },
  ],
})
</script>
```

### Per-page Meta

```vue
<script setup lang="ts">
const { data: post } = await useFetch('/api/posts/1')

useHead({
  title: post.value.title,
  meta: [
    { name: 'description', content: post.value.excerpt },
    { name: 'robots', content: 'index, follow' },
  ],
})
</script>
```

## Structured Data (JSON-LD)

```vue
<script setup lang="ts">
const { data: product } = await useFetch('/api/products/1')

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.value.name,
        description: product.value.description,
        image: product.value.image,
        offers: {
          '@type': 'Offer',
          price: product.value.price,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
      }),
    },
  ],
})
</script>
```

### Common Schema Types

```typescript
// Article
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Title",
  "description": "Excerpt",
  "author": { "@type": "Person", "name": "Author" },
  "datePublished": "2024-01-01",
  "image": "https://example.com/image.jpg"
}

// BreadcrumbList
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
    { "@type": "ListItem", "position": 2, "name": "Category", "item": "https://example.com/category" },
  ]
}

// Organization
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": ["https://twitter.com/company", "https://linkedin.com/company"]
}

// FAQPage
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Question?",
    "acceptedAnswer": { "@type": "Answer", "text": "Answer." }
  }]
}
```

## Core Web Vitals

| Metric | Target | Implementation |
|--------|--------|---------------|
| **LCP** | ≤ 2.5s | Optimize images, preload hero, minimize render-blocking |
| **CLS** | ≤ 0.1 | Set dimensions on images/ads, avoid late-injected content |
| **INP** | ≤ 200ms | Delegate events, break up long tasks, lazy load non-critical |

```vue
<!-- Preload critical resources -->
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high">
<link rel="preload" as="font" href="/fonts/inter.woff2" crossorigin>

<!-- Set image dimensions to prevent CLS -->
<img src="/hero.webp" width="1200" height="630" alt="Hero" loading="eager">

<!-- Nuxt Image -->
<NuxtImg src="/hero.jpg" width="1200" height="630" format="webp" />
```

## Sitemap

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  sitemap: {
    enabled: true,
    sources: ['/api/__sitemap__/urls'],
    defaults: {
      changefreq: 'weekly',
      priority: 0.5,
      lastmod: new Date().toISOString(),
    },
  },
})

// Or manual with @nuxtjs/sitemap
export default defineNuxtConfig({
  modules: ['@nuxtjs/sitemap'],
  sitemap: {
    urls: async () => {
      const posts = await $fetch('/api/posts')
      return posts.map((p) => ({
        loc: `/blog/${p.slug}`,
        lastmod: p.updatedAt,
        changefreq: 'monthly',
        priority: 0.8,
      }))
    },
  },
})
```

## Robots.txt

```
# public/robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_nuxt/

Sitemap: https://example.com/sitemap.xml
```

```vue
<script setup lang="ts">
// Dynamic robots.txt via server route
// app/server/api/robots.txt.ts
export default defineEventHandler(() => {
  const isProd = process.env.NODE_ENV === 'production'
  return `
User-agent: *
${isProd ? 'Allow: /' : 'Disallow: /'}
Disallow: /admin/
Disallow: /api/

Sitemap: https://${isProd ? 'example.com' : 'staging.example.com'}/sitemap.xml
  `.trim()
})
</script>
```

## Canonical URLs

```vue
<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()

const canonicalUrl = computed(() => {
  return `${config.public.siteUrl}${route.path}`
})

useHead({
  link: [
    { rel: 'canonical', href: canonicalUrl.value },
  ],
})
</script>
```

## Hreflang Tags

```vue
<script setup lang="ts">
const locales = ['en', 'es', 'fr']
const route = useRoute()

useHead({
  link: locales.map((l) => ({
    rel: 'alternate',
    href: `https://${l}.example.com${route.path}`,
    hreflang: l,
  })),
})
</script>
```

## SSR / Pre-rendering

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // SSR for dynamic content
  ssr: true,

  // Static generation for marketing pages
  routeRules: {
    '/': { prerender: true },
    '/about': { prerender: true },
    '/blog/**': { prerender: true, swr: 3600 }, // ISR
    '/dashboard/**': { ssr: false }, // SPA (no SEO needed)
  },
})
```

## Open Graph / Twitter Cards

```vue
<script setup lang="ts">
const { data: page } = await useFetch('/api/page')

useHead({
  meta: [
    // Open Graph
    { property: 'og:title', content: page.value.title },
    { property: 'og:description', content: page.value.description },
    { property: 'og:image', content: page.value.image },
    { property: 'og:url', content: canonicalUrl.value },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'es_ES' },
    { property: 'og:site_name', content: 'My App' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: page.value.title },
    { name: 'twitter:description', content: page.value.description },
    { name: 'twitter:image', content: page.value.image },
  ],
})
</script>
```

## Full SEO Checklist

### Technical
- [ ] SSL/HTTPS enabled
- [ ] `robots.txt` configured (allow/disallow)
- [ ] Sitemap.xml generated and submitted to Google
- [ ] Canonical URLs on all pages
- [ ] Hreflang tags for multi-language
- [ ] No broken links (404s)
- [ ] HTTP status codes correct (200, 301, 404, 410)
- [ ] Page speed meets Core Web Vitals
- [ ] Mobile-friendly (responsive)
- [ ] No duplicate content

### On-Page
- [ ] Unique title tag (50-60 chars)
- [ ] Unique meta description (150-160 chars)
- [ ] Heading hierarchy (H1 → H2 → H3)
- [ ] Image alt attributes
- [ ] Internal linking (relevant anchor text)
- [ ] Structured data (JSON-LD)
- [ ] Open Graph tags
- [ ] Twitter Cards
- [ ] Keyword in URL, H1, first paragraph

### Content
- [ ] Content length ≥ 300 words
- [ ] Original, not duplicated
- [ ] Keyword naturally integrated
- [ ] Readable (short paragraphs, bullet points)
- [ ] Multimedia (images, videos with alt/text)

### Performance
- [ ] LCP ≤ 2.5s
- [ ] CLS ≤ 0.1
- [ ] INP ≤ 200ms
- [ ] Images optimized (WebP/AVIF, lazy loading)
- [ ] JavaScript code-split
- [ ] CSS critical path inlined
- [ ] Fonts subset + display: swap

### Monitoring
- [ ] Google Search Console configured
- [ ] Google Analytics / Plausible
- [ ] Regular SEO audits (SEMrush, Ahrefs)
- [ ] Core Web Vitals monitoring (CrUX)
- [ ] Broken link checker (weekly)
