# OWASP Security

## Objetivos
- Prevenir las vulnerabilidades del OWASP Top 10 (2021) en aplicaciones web
- Implementar security headers, validación de entrada y escaneo de dependencias
- Proteger contra injection, broken access control, XSS y SSRF

## Best Practices
- Validar y sanitizar toda entrada de usuario en el servidor (no solo en frontend)
- Usar prepared statements/parameterized queries para prevenir SQL/NoSQL injection
- Implementar CSP (Content-Security-Policy), HSTS y X-Frame-Options como headers mínimos
- Escanear dependencias regularmente con npm audit, Snyk u OWASP Dependency-Check
- Aplicar rate limiting y logging de fallos de autenticación para prevenir brute force

## Anti-Patterns
- Confiar en validación solo del cliente: el servidor debe ser la última línea de defensa
- Almacenar secrets (API keys, DB passwords) en código o variables de entorno sin cifrar
- Usar serialización insegura (JSON.parse sin validación, deserialización de objetos arbitrarios)

## Errores Comunes
- No desinfectar entrada antes de pasarla a shell/command (command injection)
- Configurar CORS como Access-Control-Allow-Origin: * en producción
- Exponer stack traces o información interna en respuestas de error (information disclosure)

## Checklist
- [ ] Validar y sanitizar toda entrada de usuario (servidor)
- [ ] Usar prepared statements para queries SQL/NoSQL
- [ ] Configurar security headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- [ ] Ejecutar npm audit o Snyk en CI
- [ ] Implementar rate limiting en endpoints de autenticación

## Convenciones
- Variables de entorno para secrets usando dotenv o vault; nunca en el repositorio
- Middleware de seguridad global en NestJS (Helmet, CSRF, rate-limit)
- Logs de seguridad con estructura JSON y sin datos sensibles (PII)

## Ejemplos
```typescript
// Validación de entrada con Zod
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.enum(['admin', 'user']),
});

export class UserController {
  @Post()
  create(@Body(new ZodPipe(createUserSchema)) user: CreateUserDto) {
    // Validación automática, entrada maliciosa es rechazada
    return this.userService.create(user);
  }
}

// CSP Header
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
  );
  next();
});
```

## Referencias Oficiales
- OWASP Top 10 (2021): https://owasp.org/Top10/
- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/
- Content Security Policy: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
