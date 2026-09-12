# Corrección de Bug (WF-02)

## Trigger
Issue etiquetado como `bug` reportado por usuario, QA o sistema de monitoreo. Prioridad según severidad.

## Agentes Involucrados
- **Especialista Relevante**: análisis de causa raíz e implementación de la corrección
- **QA Director**: plan de pruebas de regresión
- **Review Director**: revisión de la corrección
- **Documentation Director**: actualización de documentación si aplica

## Pipeline SDD

### 1. Discovery
**Output**: Discovery Brief (Root Cause Analysis)
**Responsable**: Especialista Relevante
**Actividades**:
- Reproducir el bug en entorno de desarrollo
- Revisar logs, trazas y métricas del sistema
- Identificar la causa raíz del fallo
- Documentar el escenario exacto de reproducción
- Evaluar el impacto en usuarios y sistemas
- Determinar si existen bugs similares en otras áreas

### 2. Specification
**Output**: SPEC.md (fix spec)
**Responsable**: Especialista Relevante
**Actividades**:
- Definir qué debe hacer la corrección (comportamiento esperado)
- Especificar los cambios mínimos necesarios
- Documentar casos borde que la corrección debe cubrir
- Describir cómo verificar que el bug está resuelto
- Identificar efectos secundarios potenciales

### 3. Architecture
**Output**: ARCHITECTURE.md section (si aplica)
**Responsable**: Architecture Director
**Actividades**:
- Evaluar si la corrección requiere cambios arquitectónicos
- Determinar si el bug revela una debilidad estructural
- Aprobar o rechazar cambios arquitectónicos propuestos
- Documentar decisión en ADR si hay cambio significativo

### 4. Plan
**Output**: PLAN.md
**Responsable**: Especialista Relevante
**Actividades**:
- Listar archivos a modificar con estimación
- Definir orden de cambios para evitar regresiones
- Estimar tiempo total de implementación y pruebas
- Coordinar con QA para ventana de verificación

### 5. Implementation
**Output**: Working code (fix)
**Responsable**: Especialista Relevante
**Actividades**:
- Implementar la corrección con cambios mínimos
- Agregar test que reproduzca el bug y pruebe la solución
- Verificar que la corrección no rompe tests existentes
- Ejecutar lint y typecheck antes de commit
- Realizar prueba manual de la funcionalidad afectada

### 6. Review
**Output**: REVIEW.md
**Responsable**: Review Director + Especialista Relevante
**Actividades**:
- Revisar que la corrección resuelva la causa raíz
- Verificar que no introduzca nuevas vulnerabilidades
- Confirmar cobertura del test del bug
- Evaluar simplicidad y minimalidad del cambio
- Aprobar o solicitar ajustes

### 7. QA
**Output**: QA_REPORT.md
**Responsable**: QA Director
**Actividades**:
- Ejecutar suite completa de tests automatizados
- Realizar pruebas de regresión en áreas afectadas
- Verificar la corrección en entorno de staging
- Probar escenarios de borde documentados en SPEC.md
- Certificar que el bug está resuelto

### 8. Documentation
**Output**: Updated docs
**Responsable**: Documentation Director
**Actividades**:
- Documentar el bug y su corrección en CHANGELOG.md
- Actualizar documentación de API si el fix cambió comportamiento
- Agregar entrada en base de conocimiento de bugs conocidos

### 9. Delivery
**Output**: Delivered artifact
**Responsable**: Especialista Relevante
**Actividades**:
- Crear PR con referencia al issue y análisis de causa raíz
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
