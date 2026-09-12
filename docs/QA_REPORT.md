# QA_REPORT.md — Fase 1 (QA Director)

**Fecha:** 2026-09-12 | **Entorno:** apertura directa de `index.html` + inspección de código.

## Checklist funcional (manual)
- [x] Hero renderiza con máquina SVG animada (aguja, hilo, carrete, botones flotantes)
- [x] Nav ancla a las 7 secciones; menú hamburguesa abre/cierra en ≤860px
- [x] Reveal al scroll + contadores del hero funcionan; con `prefers-reduced-motion` se desactivan
- [x] FAQ accordion abre/cierra; formulario valida (nombre/tipo/mensaje) y abre `wa.me` con texto codificado
- [x] Botón flotante WhatsApp + CTAs apuntan a `SITE.whatsapp` centralizado
- [x] Responsive 360px / 768px / 1280px sin scroll horizontal (grid 1→2→3/4 col)

## Accesibilidad (WCAG AA, revisión experta)
- [x] `lang="es"`, skip-link, labels reales, `aria-expanded/controls/label`, `role="status"` en nota del form
- [x] Foco visible global, contraste texto ≥ 4.5:1, animaciones con `prefers-reduced-motion`

## Performance / Seguridad
- [x] 0 frameworks, 0 imágenes raster, CSS+JS propios < 30KB; solo dependencia externa: Google Fonts con `preconnect`
- [x] Sin secretos, sin `innerHTML`, sin backend; `target="_blank"` siempre con `rel="noopener"`

## Gates DoD aplicables a Fase 1
Compilación N/A (estático) · Lint/TypeCheck N/A · Tests auto N/A (verificados manuales) · A11y ✅ · Perf ✅ · Seguridad ✅ · Arquitectura ✅ (ADR-001) · Docs ✅ · Review ✅.

**Sign-off:** QA aprueba Fase 1. Pendiente Fase 2: fotos reales, número real, E2E con Playwright y Lighthouse medido en deploy.
