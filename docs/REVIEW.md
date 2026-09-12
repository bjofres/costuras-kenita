# REVIEW.md — Fase 1 (Review Director)

**Alcance:** `index.html`, `styles.css`, `app.js` + `docs/SPEC.md`, `ARCHITECTURE.md`, `PLAN.md`, `adr/ADR-001`.

## Hallazgos por severidad
- **Críticos:** 0.
- **Altos:** 0.
- **Medios:**
  1. Teléfono/WhatsApp provisorio (`56900000000`) — aceptado para Fase 1, centralizado en `app.js → SITE.whatsapp` con comentario `CAMBIA AQUÍ`. Acción Fase 2: pedir número real + Instagram real.
  2. Galería con ilustraciones CSS en vez de fotos reales — aceptado por SPEC §6, con copy honesto “espacio reservado para tus fotos”.
- **Bajos / warnings:**
  - `select:focus` hereda outline genérico (cubierto por `:focus-visible` global). No bloquea.
  - Fotos OG sin imagen absoluta (no hay assets aún). Fase 2: agregar `og:image`.

## Calidad
- HTML semántico, H1 único, landmarks header/main/footer/nav correctos.
- Contraste: vino `#7A2E3A` y verde `#2F6B4F` sobre crema/blanco ≥ 4.5:1. Dorado solo decorativo o sobre tinta.
- Sin frameworks ni imágenes raster; superficie XSS mínima (sin `innerHTML`, formulario solo arma URL con `encodeURIComponent`).

**Veredicto:** Aprobado para entrega Fase 1. Score: 9/10.
**Aprobadores:** Review Director + Frontend Lead (simulados por Orchestrator según jerarquía).
