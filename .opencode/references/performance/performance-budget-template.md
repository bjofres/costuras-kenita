# Performance Budget Template

## Web Vitals Targets

| Metric | Good | Needs Improvement | Poor | Budget |
|--------|------|------------------|------|--------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | 2.5s - 4.0s | > 4.0s | **≤ 2.0s** |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 0.1 - 0.25 | > 0.25 | **≤ 0.05** |
| **INP** (Interaction to Next Paint) | ≤ 200ms | 200ms - 500ms | > 500ms | **≤ 150ms** |
| **TTI** (Time to Interactive) | ≤ 3.8s | 3.8s - 7.3s | > 7.3s | **≤ 3.0s** |
| **TBT** (Total Blocking Time) | ≤ 200ms | 200ms - 600ms | > 600ms | **≤ 100ms** |
| **FCP** (First Contentful Paint) | ≤ 1.8s | 1.8s - 3.0s | > 3.0s | **≤ 1.5s** |
| **SI** (Speed Index) | ≤ 3.4s | 3.4s - 5.8s | > 5.8s | **≤ 2.5s** |

## Bundle Size Budgets

| Asset | Budget | Notes |
|-------|--------|-------|
| **Initial JS** (gzip) | ≤ 150 KB | Critical path only |
| **Total JS** (gzip) | ≤ 300 KB | After code splitting |
| **Initial CSS** (gzip) | ≤ 20 KB | Critical CSS inline |
| **Total CSS** (gzip) | ≤ 50 KB | |
| **Fonts** | ≤ 50 KB | WOFF2, subset if needed |
| **Image (hero)** | ≤ 100 KB | WebP/AVIF |
| **Image (thumbnail)** | ≤ 20 KB | WebP/AVIF |
| **Total page weight** | ≤ 500 KB | First view |

## API Latency Budgets

| Endpoint Type | P50 | P95 | P99 |
|--------------|-----|-----|-----|
| **Simple reads** (GET /users/:id) | ≤ 50ms | ≤ 150ms | ≤ 300ms |
| **List with filters** (GET /users) | ≤ 100ms | ≤ 300ms | ≤ 500ms |
| **Writes** (POST/PUT/PATCH) | ≤ 200ms | ≤ 500ms | ≤ 1000ms |
| **Complex queries** (reports) | ≤ 500ms | ≤ 2000ms | ≤ 5000ms |
| **External API calls** | ≤ 300ms | ≤ 1000ms | ≤ 3000ms |
| **DB queries (simple)** | ≤ 10ms | ≤ 50ms | ≤ 100ms |
| **DB queries (complex)** | ≤ 50ms | ≤ 200ms | ≤ 500ms |

## Lighthouse Scores

| Category | Min Score | Target |
|----------|-----------|--------|
| **Performance** | 80 | ≥ 90 |
| **Accessibility** | 85 | ≥ 95 |
| **Best Practices** | 85 | ≥ 95 |
| **SEO** | 90 | ≥ 95 |
| **PWA** | 50 | ≥ 80 |

## Monitoring Implementation

```typescript
// Web Vitals reporting (client-side)
// composables/useWebVitals.ts
export function useWebVitals() {
  if (process.client) {
    import('web-vitals').then(({ onLCP, onCLS, onINP, onFCP }) => {
      onLCP((metric) => reportMetric('LCP', metric));
      onCLS((metric) => reportMetric('CLS', metric));
      onINP((metric) => reportMetric('INP', metric));
      onFCP((metric) => reportMetric('FCP', metric));
    });
  }
}

function reportMetric(name: string, metric: any) {
  // Send to analytics
  fetch('/api/analytics/vitals', {
    method: 'POST',
    body: JSON.stringify({
      name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      url: window.location.pathname,
      device: navigator.userAgent,
    }),
  });

  // Alert if over budget
  const budgets = { LCP: 2000, CLS: 0.05, INP: 150, FCP: 1500 };
  if (metric.value > budgets[name]) {
    console.warn(`⚠️ ${name} exceeded budget: ${metric.value}ms > ${budgets[name]}ms`);
  }
}
```

## Bundle Analysis

