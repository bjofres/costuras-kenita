# Documentación (WF-11)

## Trigger
Issue etiquetado como `docs` para creación o actualización de documentación. Puede surgir de funcionalidad completada, solicitud de mejora técnica, o necesidad de ADR.

## Agentes Involucrados
- **Documentation Director**: coordinación y revisión de toda la documentación
- **ADR Writer**: redacción de Decisiones de Arquitectura (ADR)
- **API Writer**: documentación de APIs y contratos
- **Changelog Writer**: actualización de CHANGELOG.md
- **Especialista Relevante**: revisión técnica del contenido
- **Architecture Director**: aprobación de ADRs

## Pipeline SDD

### 1. Discovery
**Output**: Discovery Brief
**Responsable**: Documentation Director
**Actividades**:
- Identificar la necesidad de documentación (nueva función, cambio técnico, deuda documental)
- Revisar documentación existente para detectar brechas o desactualización
- Entrevistar a especialistas para entender el tema a documentar
- Definir audiencia objetivo (desarrolladores, usuarios, operaciones)
- Evaluar formato adecuado (markdown, ADR, OpenAPI, runbook)
- Estimar esfuerzo y alcance del trabajo documental

### 2. Specification
**Output**: SPEC.md (Documentation Spec)
**Responsable**: Documentation Director
**Actividades**:
- Definir estructura y secciones del documento
- Especificar ejemplos concretos a incluir
- Documentar referencias a código fuente o componentes
- Definir nivel de detalle esperado por sección
- Establecer criterios de calidad (claridad, precisión, ejemplos funcionales)
- Identificar diagramas o visualizaciones necesarias

### 3. Architecture
**Output**: ARCHITECTURE.md section / ADR
**Responsable**: ADR Writer + Architecture Director
**Actividades**:
- Redactar ADR si documenta una decisión arquitectónica
- Actualizar diagramas de arquitectura si aplica
- Revisar que la documentación refleje la arquitectura actual
- Validar términos técnicos y descripciones con Architecture Director
- Documentar contexto, decisión y consecuencias en ADR

### 4. Plan
**Output**: PLAN.md
**Responsable**: Documentation Director
**Actividades**:
- Desglosar trabajo de documentación por sección o documento
- Estimar esfuerzo por sección
- Definir orden de redacción (dependencias entre documentos)
- Asignar redactores (ADR Writer, API Writer, Changelog Writer)
- Coordinar revisiones técnicas con especialistas

### 5. Implementation
**Output**: Working code (documentation files)
**Responsable**: Documentation Director + redactores asignados
**Actividades**:
- Redactar borradores de documentación según SPEC.md
- Crear diagramas y visualizaciones técnicas
- Escribir ejemplos de código funcionales y verificables
- Redactar ADR siguiendo el formato establecido (contexto, decisión, consecuencias)
- Actualizar CHANGELOG.md con entrada descriptiva
- Revisar ortografía, gramática y consistencia terminológica
- Enlazar documentación relacionada y referencias cruzadas

### 6. Review
**Output**: REVIEW.md
**Responsable**: Documentation Director + Especialista Relevante + Architecture Director
**Actividades**:
- Revisar precisión técnica del contenido
- Verificar que los ejemplos de código funcionan
- Evaluar claridad y legibilidad para la audiencia objetivo
- Confirmar que la documentación cubre todos los puntos de SPEC.md
- Validar ADR con Architecture Director
- Aprobar documentación para publicación

### 7. QA
**Output**: QA_REPORT.md
**Responsable**: Documentation Director
**Actividades**:
- Verificar enlaces internos y externos funcionan
- Probar ejemplos de código en entorno real
- Validar formato de salida (markdown renderizado correctamente)
- Revisar consistencia con documentación existente
- Verificar que no hay información contradictoria
- Certificar documentación lista para publicar

### 8. Documentation
**Output**: Updated docs (published)
**Responsable**: Documentation Director
**Actividades**:
- Publicar documentación en el repositorio
- Actualizar índices y tablas de contenido
- Notificar a los equipos afectados sobre la nueva documentación
- Archivar documentación reemplazada si aplica

### 9. Delivery
**Output**: Delivered artifact
**Responsable**: Documentation Director
**Actividades**:
- Crear PR con toda la documentación generada
- Obtener approval de revisores técnicos
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
