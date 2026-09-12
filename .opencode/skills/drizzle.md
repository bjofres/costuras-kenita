# Drizzle ORM

## Objetivos
- Implementar capa de acceso a datos con Drizzle ORM y TypeScript
- Escribir queries tipadas y seguras con API SQL-like
- Gestionar migraciones de esquema con Drizzle Kit
- Optimizar rendimiento con prepared statements y queries raw

## Best Practices
- Definir esquemas con tipos inferidos automáticamente
- Usar joins explícitos para evitar N+1 queries
- Implementar prepared statements para queries ejecutadas frecuentemente
- Usar `sql` template literal para queries raw type-safe
- Configurar relaciones entre tablas para joins tipados
- Usar Drizzle Kit para generar y aplicar migraciones
- Aprovechar los operadores de Drizzle para filtering complejo
- Transacciones con `db.transaction` para operaciones atómicas

## Anti-Patterns
- Usar Drizzle para CRUD simple sin joins (Prisma es más productivo aquí)
- Ignorar el tipado de retorno de las queries
- Hacer múltiples queries separadas donde un join sería suficiente
- Usar raw SQL sin tipado cuando hay API de Drizzle disponible
- No usar prepared statements en queries repetitivas
- Ejecutar migraciones sin revisión en producción

## Errores Comunes
- Olvidar tipar los parámetros de las queries
- No usar `.$type` para tipos personalizados en columnas
- Relaciones mal definidas que causan joins incorrectos
- No considerar que Drizzle es eager por defecto en las relaciones
- Mezclar migraciones de Drizzle con otras herramientas sin coordinación

## Checklist
- [ ] Esquema Drizzle con tipos correctos
- [ ] Relaciones definidas y probadas
- [ ] Migraciones generadas y aplicadas
- [ ] Joins usados en lugar de queries separadas
- [ ] Prepared statements para queries frecuentes
- [ ] Transacciones implementadas donde sea necesario
- [ ] Tests de integración con Drizzle
- [ ] Documentación de queries principales

## Convenciones
- Schemas en `src/db/schema/` separados por entidad
- Migraciones en `src/db/migrations/`
- Relaciones nombradas: `userRelations`, `postRelations`
- Queries en servicios o repositorios, nunca en controladores

## Ejemplos
```typescript
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Query con join
const result = await db
  .select()
  .from(users)
  .leftJoin(posts, eq(users.id, posts.authorId))
  .where(eq(users.id, userId))
```

## Referencias Oficiales
- Drizzle ORM Documentation: https://orm.drizzle.team/docs/overview
- Drizzle Kit: https://orm.drizzle.team/kit-docs/overview
- Drizzle vs Prisma: https://orm.drizzle.team/docs/drizzle-vs-prisma
