# PostgreSQL

## Objetivos
- Diseñar esquemas de base de datos PostgreSQL óptimos
- Escribir consultas eficientes usando features avanzadas
- Implementar estrategias de indexing y particionamiento
- Mantener la base de datos segura, performante y mantenible

## Best Practices
- Usar tipos de datos adecuados (JSONB sobre JSON, TIMESTAMPTZ sobre TIMESTAMP)
- Normalizar hasta 3FN, desnormalizar solo por rendimiento medido
- Indexar columnas usadas en WHERE, JOIN, ORDER BY y GROUP BY
- Usar EXPLAIN ANALYZE para optimizar consultas lentas
- Implementar full-text search con tsvector/tsquery en lugar de LIKE
- Usar CTEs para consultas complejas y recursivas
- Configurar VACUUM y ANALYZE automáticos
- Usar connection pooling con PgBouncer para manejar muchas conexiones

## Anti-Patterns
- Usar SERIAL para IDs en tablas grandes (preferir UUID o snowflake)
- Ignorar índices en columnas de búsqueda frecuente
- Hacer SELECT * en producción
- Usar LIKE '%texto%' para búsqueda (usar full-text search)
- No hacer VACUUM regularmente en tablas con muchas actualizaciones/borrados

## Errores Comunes
- Olvidar índices en foreign keys (no se crean automáticamente)
- No considerar el plan de ejecución para consultas complejas
- Usar tipos de datos incorrectos (VARCHAR vs TEXT, TIMESTAMP vs TIMESTAMPTZ)
- No configurar `statement_timeout` para consultas largas
- Conexiones sin cerrar o sin pool

## Checklist
- [ ] Tipos de datos correctos y consistentes
- [ ] Esquema normalizado (3FN)
- [ ] Índices en columnas de búsqueda y foreign keys
- [ ] EXPLAIN ANALYZE verificado para consultas críticas
- [ ] Full-text search configurado si requrido
- [ ] Particionamiento implementado para tablas grandes
- [ ] Conexiones con pool configurado
- [ ] Backups configurados y probados
- [ ] VACUUM configurado
- [ ] Seguridad: SSL, roles, políticas RLS

## Convenciones
- Nombres de tablas en snake_case plural: `users`, `blog_posts`
- Nombres de columnas en snake_case: `created_at`, `first_name`
- Primary keys: `id` con UUID o BIGSERIAL
- Foreign keys: `[tabla]_id` (ej: `user_id`)
- Timestamps: `created_at`, `updated_at`

## Ejemplos
```sql
-- Ejemplo de CTE con window function
WITH ranked_posts AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY author_id ORDER BY created_at DESC) as rn
  FROM posts
)
SELECT * FROM ranked_posts WHERE rn <= 5;
```

## Referencias Oficiales
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- PostgreSQL Performance Tips: https://wiki.postgresql.org/wiki/Performance_Optimization
- Use The Index, Luke: https://use-the-index-luke.com/
