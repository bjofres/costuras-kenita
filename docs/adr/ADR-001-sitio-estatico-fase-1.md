# ADR-001 — Sitio estático vanilla en Fase 1 (en vez de Nuxt 3)

- **Estado:** Aceptado
- **Fecha:** 2026-09-12
- **Decisor:** Architecture Director (a propuesta de Frontend Lead)
- **Contexto:** El design system del programa (.opencode) favorece Nuxt 3 + Tailwind + Pinia. Para una Fase 1 de validación visual de una costurera (una sola landing, sin backend, necesidad de abrir el archivo y mostrarlo al cliente hoy), un build de Nuxt añade fricción sin aportar valor inmediato.
- **Decisión:** Fase 1 en HTML + CSS + JS vanilla, con tokens y secciones que mapean 1:1 a componentes Nuxt futuros. Fase 2 migra a Nuxt 3 + Tailwind manteniendo tokens y contenidos.
- **Alternativas consideradas:**
  - Nuxt 3 desde el día 1: descartado para Fase 1 por costo de setup/despliegue frente a una landing estática.
  - Tailwind por CDN: descartado para Fase 1 por peso y dependencia de red; se usa CSS con custom properties equivalentes.
- **Consecuencias:** Entrega inmediata, Lighthouse alto, mantenimiento simple. Costo: reescribir estilos a Tailwind en Fase 2 (mitigado con tokens idénticos).
