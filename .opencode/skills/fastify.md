# Fastify

## Objetivos
- Construir APIs de alto rendimiento con Fastify
- Implementar plugins, hooks, validación y serialización eficientes
- Aprovechar el sistema de esquemas JSON para validación y serialización automática
- Integrar Fastify con TypeScript, Prisma y autenticación

## Best Practices
- Usar esquemas JSON (JSON Schema o TypeBox) para validación y serialización
- Implementar hooks en lugar de middleware para mejor rendimiento (onRequest, preHandler, onSend)
- Aprovechar el plugin system para encapsular funcionalidad
- Usar decorators para extender la request/response con datos adicionales
- Configurar Swagger con @fastify/swagger para documentación automática
- Usar TypeBox para validación con tipos TypeScript inferidos
- Implementar error handler personalizado para respuestas consistentes

## Anti-Patterns
- No usar esquemas de validación (pierdes rendimiento y seguridad)
- Poner lógica de negocio en hooks
- Ignorar el encapsulation de plugins (no compartir estado accidentalmente)
- Usar middleware Express-style cuando hay hooks específicos de Fastify
- No serializar respuestas (JSON.stringify manual)

## Errores Comunes
- Olvidar registrar plugins antes de usarlos
- No manejar errores de validación (400 Bad Request automático no configurado)
- Ignorar el orden de hooks y plugins (se ejecutan en orden de registro)
- No cerrar conexiones en serverless
- Usar body-parser manual (Fastify ya lo incluye)

## Checklist
- [ ] Esquemas JSON/TypeBox para todas las rutas
- [ ] Swagger configurado y documentación generada
- [ ] Hooks implementados para auth, logging, errores
- [ ] Plugins organizados y encapsulados
- [ ] Error handler personalizado
- [ ] CORS configurado con @fastify/cors
- [ ] Rate limiting con @fastify/rate-limit
- [ ] Tests de integración con `inject`
- [ ] Helmet configurado con @fastify/helmet

## Convenciones
- Plugins: `plugin-name.plugin.ts`
- Rutas: `*.routes.ts` con schemas en el mismo archivo
- Schemas separados: `*.schema.ts` con TypeBox
- Tests de ruta cerca de la ruta: `*.test.ts`

## Ejemplos
```typescript
import Fastify from 'fastify'
const app = Fastify({ logger: true })

app.get('/users/:id', {
  schema: {
    params: Type.Object({ id: Type.String() }),
    response: { 200: userSchema }
  }
}, async (request, reply) => {
  const { id } = request.params
  return await userService.findById(id)
})
```

## Referencias Oficiales
- Fastify Documentation: https://fastify.dev/docs/latest/
- Fastify TypeBox: https://github.com/fastify/type-providers
- Fastify Swagger: https://github.com/fastify/fastify-swagger
