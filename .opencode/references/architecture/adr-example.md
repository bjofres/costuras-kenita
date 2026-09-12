# Architecture Decision Records (ADR)

## Format: MADR (Markdown Any Decision Records)

Each ADR captures a decision, its context, and consequences.

### ADR Template

```markdown
# ADR-{NNN}: {Title}

## Status

[Proposed | Accepted | Deprecated | Superseded by ADR-{NNN}]

## Context

What is the issue we're solving? What forces are at play?
Include constraints, assumptions, and alternative options.

## Decision

What did we decide and why? Be specific.

## Consequences

- **Positive**: What becomes easier?
- **Negative**: What trade-offs or costs?
- **Neutral**: What else changes?

## Compliance

How will we enforce this decision? (Code reviews, lint rules, tests)

## Notes

Links to related ADRs, RFCs, or discussions.
```

---

### ADR-001: Usar Prisma como ORM

```markdown
# ADR-001: Usar Prisma como ORM

## Status

Accepted

## Context

Necesitamos un ORM para la capa de persistencia. Evaluamos:

- **TypeORM**: Experiencia previa, pero decoradores acoplan entidades a la DB, migraciones frágiles
- **Prisma**: Schema-first, migraciones seguras, tipos generados automáticamente, DX superior
- **Drizzle**: Alternativa moderna, más cercana a SQL, pero ecosistema más pequeño
- **Knex**: SQL builder, sin ORM, más boilerplate

Criterios: seguridad de tipos, DX, migraciones, soporte de la comunidad, rendimiento.

## Decision

Usamos Prisma como ORM principal. Las entidades de dominio son independientes de Prisma; usamos un mapper entre Prisma records y domain entities.

## Consequences

- **+** Type safety total: el schema genera tipos para queries y mutations
- **+** Migraciones con `prisma migrate` son declarativas y revisables
- **+** Prisma Studio para debugging visual
- **-** Prisma genera un client pesado (~15MB en node_modules)
- **-** No soporta queries raw complejas tan fácil como Drizzle
- **-** Requiere mapper layer entre Prisma records y domain entities (no podemos usar Prisma types como entidades de dominio)

## Compliance

- Prisma schema es la fuente de verdad para la estructura de DB
- Todo acceso a DB pasa por repositorios que implementan interfaces de dominio
- No se permite `prisma.user.findMany()` directamente en use cases
```

---

### ADR-002: Migrar de REST a GraphQL

```markdown
# ADR-002: Migrar de REST a GraphQL para el API pública

## Status

Deprecated

## Context

API REST existente con múltiples endpoints. Problemas:

- Over-fetching y under-fetching en clientes móviles
- Múltiples round-trips para datos relacionados
- Documentación manual con Swagger siempre desactualizada
- Equipo frontend solicita más flexibilidad

Consideramos:

- **GraphQL (Apollo)**: Flexibilidad, tooling maduro, type generation
- **REST + JSON:API**: Estandarizado, caching HTTP simple
- **tRPC**: End-to-end typesafety, pero menos conocido

## Decision

Implementar GraphQL con Apollo Server. Las queries internas y CUD operations pueden coexistir con REST endpoints legacy.

## Consequences

- **+** Clientes piden exactamente lo que necesitan
- **+** Un solo endpoint, documentación auto-generada (GraphiQL)
- **+** TypeScript types generados desde el schema con GraphQL Codegen
- **-** Complejidad operativa: resolver N+1 con DataLoader
- **-** Caching HTTP más complejo (POST requests)
- **-** Costo de migración: clientes REST deben actualizarse
- **-** Rate limiting más complejo que REST

## Superseded by

ADR-003: Volver a REST con OpenAPI 3.1
```

---

### ADR-003: Usar NestJS con Controller-REST en vez de GraphQL

```markdown
# ADR-003: Usar NestJS + REST con OpenAPI 3.1

## Status

Accepted

## Context

Después de ADR-002, experimentamos GraphQL por 6 meses. Descubrimos:

- La flexibilidad de GraphQL no se usaba: los clientes consumían queries fijas
- El equipo backend perdía tiempo en resolver N+1 y optimizar resolvers
- El equipo frontend prefería endpoints REST familiares
- OpenAPI 3.1 + @nestjs/swagger genera docs precisas y tipos

## Decision

Volvemos a REST con NestJS controllers y documentación OpenAPI 3.1 automática.

## Consequences

- **+** Simplicidad operativa: caching HTTP, rate limiting, logging
- **+** @nestjs/swagger genera docs vivas sin esfuerzo
- **+** Rendimiento predecible (sin resolver overhead)
- **-** Clientes deben actualizar queries (de GraphQL a REST)
- **-** Posible under-fetching requiere endpoints específicos (ej: `GET /users/:id/profile`)

## Compliance

- Todo endpoint usa decoradores `@ApiTags`, `@ApiOperation`
- DTOs validados con `class-validator` y decorados con `@ApiProperty`
- Paginación unificada con `PaginatedResponse<T>`
