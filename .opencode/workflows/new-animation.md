# Nueva Animación (WF-06)

## Trigger
Issue etiquetado como `animation` o `motion` para creación de animaciones, microinteracciones, transiciones de página o efectos visuales.

## Agentes Involucrados
- **Animation Director**: diseño e implementación de la animación
- **Frontend Lead**: integración con componentes existentes
- **A11y Expert**: revisión de accesibilidad (reduced motion, preferencias de movimiento)
- **QA Director**: pruebas de rendimiento y comportamiento
- **Documentation Director**: documentación técnica de la animación

## Pipeline SDD

### 1. Discovery
**Output**: Discovery Brief
**Responsable**: Animation Director
**Actividades**:
- Analizar el diseño de animación (Figma, prototipo, spec)
- Identificar triggers de la animación (scroll, hover, click, carga)
- Evaluar librerías adecuadas (GSAP, Framer Motion, Lenis, CSS animations)
- Documentar duración, easing y curvas de animación
- Identificar impacto en rendimiento (layout, paint, compositor)
- Evaluar compatibilidad con navegadores objetivo

### 2. Specification
**Output**: SPEC.md (Animation Spec)
**Responsable**: Animation Director
**Actividades**:
- Definir timeline de la animación con keyframes
- Especificar easing functions y duraciones
- Documentar comportamiento en distintas orientaciones y viewports
- Definir cómo respeta `prefers-reduced-motion`
- Especificar estados de inicio, progreso y fin
- Documentar interacciones con otros elementos durante la animación

### 3. Architecture
**Output**: ARCHITECTURE.md section
**Responsable**: Animation Director + Frontend Lead
**Actividades**:
- Decidir enfoque técnico (CSS animations, WAAPI, GSAP, Framer Motion)
- Definir estructura de archivos de animación
- Establecer convenciones de nombrado y organización
- Planear integración con el sistema de diseño
- Evaluar lazy loading de librerías de animación
- Documentar decisiones en ADR si hay cambio de librería

### 4. Plan
**Output**: PLAN.md
**Responsable**: Animation Director
**Actividades**:
- Desglosar trabajo por fases (prototipo, integración, refinamiento)
- Estimar esfuerzo por tipo de animación
- Coordinar con Frontend Lead para hooks de integración
- Definir hitos de revisión visual

### 5. Implementation
**Output**: Working code (animation)
**Responsable**: Animation Director
**Actividades**:
- Implementar animación con la librería seleccionada
- Respetar `prefers-reduced-motion` con variante estática
- Optimizar rendimiento (GPU, will-change, evitar reflow)
- Probar en múltiples navegadores y dispositivos
- Integrar con componente anfitrión
- Escribir tests específicos de animación (timeline, estados)
- Ejecutar lint, typecheck y tests

### 6. Review
**Output**: REVIEW.md
**Responsable**: Animation Director + A11y Expert + Frontend Lead
**Actividades**:
- Revisar fidelidad visual contra el diseño original
- Verificar suavidad y rendimiento (60fps)
- Confirmar respeto de `prefers-reduced-motion`
- Evaluar experiencia en dispositivos de bajos recursos
- Probar interacciones sin animación habilitada
- Aprobar implementación

### 7. QA
**Output**: QA_REPORT.md
**Responsable**: QA Director + Animation Director
**Actividades**:
- Realizar pruebas de rendimiento (FPS, jank, memoria)
- Probar en distintos navegadores y versiones
- Verificar comportamiento con `prefers-reduced-motion: reduce`
- Probar en dispositivos móviles y de bajos recursos
- Probar interrupción y reanudación de animación
- Certificar calidad y rendimiento

### 8. Documentation
**Output**: Updated docs
**Responsable**: Documentation Director
**Actividades**:
- Documentar API de la animación (props, triggers, opciones)
- Agregar ejemplos de uso en Storybook o guía visual
- Documentar variante reduced-motion
- Actualizar CHANGELOG.md con nueva animación

### 9. Delivery
**Output**: Delivered artifact
**Responsable**: Animation Director
**Actividades**:
- Crear PR con spec de animación y código
- Obtener approval de revisores
- Fusionar rama tras gates verdes

## Quality Gates
- [ ] Compilation
- [ ] Lint
- [ ] TypeCheck
- [ ] Tests
- [ ] Accessibility
- [ ] Performance
- [ ] Security
- [ ] Architecture
- [ ] Documentation

## Definition of Done
- [ ] All gates pass
- [ ] SPEC.md is verified
- [ ] Code is merged
- [ ] Documentation is updated
