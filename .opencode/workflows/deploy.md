# Despliegue (WF-09)

## Trigger
Issue etiquetado como `deploy` o `release` para desplegar cambios a producción. Puede activarse por release programado, hotfix o despliegue canario.

## Agentes Involucrados
- **Architecture Director**: aprobación y supervisión del despliegue
- **DevOps Lead**: ejecución del pipeline CI/CD
- **Backend Lead**: coordinación de despliegue de servicios backend
- **Frontend Lead**: coordinación de despliegue de frontend
- **QA Director**: verificación post-despliegue
- **Database Director**: ejecución de migraciones si aplica
- **Documentation Director**: actualización de changelog

## Pipeline SDD

### 1. Discovery
**Output**: Discovery Brief
**Responsable**: Architecture Director
**Actividades**:
- Revisar lista de cambios incluidos en el release
- Identificar dependencias de despliegue (migraciones, variables de entorno)
- Evaluar riesgos del despliegue (breaking changes, compatibilidad)
- Documentar estrategia de rollout (canary, blue-green, rolling update)
- Definir criterios de rollback automáticos

### 2. Specification
**Output**: SPEC.md (Deploy Plan)
**Responsable**: Architecture Director
**Actividades**:
- Definir orden de despliegue de servicios
- Especificar configuración de infraestructura
- Documentar variables de entorno y secrets necesarios
- Definir health checks y readiness probes
- Especificar estrategia de canary (porcentajes, duración, métricas)
- Documentar playbook de rollback paso a paso
- Definir métricas de éxito del despliegue (error rate, latency, throughput)

### 3. Architecture
**Output**: ARCHITECTURE.md section
**Responsable**: Architecture Director + DevOps Lead
**Actividades**:
- Revisar configuración de infraestructura como código
- Validar arquitectura de despliegue (redundancia, alta disponibilidad)
- Definir políticas de auto-scaling si aplica
- Evaluar cambios en DNS, CDN o load balancers
- Documentar decisiones arquitectónicas de infraestructura

### 4. Plan
**Output**: PLAN.md
**Responsable**: Architecture Director + DevOps Lead
**Actividades**:
- Desglosar pasos del despliegue en orden cronológico
- Estimar duración de cada fase
- Definir ventana de despliegue y participantes on-call
- Establecer puntos de go/no-go
- Coordinar equipos involucrados y comunicación
- Preparar sala de guerra (war room) para incidentes

### 5. Implementation
**Output**: Working code (deployment)
**Responsable**: DevOps Lead
**Actividades**:
- Ejecutar pipeline CI/CD para construir artefactos
- Desplegar en entorno de staging para validación final
- Ejecutar migraciones de base de datos si aplica
- Desplegar en producción con estrategia definida (canary/blue-green)
- Monitorear métricas y logs en tiempo real
- Ejecutar smoke tests automatizados post-despliegue
- Escalar canary a 100% si métricas son positivas

### 6. Review
**Output**: REVIEW.md
**Responsable**: Architecture Director
**Actividades**:
- Revisar métricas de rendimiento post-despliegue
- Verificar error rates y latencias dentro de umbrales
- Confirmar que health checks pasan en todos los nodos
- Evaluar necesidad de rollback
- Documentar resultados del despliegue

### 7. QA
**Output**: QA_REPORT.md
**Responsable**: QA Director
**Actividades**:
- Ejecutar smoke tests en producción
- Realizar pruebas de integración post-despliegue
- Verificar funcionalidades críticas manualmente
- Monitorear alertas y dashboards
- Certificar que el despliegue es exitoso

### 8. Documentation
**Output**: Updated docs
**Responsable**: Documentation Director
**Actividades**:
- Actualizar CHANGELOG.md con versión y cambios
- Documentar configuración de infraestructura si cambió
- Actualizar runbooks de despliegue y rollback
- Registrar lecciones aprendidas del despliegue

### 9. Delivery
**Output**: Delivered artifact
**Responsable**: Architecture Director
**Actividades**:
- Marcar release como completado en sistema de tracking
- Notificar a stakeholders del despliegue exitoso
- Confirmar versión desplegada en producción

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
