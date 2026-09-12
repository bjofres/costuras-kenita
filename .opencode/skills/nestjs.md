# NestJS

## Objetivos
- Construir aplicaciones backend modulares y escalables con NestJS
- Implementar correctamente providers, modules, guards, interceptors y pipes
- Integrar Prisma, autenticación, validación y documentación OpenAPI
- Escribir tests unitarios y de integración para la aplicación

## Best Practices
- Organizar módulos por dominio (no por tipo técnico)
- Usar DTOs con class-validator y class-transformer para validación
- Implementar guards para autenticación y autorización
- Usar interceptors para transformación de respuestas y logging
- Implementar exception filters personalizados para errores consistentes
- Documentar APIs con @nestjs/swagger (OpenAPI)
- Usar Prisma como ORM con el patrón de repositorio
- Inyectar dependencias correctamente con módulos bien definidos

## Anti-Patterns
- Poner lógica de negocio en controladores
- Usar `@InjectRepository` directamente (acoplar a ORM en todas las capas)
- Crear módulos gigantes sin separación por dominio
- Ignorar el manejo de errores con exception filters
- No usar DTOs y exponer entidades directamente en la API
- Hacer llamadas asíncronas sin manejar errores

## Errores Comunes
- Olvidar importar módulos en el módulo principal
- No cerrar conexiones a la base de datos
- Usar `any` en lugar de tipos específicos
- No configurar CORS adecuadamente
- Ignorar la inyección de dependencias cíclica
- No usar `@Injectable()` en providers

## Checklist
- [ ] Módulos organizados por dominio funcional
- [ ] DTOs con validación implementada
- [ ] Guards de autenticación y autorización
- [ ] Exception filters globales
- [ ] OpenAPI/Swagger configurado
- [ ] Tests unitarios para servicios
- [ ] Tests de integración para controladores
- [ ] CORS configurado
- [ ] Rate limiting implementado
- [ ] Logger configurado

## Convenciones
- Módulos: `*.module.ts`, Controladores: `*.controller.ts`, Servicios: `*.service.ts`
- DTOs: `create-user.dto.ts`, `update-user.dto.ts`
- Guards: `auth.guard.ts`, `roles.guard.ts`
- Tests: `*.spec.ts` junto al archivo que testea
- Métodos REST: get( findAll ), get( findOne ), post( create ), patch( update ), delete( remove )

## Ejemplos
```typescript
@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

## Referencias Oficiales
- NestJS Documentation: https://docs.nestjs.com/
- NestJS OpenAPI: https://docs.nestjs.com/openapi/introduction
- NestJS + Prisma: https://docs.nestjs.com/recipes/prisma
