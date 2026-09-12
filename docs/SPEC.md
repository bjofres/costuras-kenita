# SPEC.md — Landing Costurera Fase 1
**Proyecto:** Taller de costura “Entre Costuras” (nombre provisorio, configurable)
**Workflow:** WF-01 Nueva Funcionalidad | **Fase:** 1 (landing estática)
**Responsables:** Orchestrator → Frontend Lead + Animation Director + SEO/A11y Experts
**Idioma:** Español (términos técnicos en English) — según RULES.md §5

## 1. Objetivo
Crear una página única, bonita y rápida que presente los servicios de una costurera (ropa casual/arreglos, vestir formal, vestidos de fiesta, uniformes y actividades de colegio), genere confianza y consiga contactos por WhatsApp / formulario. Fase 1 = sin backend, sin build step, abrible con doble clic.

## 2. Historias de usuario
1. Como **visitante**, quiero entender en 5 segundos qué hace la costurera y ver un diseño acogedor con máquina de coser, para quedarme a explorar.
2. Como **mamá/papá**, quiero ver la sección “Colegio” (uniformes, bastas, disfraces, insignias) para cotizar rápido.
3. Como **clienta de fiesta**, quiero ver vestidos / arreglos formales y fotos de trabajos para confiar.
4. Como **cliente**, quiero un botón de WhatsApp y un formulario de cotización simple (tipo prenda, talla, fecha, mensaje) para pedir precio.
5. Como **usuaria móvil**, quiero que todo se vea bien en el celular y cargue rápido.

## 3. Criterios de aceptación (Fase 1)
- [ ] Hero con ilustración SVG de máquina de coser animada (aguja sube/baja, hilo que se dibuja).
- [ ] Secciones: Inicio, Servicios (4 tarjetas), Galería/Trabajos (6), Proceso (4 pasos), Testimonios (3), Precios orientativos, FAQ (5), Contacto + footer.
- [ ] Servicios cubren: ropa casual y arreglos, vestir formal, vestidos, colegio/actividades.
- [ ] Botón flotante de WhatsApp + CTA en hero y contacto (link `https://wa.me/56900000000` configurable).
- [ ] Formulario valida en front y arma mensaje para WhatsApp (sin backend).
- [ ] Responsive mobile-first (360px → 1280px), menú hamburguesa funcional.
- [ ] Animaciones de reveal al hacer scroll + `prefers-reduced-motion` respetado.
- [ ] Contraste AA, navegación por teclado, focos visibles, HTML semántico.
- [ ] Sin dependencias de build; solo Google Fonts + CSS/JS propios.

## 4. Restricciones técnicas
- Stack Fase 1: `index.html` + `styles.css` + `app.js` estáticos (ver ADR-001).
- Sin Tailwind por CDN en Fase 1 para garantizar apertura offline tras primera carga? Decisión: CSS propio con tokens (más liviano y controlable). Migración a Nuxt 3 + Tailwind en Fase 2.
- Todo el texto editable en un solo objeto `SITE` en `app.js` (nombre, teléfono, precios).
- Imágenes: solo SVG/CSS inline (cero peso, sin fotos externas en Fase 1).

## 5. Fuera de alcance (Fase 1)
- Backend, base de datos, agenda/reservas reales, pagos, multi-idioma, CMS, galería con fotos reales, tests E2E automatizados.
- Migrar a Nuxt/Vue (queda para Fase 2, ver PLAN.md).

## 6. Riesgos
- Nombre/teléfono provisorios → mitigado con objeto `SITE` configurable.
- Fotos reales ausentes → mitigado con tarjetas ilustradas + sección “tus fotos aquí”.
