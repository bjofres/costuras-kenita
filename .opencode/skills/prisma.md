# Prisma ORM

## Objetivos
- Diseñar esquemas de base de datos con Prisma de manera óptima
- Gestionar migraciones de forma segura y predecible
- Escribir consultas eficientes evitando N+1 y problemas de rendimiento
- Mantener la capa de datos limpia, tipada y mantenible

## Best Practices
- Usar `select` siempre para traer solo los campos necesarios
- Usar `include` con relaciones en lugar de queries separadas
- Implementar `middleware` para soft delete, audit logging y timestamps automáticos
- Usar `batch` queries para operaciones masivas
- Configurar connection pooling con Prisma Accelerate o PgBouncer
- Usar `raw` queries solo cuando sea estrictamente necesario
- Mantener el schema como fuente de verdad única
- Versionar migraciones y revisarlas antes de aplicar

## Anti-Patterns
- Hacer N+1 queries por no usar `include` en relaciones
- Usar `findMany` sin `select` en modelos grandes (trae todo)
- Ejecutar `prisma db push` en producción en lugar de migraciones
- Ignorar el tipo de retorno y usar `any`
- Poner lógica de negocio en queries de Prisma

## Errores Comunes
- Olvidar incluir relaciones en queries (N+1 automático)
- Migraciones conflictivas en equipo (no usar db push en desarrollo compartido)
- No manejar errores de conexión a la base de datos
- Usar `deleteMany` sin `where` (borra todo)
- No cerrar conexiones en serverless (connection pool overflow)

## Checklist
- [ ] Schema con tipos correctos y relaciones definidas
- [ ] Migraciones versionadas y revisadas
- [ ] Queries optimizadas (select, include, batch)
- [ ] Middlewares implementados (soft delete, audit)
- [ ] Connection pooling configurado
- [ ] Tests de integración con Prisma
- [ ] Prisma Studio accesible para debugging
- [ ] Sin N+1 queries en flujos críticos

## Convenciones
- Modelos en PascalCase, campos en camelCase
- Relaciones nombradas explícitamente con `@@map` para tablas
- Enums definidos en Prisma, no en código
- Migraciones nombradas descriptivamente: `add_user_profile`

## Ejemplos
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?
}
```

## Referencias Oficiales
- Prisma Documentation: https://www.prisma.io/docs
- Prisma Best Practices: https://www.prisma.io/docs/guides/performance
- Prisma Accelerate: https://www.prisma.io/accelerate