```typescript
// nuxt.config.ts - Bundle analysis
export default defineNuxtConfig({
  build: {
    analyze: {
      analyzerMode: 'static',
      openAnalyzer: false,
    },
  },

  // Code splitting
  pages: true, // Automatic code splitting per page

  // Tree-shaking
  build: {
    transpile: [], // Only if absolutely needed
  },

  // Import optimization
  imports: {
    autoImport: true,
  },
})
```

## Performance Budget CI

```yaml
# .github/workflows/performance.yml
name: Performance Budget
on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4

      - run: npm ci && npm run build
      - uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://staging.example.com/
            https://staging.example.com/dashboard
          budgetPath: ./lighthouse-budget.json
          uploadArtifacts: true

  bundle-size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4

      - run: npm ci && npm run build
      - uses: preactjs/compressed-size-action@v2
        with:
          build-script: build
          pattern: '**/dist/**/*.{js,css}'
          minimum-change-threshold: 100
```

## Lighthouse Budget File

```json
// lighthouse-budget.json
[
  {
    "path": "/*",
    "resourceSizes": [
      { "resourceType": "script", "budget": 150 },
      { "resourceType": "stylesheet", "budget": 20 },
      { "resourceType": "image", "budget": 200 },
      { "resourceType": "font", "budget": 50 },
      { "resourceType": "document", "budget": 30 },
      { "resourceType": "total", "budget": 500 }
    ],
    "resourceCounts": [
      { "resourceType": "script", "budget": 5 },
      { "resourceType": "stylesheet", "budget": 3 },
      { "resourceType": "image", "budget": 15 },
      { "resourceType": "font", "budget": 3 }
    ],
    "timings": [
      { "metric": "first-contentful-paint", "budget": 1800 },
      { "metric": "largest-contentful-paint", "budget": 2500 },
      { "metric": "cumulative-layout-shift", "budget": 0.1 },
      { "metric": "speed-index", "budget": 3400 },
      { "metric": "total-blocking-time", "budget": 200 },
      { "metric": "interactive", "budget": 3800 }
    ]
  }
]
```

## Optimization Strategies

### JavaScript

```typescript
// Dynamic imports
const HeavyComponent = defineAsyncComponent(() =>
  import('~/components/heavy/ChartComponent.vue')
);

// Lazy load routes
// Nuxt already handles this with pages/

// Avoid large libraries
// ❌ import moment from 'moment' (~230KB)
// ✅ import { format } from 'date-fns' (~10KB tree-shaken)

// Code splitting
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/dashboard/**': { ssr: false }, // SPA only
      '/blog/**': { static: true },    // Fully static
    },
  },
})
```

### Images

```vue
<!-- Nuxt Image component -->
<NuxtImg
  provider="cloudinary"
  src="/hero.jpg"
  width="1200"
  height="630"
  format="webp"
  quality="80"
  loading="lazy"
  sizes="sm:100vw md:50vw lg:1200px"
/>

<!-- Preload critical image -->
<link rel="preload" as="image" href="/hero.webp">
```

### CSS

```vue
<!-- Inline critical CSS, defer non-critical -->
<style>
/* Critical: above-the-fold styles */
.header { ... }
</style>

<!-- Non-critical loaded async -->
<link rel="preload" as="style" href="/app.css" onload="this.onload=null;this.rel='stylesheet'">
```

### Fonts

```css
/* Font optimization */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2');
  font-display: swap; /* Show text immediately with fallback */
  unicode-range: U+0000-00FF; /* Subset Latin */
}
```

## Measurement Tools

| Tool | What it measures | When |
|------|-----------------|------|
| **Lighthouse** | Web Vitals, best practices | CI, local dev |
| **Web Vitals** | Real user monitoring (RUM) | Production |
| **Bundle Analyzer** | Bundle composition | Build time |
| **Nuxt DevTools** | Performance tab | Development |
| **Chrome DevTools** | Network, Performance, Coverage | Development |
| **Sentry Performance** | APM, traces, DB queries | Production |
| **DataDog / New Relic** | Server-side metrics | Production |

## Budget Review Process

1. **Define budget** at project start (this document)
2. **Measure** in CI for every PR
3. **Alert** on budget violation (warn at 90%, fail at 100%)
4. **Review** monthly performance report
5. **Optimize** most impactful metrics first
6. **Update budget** as baseline improves
