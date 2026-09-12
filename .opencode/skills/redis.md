# Redis

## Objetivos
- Implementar Redis como capa de caché, sesiones, colas y mensajería
- Seleccionar la estructura de datos adecuada para cada caso de uso
- Configurar persistencia, replicación y alta disponibilidad
- Optimizar el uso de memoria y prevenir problemas comunes

## Best Practices
- Elegir la estructura de datos correcta: Strings para caché simple, Hashes para objetos, Sets para membresía, Sorted Sets para rankings, Streams para colas
- Configurar `maxmemory` y política de evicción adecuada (allkeys-lru para caché, noeviction para datos persistentes)
- Usar `SCAN` en lugar de `KEYS` en producción
- Implementar `EXPIRE` en todas las keys de caché
- Usar pipelining para múltiples comandos
- Configurar `connection pool` para reutilizar conexiones
- Implementar distributed locks con Redlock para recursos compartidos

## Anti-Patterns
- Usar Redis como base de datos primaria sin estrategia de persistencia
- Usar `KEYS *` en producción (bloquea el servidor)
- Almacenar objetos grandes (> 1MB) en Redis (considerar otros stores)
- No configurar `maxmemory` (puede causar OOM)
- Ignorar la latencia de red en aplicaciones que requrien respuestas en microsegundos

## Errores Comunes
- Sesiones de usuario sin expiración
- Cache stampede sin protección (usar locking o stale-while-revalidate)
- Usar Redis para datos que cambian frecuentemente sin estrategia de invalidación
- No monitorear el hit rate de caché
- Usar transacciones WATCH/MULTI/EXEC cuando Lua scripting es mejor opción

## Checklist
- [ ] maxmemory y eviction policy configurados
- [ ] Persistencia RDB/AOF configurada según requsito
- [ ] No se usa KEYS (SCAN en su lugar)
- [ ] TTL configurado en todas las keys de caché
- [ ] Conexiones con pool (ioredis)
- [ ] TLS configurado para producción
- [ ] Monitorización configurada (INFO, SLOWLOG, latency mon)
- [ ] Tests de integración con Redis
- [ ] Cluster o Sentinel configurado para HA

## Convenciones
- Keys con formato: `[app]:[entity]:[id]:[field]` (ej: `myapp:user:123:profile`)
- TTL definido en constantes: `CACHE_TTL.SHORT = 60`, `CACHE_TTL.MEDIUM = 300`, `CACHE_TTL.LONG = 3600`
- Nombres de streams: `[entity]:events` (ej: `order:events`)

## Ejemplos
```typescript
// Ejemplo de caching con Redis y ioredis
const user = await redis.get(`user:${id}`)
if (!user) {
  const userData = await db.user.findUnique({ where: { id } })
  await redis.setex(`user:${id}`, 3600, JSON.stringify(userData))
  return userData
}
return JSON.parse(user)
```

## Referencias Oficiales
- Redis Documentation: https://redis.io/documentation
- Redis Best Practices: https://redis.io/docs/manual/keyspace-notifications/
- Redis Latency: https://redis.io/docs/manual/optimization/latency/
