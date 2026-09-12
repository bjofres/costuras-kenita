# Docker

## Objetivos
- Crear imágenes Docker optimizadas y seguras
- Implementar multi-stage builds para imágenes pequeñas
- Orquestar servicios con docker-compose para desarrollo y producción
- Integrar Docker en el pipeline de CI/CD

## Best Practices
- Usar multi-stage builds para separar build de runtime
- Usar imágenes base Alpine o slim para reducir tamaño
- Implementar .dockerignore para excluir archivos innecesarios
- Ejecutar contenedores como non-root user
- Usar health checks para que Docker maneje contenedores caídos
- Limitar recursos con --memory y --cpus
- Cachear capas de Dockerfile (instalar dependencias antes de copiar código)
- Usar etiquetas semánticas y no `latest` en producción

## Anti-Patterns
- Usar imágenes enormes (node:latest en lugar de node:20-alpine)
- Copiar node_modules o archivos de build intermedios
- Ejecutar como root en producción
- Usar `latest` como tag en producción
- Ignorar el orden de capas (lo que cambia frecuentemente debe ir al final)
- No limpiar cache de apt/apk

## Errores Comunes
- Olvidar .dockerignore (copia node_modules, .env, etc.)
- Capas demasiado grandes y sin cache aprovechable
- Contenedores que corren como root
- No configurar restart policy
- Exponer puertos innecesarios
- No limpiar archivos temporales en la misma capa

## Checklist
- [ ] Multi-stage build implementado
- [ ] Imagen base Alpine o slim
- [ ] Non-root user configurado
- [ ] .dockerignore creado
- [ ] HEALTHCHECK configurado
- [ ] Recursos limitados (memory, cpus)
- [ ] Tags semánticos (no latest)
- [ ] Capas optimizadas (deps → build → app)
- [ ] docker-compose para desarrollo
- [ ] Escaneo de vulnerabilidades (Trivy, Docker Scout)

## Convenciones
- Multi-stage: `builder` para build, copiar solo artifacts a `production`
- Etiquetas: `[app]:[semver]` o `[app]:[commit-sha]`
- docker-compose services: `app`, `db`, `redis`, `queue`
- Red: crear network interna para servicios backend

## Ejemplos
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health
CMD ["node", "dist/main.js"]
```

## Referencias Oficiales
- Docker Best Practices: https://docs.docker.com/develop/dev-best-practices/
- Dockerfile Reference: https://docs.docker.com/engine/reference/builder/
- Docker Compose: https://docs.docker.com/compose/
