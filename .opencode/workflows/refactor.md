# Refactorización (WF-03)

## Trigger
Solicitud de refactorización por deuda técnica, revisión de arquitectura, o preparación para nueva funcionalidad. Issue etiquetado como `refactor`.

## Agentes Involucrados
- **Architecture Director**: diseño y aprobación del plan de refactorización
- **Especialista Relevante**: implementación de cambios por módulo
- **QA Director**: plan de pruebas de regresión exhaustivas
- **Documentation Director**: actualización de documentación técnica
- **Review Director**: revisión de calidad y consistencia

## Pipeline SDD

### 1. Discovery
**Output**: Discovery Brief
**Responsable**: Architecture Director
**Actividades**:
- Identificar módulos candidatos a refactorizar
- Analizar métricas de complejidad ciclomática y acoplamiento
- Revisar deuda técnica acumulada en el código
- Documentar problemas actuales y beneficios esperados
- Evaluar riesgo de regresión por módulo
- Definir alcance y límites de la refactorización

### 2. Specification
**Output**: SPEC.md
**Responsable**: Architecture Director
**Actividades**:
- Definir objetivos concretos de la refactorización
- Especificar cambios estructurales sin alterar comportamiento
- Documentar interfaces y contratos que deben permanecer estables
- Describir el estado destino deseado (estado futuro)
- Definir criterios de éxito medibles

### 3. Architecture
**Output**: ARCHITECTURE.md section / ADR
**Responsable**: Architecture Director
**Actividades**:
- Diseñar la nueva estructura de módulos y dependencias
- Definir patrones de diseño a aplicar o eliminar
- Crear diagramas de arquitectura antes y después
- Documentar decisiones arquitectónicas en ADR
- Validar que la nueva arquitectura cumple principios SOLID
- Aprobar plan con stakeholders técnicos

### 4. Plan
**Output**: PLAN.md
**Responsable**: Architecture Director + Especialista Relevante
**Actividades**:
- Desglosar refactorización en fases incrementales
- Definir hitos con funcionalidad intacta al final de cada fase
- Establecer estrategia de feature flags si es necesario
- Programar ventanas de bajo tráfico para cambios críticos
- Coordinar con QA para pruebas después de cada fase

### 5. Implementation
**Output**: Working code (refactored)
**Responsable**: Especialista Relevante
**Actividades**:
- Ejecutar refactorización siguiendo el plan por fases
- Mantener tests verdes durante todo el proceso
- Aplicar cambios estructurales sin modificar comportamiento
- Renombrar símbolos y archivos según convenciones
- Eliminar código muerto o deprecado
- Ejecutar lint, typecheck y tests completos tras cada fase

### 6. Review
**Output**: REVIEW.md
**Responsable**: Review Director + Architecture Director
**Actividades**:
- Revisar que el comportamiento no haya cambiado
- Verificar mejora en métricas de calidad
- Confirmar eliminación de deuda técnica planificada
- Evaluar legibilidad y mantenibilidad del nuevo código
- Aprobar cada fase antes de continuar a la siguiente

### 7. QA
**Output**: QA_REPORT.md
**Responsable**: QA Director
**Actividades**:
- Ejecutar suite completa de tests automatizados
- Realizar pruebas de regresión exhaustivas en todos los módulos
- Probar integraciones con sistemas externos
- Ejecutar benchmarks para detectar degradación de rendimiento
- Certificar que el comportamiento externo es idéntico

### 8. Documentation
**Output**: Updated docs
**Responsable**: Documentation Director
**Actividades**:
- Actualizar diagramas de arquitectura en documentación
- Reflejar cambios de estructura en guías de desarrollo
- Documentar decisiones arquitectónicas en CHANGELOG.md
- Actualizar referencias a módulos renombrados

### 9. Delivery
**Output**: Delivered artifact
**Responsable**: Architecture Director
**Actividades**:
- Crear PR con resumen de cambios y métricas de mejora
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
