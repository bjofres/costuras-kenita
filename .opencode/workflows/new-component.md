# Nuevo Componente (WF-05)

## Trigger
Issue etiquetado como `component` o `ui` para creación de un nuevo componente de interfaz de usuario. Puede surgir de diseño visual o requerimiento de funcionalidad.

## Agentes Involucrados
- **Frontend Lead**: diseño e implementación del componente
- **Animation Director**: definición de animaciones y microinteracciones
- **A11y Expert**: revisión de accesibilidad
- **QA Director**: pruebas de componente y visuales
- **Documentation Director**: documentación y Storybook

## Pipeline SDD

### 1. Discovery
**Output**: Discovery Brief
**Responsable**: Frontend Lead
**Actividades**:
- Analizar el diseño en Figma o especificación visual
- Identificar variantes del componente (estados, tamaños, temas)
- Evaluar reutilización en otras partes de la aplicación
- Revisar componentes existentes para mantener consistencia
- Documentar propiedades (props) requeridas y opcionales
- Identificar dependencias con otros componentes

### 2. Specification
**Output**: SPEC.md (Component Spec)
**Responsable**: Frontend Lead
**Actividades**:
- Definir API pública del componente (props, events, slots)
- Especificar estados visuales (default, hover, active, disabled, focus, error)
- Documentar comportamiento responsivo y breakpoints
- Definir variantes de tema (light/dark mode)
- Especificar criterios de accesibilidad (WCAG)
- Documentar animaciones y transiciones

### 3. Architecture
**Output**: ARCHITECTURE.md section
**Responsable**: Frontend Lead + Architecture Director
**Actividades**:
- Decidir patrón de composición (compound, render props, etc.)
- Definir estructura de archivos del componente
- Establecer estrategia de estilos (CSS modules, Tailwind, styled-components)
- Planear integración con sistema de diseño (design tokens)
- Documentar decisiones arquitectónicas

### 4. Plan
**Output**: PLAN.md
**Responsable**: Frontend Lead
**Actividades**:
- Desglosar tareas: estructura, estilos, lógica, tests, storybook
- Estimar esfuerzo por tarea
- Definir dependencias con Animation Director si aplica
- Coordinar revisión de accesibilidad con A11y Expert

### 5. Implementation
**Output**: Working code (component)
**Responsable**: Frontend Lead
**Actividades**:
- Crear estructura de archivos del componente
- Implementar template/markup semántico
- Desarrollar estilos con design tokens y variantes
- Implementar lógica de estados y eventos
- Agregar animaciones y transiciones
- Escribir tests unitarios del componente
- Crear stories de Storybook con variantes
- Verificar accesibilidad con herramientas automatizadas
- Ejecutar lint, typecheck y tests completos

### 6. Review
**Output**: REVIEW.md
**Responsable**: Review Director + A11y Expert + Animation Director
**Actividades**:
- Revisar implementación contra SPEC.md
- Verificar accesibilidad (teclado, screen reader, contraste)
- Evaluar animaciones (rendimiento, reduced motion)
- Confirmar cobertura de tests y stories
- Revisar consistencia con sistema de diseño
- Aprobar cambio

### 7. QA
**Output**: QA_REPORT.md
**Responsable**: QA Director
**Actividades**:
- Ejecutar tests unitarios y de integración
- Realizar pruebas visuales (regresión visual)
- Probar todas las variantes y estados documentados
- Verificar responsividad en distintos viewports
- Probar accesibilidad con herramientas manuales
- Certificar componente listo para consumo

### 8. Documentation
**Output**: Updated docs
**Responsable**: Documentation Director
**Actividades**:
- Publicar componente en Storybook
- Actualizar guía de componentes del sistema de diseño
- Documentar ejemplos de uso
- Actualizar CHANGELOG.md

### 9. Delivery
**Output**: Delivered artifact
**Responsable**: Frontend Lead
**Actividades**:
- Crear PR con referencia al issue y SPEC.md
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
