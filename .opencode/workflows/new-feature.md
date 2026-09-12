# Nueva Funcionalidad (WF-01)

## Trigger
Solicitud de nueva funcionalidad aprobada en backlog. Issue etiquetado como `feature` asignado a un sprint.

## Agentes Involucrados
- **Frontend Lead**: especificación UI/UX, implementación de componentes, tests visuales
- **Backend Lead**: especificación de API, lógica de negocio, integración
- **Database Director**: modelado de datos si aplica
- **QA Director**: plan de pruebas integral
- **Documentation Director**: documentación de la funcionalidad
- **A11y Expert**: revisión de accesibilidad
- **Animation Director**: revisión de animaciones si aplica

## Pipeline SDD

### 1. Discovery
**Output**: Discovery Brief
**Responsable**: Frontend Lead + Backend Lead
**Actividades**:
- Analizar la solicitud y recopilar contexto del dominio
- Identificar usuarios impactados y criterios de éxito
- Evaluar dependencias con otros sistemas o componentes
- Documentar restricciones técnicas y de negocio
- Estimar esfuerzo初步 y riesgos potenciales

### 2. Specification
**Output**: SPEC.md
**Responsable**: Frontend Lead + Backend Lead
**Actividades**:
- Redactar especificación funcional detallada
- Definir contratos de API (request/response)
- Describir flujos de interacción de usuario
- Documentar casos borde y manejo de errores
- Definir criterios de aceptación por escenario
- Validar especificación con stakeholders

### 3. Architecture
**Output**: ARCHITECTURE.md section / ADR
**Responsable**: Architecture Director
**Actividades**:
- Diseñar la arquitectura de la solución
- Decidir patrones de diseño a utilizar
- Definir estructura de componentes y módulos
- Evaluar impacto en arquitectura existente
- Documentar decisiones en ADR si hay cambios significativos

### 4. Plan
**Output**: PLAN.md
**Responsable**: Frontend Lead + Backend Lead
**Actividades**:
- Desglosar el trabajo en tareas atómicas
- Estimar esfuerzo por tarea en horas
- Identificar dependencias entre tareas
- Definir orden de implementación óptimo
- Asignar responsables a cada tarea
- Establecer hitos de verificación intermedia

### 5. Implementation
**Output**: Working code
**Responsable**: Frontend Lead + Backend Lead
**Actividades**:
- Implementar la lógica de negocio del backend
- Crear endpoints de API con validaciones
- Desarrollar componentes de UI siguiendo SPEC.md
- Escribir tests unitarios y de integración
- Realizar autoverificación funcional local
- Ejecutar lint y typecheck antes de commit

### 6. Review
**Output**: REVIEW.md
**Responsable**: Review Director + Architecture Director + especialistas
**Actividades**:
- Revisar calidad y estilo del código
- Verificar adherencia a la especificación
- Evaluar rendimiento de queries y algoritmos
- Confirmar cobertura de tests adecuada
- Documentar hallazgos y aprobar cambios

### 7. QA
**Output**: QA_REPORT.md
**Responsable**: QA Director + especialistas
**Actividades**:
- Ejecutar suite de tests automatizados
- Realizar pruebas de integración de extremo a extremo
- Probar flujos críticos y casos borde manualmente
- Verificar rendimiento bajo carga esperada
- Reportar bugs y validar correcciones

### 8. Documentation
**Output**: Updated docs
**Responsable**: Documentation Director
**Actividades**:
- Actualizar README con la nueva funcionalidad
- Documentar API endpoints en guía de API
- Agregar ejemplos de uso en la documentación técnica
- Registrar cambios en CHANGELOG.md

### 9. Delivery
**Output**: Delivered artifact
**Responsable**: Frontend Lead
**Actividades**:
- Crear PR con referencia al issue y SPEC.md
- Solicitar approval de los revisores asignados
- Fusionar rama tras aprobación y gates verdes

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
