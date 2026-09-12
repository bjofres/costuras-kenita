# Nueva Migración de Base de Datos (WF-08)

## Trigger
Issue etiquetado como `migration` para modificar esquema de base de datos existente. Puede surgir de nueva funcionalidad, refactorización o corrección de datos.

## Agentes Involucrados
- **Database Director**: diseño e implementación de la migración
- **Backend Lead**: revisión de impacto en capa de datos y modelos ORM
- **Architecture Director**: aprobación de cambios estructurales
- **QA Director**: pruebas de migración y rollback
- **Documentation Director**: documentación del cambio

## Pipeline SDD

### 1. Discovery
**Output**: Discovery Brief
**Responsable**: Database Director
**Actividades**:
- Analizar el cambio requerido en el esquema
- Identificar tablas, columnas o índices afectados
- Evaluar volumen de datos existentes a migrar
- Revisar dependencias con otras tablas y servicios
- Documentar riesgo de la migración (bloqueante vs no bloqueante)
- Identificar ventana de mantenimiento necesaria

### 2. Specification
**Output**: SPEC.md (Migration Spec)
**Responsable**: Database Director
**Actividades**:
- Describir el cambio exacto del esquema (before/after)
- Especificar estrategia de migración forward
- Documentar plan de rollback detallado
- Definir validaciones de integridad pre y post migración
- Especificar impacto en datos existentes
- Documentar estrategia de zero-downtime (expand-migrate-contract)
- Definir tiempos estimados por fase de migración

### 3. Architecture
**Output**: ARCHITECTURE.md section / ADR
**Responsable**: Architecture Director + Database Director
**Actividades**:
- Evaluar impacto arquitectónico del cambio de esquema
- Decidir estrategia de migración (blue-green, parallel, etc.)
- Definir orden de operaciones para evitar tiempos muertos
- Documentar decisiones en ADR
- Aprobar plan de migración y rollback

### 4. Plan
**Output**: PLAN.md
**Responsable**: Database Director
**Actividades**:
- Desglosar pasos de la migración con tiempos estimados
- Definir orden de ejecución de cambios
- Establecer puntos de verificación intermedia
- Programar ventana de ejecución con mínimo tráfico
- Coordinar con Backend Lead para despliegue coordinado
- Preparar script de rollback verificable

### 5. Implementation
**Output**: Working code (migration scripts)
**Responsable**: Database Director
**Actividades**:
- Escribir migración forward con SQL/ORM
- Implementar script de rollback
- Agregar validaciones de datos pre-migración
- Probar migración en entorno local con datos realistas
- Verificar tiempos de ejecución con volúmenes reales
- Actualizar modelos ORM y seeds si es necesario
- Escribir tests de migración (forward + rollback)

### 6. Review
**Output**: REVIEW.md
**Responsable**: Backend Lead + Architecture Director
**Actividades**:
- Revisar script de migración y rollback
- Verificar estrategia zero-downtime
- Evaluar impacto en servicios en ejecución
- Confirmar validaciones de integridad
- Revisar estimación de tiempos
- Aprobar plan de ejecución

### 7. QA
**Output**: QA_REPORT.md
**Responsable**: QA Director + Database Director
**Actividades**:
- Ejecutar migración en entorno de staging
- Verificar integridad de datos post-migración
- Probar rollback completo y validar datos restaurados
- Ejecutar queries críticas para verificar rendimiento
- Probar migración con datos de tamaño realista
- Verificar que no hay downtime durante la migración
- Certificar migración lista para producción

### 8. Documentation
**Output**: Updated docs
**Responsable**: Documentation Director
**Actividades**:
- Documentar el cambio de esquema realizado
- Actualizar diagrama ER si aplica
- Registrar en CHANGELOG.md con instrucciones de rollback
- Documentar lecciones aprendidas para futuras migraciones

### 9. Delivery
**Output**: Delivered artifact
**Responsable**: Database Director
**Actividades**:
- Crear PR con scripts de migración y rollback
- Obtener approval de revisores
- Ejecutar migración en producción en ventana planificada
- Monitorear logs y métricas post-ejecución
- Verificar estado del esquema y datos en producción

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
