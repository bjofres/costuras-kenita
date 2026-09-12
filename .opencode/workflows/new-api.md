# Nueva API (WF-04)

## Trigger
Issue etiquetado como `api` o `backend` para creación de nuevo endpoint o servicio API. Puede originarse de una nueva funcionalidad o requerimiento de integración.

## Agentes Involucrados
- **Backend Lead**: diseño e implementación de la API
- **Database Director**: diseño de esquemas de datos
- **Auth Expert**: diseño de autenticación y autorización
- **Security Expert**: revisión de seguridad
- **QA Director**: plan de pruebas de API
- **Documentation Director**: documentación de API
- **Frontend Lead**: validación de contratos si hay consumidor frontend

## Pipeline SDD

### 1. Discovery
**Output**: Discovery Brief
**Responsable**: Backend Lead
**Actividades**:
- Analizar requerimientos funcionales de la API
- Identificar consumidores de la API (frontend, third-party, sistemas internos)
- Evaluar necesidades de autenticación y autorización
- Revisar APIs existentes para consistencia
- Documentar restricciones de rendimiento y disponibilidad
- Identificar límites de rate y cuotas necesarias

### 2. Specification
**Output**: SPEC.md (API Contract)
**Responsable**: Backend Lead
**Actividades**:
- Definir endpoints con métodos HTTP y rutas RESTful
- Especificar request/response bodies con tipos y validación
- Documentar headers requeridos y códigos de estado
- Definir esquemas de autenticación (JWT, OAuth, API keys)
- Especificar políticas de autorización por endpoint
- Documentar manejo de errores con formato estandarizado
- Definir límites de rate limiting y paginación

### 3. Architecture
**Output**: ARCHITECTURE.md section / ADR
**Responsable**: Backend Lead + Architecture Director
**Actividades**:
- Diseñar la arquitectura del servicio o controlador
- Decidir entre REST, GraphQL o gRPC según el caso
- Definir capas de middleware (auth, logging, validación)
- Diseñar esquema de base de datos con Database Director
- Documentar decisiones en ADR para cambios significativos
- Evaluar impacto en arquitectura existente

### 4. Plan
**Output**: PLAN.md
**Responsable**: Backend Lead
**Actividades**:
- Desglosar implementación por endpoints
- Estimar esfuerzo por endpoint y capa
- Definir orden de implementación óptimo
- Planear despliegue en paralelo con feature flags
- Coordinar con Frontend Lead para consumo de API

### 5. Implementation
**Output**: Working code (API)
**Responsable**: Backend Lead
**Actividades**:
- Implementar modelos y migraciones de base de datos
- Desarrollar controladores con validación de entrada
- Implementar lógica de negocio y servicios
- Agregar autenticación y autorización por endpoint
- Escribir tests unitarios e integrales de API
- Documentar con OpenAPI/Swagger inline
- Ejecutar lint, typecheck y tests completos

### 6. Review
**Output**: REVIEW.md
**Responsable**: Review Director + Security Expert + Architecture Director
**Actividades**:
- Revisar contrato API contra SPEC.md
- Evaluar seguridad de endpoints (OWASP top 10)
- Verificar manejo correcto de errores y edge cases
- Confirmar cobertura de tests
- Revisar rendimiento de queries y uso de índices
- Aprobar cambios

### 7. QA
**Output**: QA_REPORT.md
**Responsable**: QA Director
**Actividades**:
- Ejecutar tests de integración contra API real
- Probar autenticación y autorización exhaustivamente
- Realizar pruebas de carga y estrés
- Verificar rate limiting y throttling
- Probar documentación OpenAPI interactivamente
- Certificar cumplimiento del contrato API

### 8. Documentation
**Output**: Updated docs
**Responsable**: Documentation Director
**Actividades**:
- Publicar documentación OpenAPI actualizada
- Agregar ejemplos de uso en guía de API
- Documentar flujos de autenticación
- Actualizar CHANGELOG.md con nuevos endpoints

### 9. Delivery
**Output**: Delivered artifact
**Responsable**: Backend Lead
**Actividades**:
- Crear PR con especificación y cambios de API
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
