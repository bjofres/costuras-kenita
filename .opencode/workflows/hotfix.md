# Hotfix (WF-10)

## Trigger
Bug crítico en producción que requiere corrección inmediata. Issue etiquetado como `hotfix` con severidad crítica o blocker.

## Agentes Involucrados
- **Especialista Relevante**: análisis e implementación de la corrección
- **Architecture Director**: aprobación rápida de cambios
- **QA Director**: verificación acelerada (puede ser bypassada con justificación)
- **DevOps Lead**: despliegue directo a producción
- **Documentation Director**: documentación post-fix

## Pipeline SDD (Fast Track)

### 1. Discovery
**Output**: Discovery Brief (rápido)
**Responsable**: Especialista Relevante
**Actividades**:
- Reproducir el bug en entorno de producción o staging
- Identificar causa raíz con la información disponible
- Evaluar impacto inmediato en usuarios y negocio
- Documentar solución propuesta en no más de 30 minutos
- Decidir si es candidato a hotfix o puede esperar release regular

### 2. Specification
**Output**: SPEC.md (mínimo)
**Responsable**: Especialista Relevante
**Actividades**:
- Redactar spec mínimo: qué cambia y por qué
- Documentar efectos secundarios conocidos o potenciales
- Definir verificación mínima para confirmar fix
- Mantener alcance estrictamente acotado

### 3. Architecture
**Output**: Skipped (solo revisión rápida)
**Responsable**: Architecture Director (consulta rápida)
**Actividades**:
- Evaluar si el cambio requiere revisión arquitectónica (máximo 15 min)
- Si no hay cambio arquitectónico, saltar etapa
- Si hay cambio, documentar en ADR exprés post-fix

### 4. Plan
**Output**: PLAN.md (mínimo)
**Responsable**: Especialista Relevante
**Actividades**:
- Definir archivos a modificar
- Estimar tiempo de implementación y verificación
- Coordinar despliegue directo con DevOps Lead
- Planificar rollback inmediato si el fix falla

### 5. Implementation
**Output**: Working code (hotfix)
**Responsable**: Especialista Relevante
**Actividades**:
- Implementar cambio mínimo y quirúrgico
- Escribir test que cubra el bug
- Ejecutar lint y typecheck en archivos modificados
- Verificar localmente que el fix funciona
- NO introducir cambios no relacionados

### 6. Review
**Output**: REVIEW.md (exprés)
**Responsable**: Especialista Relevante + Architecture Director
**Actividades**:
- Revisión rápida del cambio (máximo 15 minutos)
- Verificar que el cambio resuelve el bug sin regresiones
- Confirmar que no hay impacto en seguridad
- Aprobar para despliegue inmediato

### 7. QA
**Output**: QA_REPORT.md (opcional)
**Responsable**: QA Director
**Actividades**:
- Verificar fix en entorno de staging si es posible (máximo 30 min)
- Si no es posible, bypass documentado con justificación de urgencia
- Ejecutar tests automatizados del módulo afectado
- Certificar o aceptar riesgo de bypass

### 8. Documentation
**Output**: Updated docs
**Responsable**: Documentation Director
**Actividades**:
- Documentar hotfix en CHANGELOG.md con prefijo HOTFIX
- Registrar causa raíz y solución aplicada
- Crear issue de follow-up para mejora permanente si aplica

### 9. Delivery
**Output**: Delivered artifact
**Responsable**: Especialista Relevante + DevOps Lead
**Actividades**:
- Crear rama hotfix desde main/master
- Desplegar directamente a producción con monitoreo en vivo
- Verificar en producción que el bug está resuelto
- Fusionar hotfix a main y ramas de desarrollo activas

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
