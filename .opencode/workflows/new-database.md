# Nueva Base de Datos / Esquema (WF-07)

## Trigger
Issue etiquetado como `database` o `schema` para creación de nuevas tablas, colecciones, o esquemas de base de datos. Puede surgir de nueva funcionalidad o requerimiento de datos.

## Agentes Involucrados
- **Database Director**: diseño, implementación y revisión del esquema
- **Architecture Director**: aprobación del diseño de datos
- **Backend Lead**: validación de consultas y acceso a datos
- **QA Director**: pruebas de migración y datos
- **Documentation Director**: documentación del esquema

## Pipeline SDD

### 1. Discovery
**Output**: Discovery Brief
**Responsable**: Database Director
**Actividades**:
- Analizar requerimientos de almacenamiento de datos
- Identificar entidades, atributos y relaciones
- Evaluar volúmenes de datos esperados y proyección de crecimiento
- Revisar esquemas existentes para consistencia y evitar duplicación
- Determinar tipo de base de datos (relacional, documental, etc.)
- Documentar restricciones de consistencia y disponibilidad

### 2. Specification
**Output**: SPEC.md (Schema Spec)
**Responsable**: Database Director
**Actividades**:
- Definir entidades con atributos, tipos y restricciones
- Especificar relaciones entre entidades (1:1, 1:N, N:M)
- Documentar índices requeridos por consulta
- Definir políticas de soft-delete y auditoría
- Especificar reglas de integridad referencial
- Documentar estrategia de particionamiento si aplica
- Definir políticas de retención y purga de datos

### 3. Architecture
**Output**: ARCHITECTURE.md section / ADR
**Responsable**: Database Director + Architecture Director
**Actividades**:
- Diseñar modelo de datos conceptual y lógico
- Crear diagrama ER del nuevo esquema
- Decidir motor de base de datos y configuraciones
- Evaluar impacto en rendimiento de consultas existentes
- Definir estrategia de replicación y sharding si aplica
- Documentar decisiones en ADR
- Aprobar diseño con Architecture Director

### 4. Plan
**Output**: PLAN.md
**Responsable**: Database Director
**Actividades**:
- Desglosar trabajo en tareas (entidades, índices, migraciones)
- Estimar esfuerzo por entidad
- Definir orden de creación respetando dependencias referenciales
- Coordinar con Backend Lead para actualización de modelos ORM
- Planear ventana de migración con mínimo impacto

### 5. Implementation
**Output**: Working code (schema + migrations)
**Responsable**: Database Director
**Actividades**:
- Escribir migraciones para crear tablas y relaciones
- Definir índices y constraints según SPEC.md
- Implementar triggers o funciones si son necesarios
- Configurar políticas de acceso y permisos
- Crear seed data para desarrollo y pruebas
- Actualizar modelos ORM en la aplicación
- Ejecutar migraciones en entorno de desarrollo
- Verificar integridad de datos con queries de prueba

### 6. Review
**Output**: REVIEW.md
**Responsable**: Architecture Director + Backend Lead
**Actividades**:
- Revisar diseño del esquema contra SPEC.md
- Evaluar normalización y desnormalización
- Verificar índices cubren consultas críticas
- Confirmar políticas de retención y purga
- Revisar impacto en rendimiento de base de datos
- Aprobar migración

### 7. QA
**Output**: QA_REPORT.md
**Responsable**: QA Director + Database Director
**Actividades**:
- Ejecutar migraciones en entorno de staging
- Verificar integridad de datos post-migración
- Probar consultas críticas con volúmenes de datos realistas
- Ejecutar pruebas de rendimiento de queries
- Verificar rollback de migración
- Probar políticas de acceso y permisos
- Certificar esquema listo para producción

### 8. Documentation
**Output**: Updated docs
**Responsable**: Documentation Director
**Actividades**:
- Actualizar diagrama ER en documentación técnica
- Documentar tablas, columnas y relaciones nuevas
- Agregar ejemplos de consultas comunes
- Actualizar CHANGELOG.md con cambios de esquema

### 9. Delivery
**Output**: Delivered artifact
**Responsable**: Database Director
**Actividades**:
- Crear PR con migraciones y documentación de esquema
- Obtener approval de revisores
- Ejecutar migración en producción siguiendo plan
- Verificar estado post-migración en producción

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
