# ARCHITECTURE.md — Fase 1 Landing estática

## Contexto
Sitio de una sola página, informativo, sin estado global ni backend. Debe ser rápido, bonito y fácil de mantener por una persona no técnica (cambiar teléfono/precios en un solo lugar).

## Decisión principal (ver `docs/adr/ADR-001-sitio-estatico-fase-1.md`)
Sitio estático vanilla (HTML semántico + CSS con custom properties + JS progresivo) en lugar de Nuxt 3 en Fase 1. Justificación: cero build, despliegue en cualquier hosting estático, LCP < 1.5s, y migración a Nuxt prevista en Fase 2.

## Estructura de archivos
```
costurera/
├── index.html      # Estructura semántica + SEO meta + SVG máquina de coser
├── styles.css      # Design tokens, layout, componentes, animaciones, responsive
├── app.js          # SITE config + menú + reveal + contadores + FAQ + form→WhatsApp
├── assets/         # (reservado Fase 2: fotos reales, favicon)
└── docs/
    ├── SPEC.md, ARCHITECTURE.md, PLAN.md, REVIEW.md, QA_REPORT.md
    └── adr/ADR-001-*.md
```

## Componentes (secciones de `index.html`)
Header sticky → Hero (SVG animado) → Marquee de servicios → Servicios (4 cards) → Galería (6 cards ilustradas) → Proceso (4 pasos) → Precios (3 planes orientativos) → Testimonios (3) → FAQ (accordion `<details>`) → Contacto (info + form) → Footer + botón flotante WhatsApp.

## Diseño (Tailwind Expert + Animation Director)
- Paleta cálida de taller: crema `#FFF8F0`, rosa `#F9E8E0`, terracota `#C96F4A`, vino `#7A2E3A`, verde hilo `#2F6B4F`, dorado `#D9A441`, tinta `#2B2320`.
- Tipografías: `Fraunces` (display serif acogedora) + `Inter` (texto). Fallback Georgia/system-ui si no hay red.
- Tokens en `:root`, mobile-first, grid → 2 col (tablet) → 4 col (desktop).
- Motion: aguja SVG (`@keyframes aguja`), hilo que se dibuja (`stroke-dashoffset`), flotantes suaves, reveal con `.is-visible` + `IntersectionObserver`, marquee infinito, todo desactivable con `prefers-reduced-motion`.

## Accesibilidad / SEO / Performance (A11y, SEO, Perf Experts)
- HTML5 semántico, `lang="es"`, skip-link, labels reales, foco visible, contraste ≥ 4.5:1, `aria-*` en menú/FAQ/form.
- SEO: title/description/OG, H1 único, H2 por sección, JSON-LD `LocalBusiness/ClothingAlterationService`.
- Perf: 0 frameworks, 0 imágenes raster, CSS/JS < 30KB totales, `preconnect` a Google Fonts, sin render-blocking propio.

## Migración Fase 2
Mapeo directo a Nuxt 3: cada sección → componente `components/landing/*`, `SITE` → `composables/useSite.ts` + Pinia, estilos → Tailwind theme con los mismos tokens, animaciones → Motion/GSAP + Lenis.
