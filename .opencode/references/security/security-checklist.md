# Security Checklist

## OWASP Top 10 (2021)

- [ ] **A01: Broken Access Control** - Verificar permisos en cada endpoint
- [ ] **A02: Cryptographic Failures** - No usar algoritmos obsoletos
- [ ] **A03: Injection** - Validar y sanitizar inputs (SQL, NoSQL, XSS)
- [ ] **A04: Insecure Design** - Threat modeling en diseño
- [ ] **A05: Security Misconfiguration** - Hardening por defecto
- [ ] **A06: Vulnerable Components** - Auditoría de dependencias
- [ ] **A07: Auth Failures** - MFA, rate limiting en login
- [ ] **A08: Data Integrity Failures** - Firmas, checksums
- [ ] **A09: Logging Failures** - Audit logging completo
- [ ] **A10: SSRF** - Validar URLs externas

## Authentication

```typescript
// Password hashing
import * as bcrypt from 'bcrypt';
const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  if (password.length < 8) throw new Error('Password too short');
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

```typescript
// JWT configuration
@Injectable()
export class JwtConfig {
  private readonly secret: string;
  private readonly accessTtl = '15m';  // Short-lived
  private readonly refreshTtl = '7d';  // Long-lived

  constructor(config: ConfigService) {
    this.secret = config.getOrThrow('JWT_SECRET');
    if (this.secret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters');
    }
  }
}
```

### Checklist

- [ ] Passwords hasheadas con bcrypt (cost >= 12) o argon2
- [ ] JWT con expiración corta (15-30 min access, 7d refresh)
- [ ] Refresh token rotation (nuevo refresh token en cada refresh)
- [ ] Rate limiting en login (5 intentos → 15min lockout)
- [ ] MFA para operaciones sensibles
- [ ] Session invalidation on logout
- [ ] Password complexity minimum 8 chars, 1 upper, 1 special
- [ ] No mensajes específicos en login ("user not found" vs "invalid credentials")

## Authorization

```typescript
// RBAC Guard
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}

// Resource-based access
@Injectable()
export class PostOwnerGuard implements CanActivate {
  constructor(private readonly postRepo: IPostRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const post = await this.postRepo.findById(request.params.id);
    return post.authorId === request.user.userId;
  }
}
```

### Checklist

- [ ] RBAC o ABAC implementado
- [ ] Resource ownership checks (user solo accede a sus recursos)
- [ ] Validar permisos en API, no solo en UI
- [ ] Principio de mínimo privilegio
- [ ] Deny by default
- [ ] Rate limit por usuario y por endpoint

## Input Validation

```typescript
// DTO validation
export class CreateUserDto {
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Matches(/^[a-zA-ZáéíóúñÑ\s]+$/)
  name: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
  password: string;
}

// Global validation pipe
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,         // Strip unknown properties
  forbidNonWhitelisted: true, // Reject unknown properties
  transform: true,         // Auto-transform types
}));
```

### Checklist

- [ ] Whitelist validation (no blacklist)
- [ ] Content-Type validation
- [ ] Size limits en request body
- [ ] SQL injection prevention (ORM parameterization)
- [ ] No eval, no dangerouslySetInnerHTML sin sanitizar
- [ ] URL validation (evitar SSRF)
- [ ] File upload: type, size, scan

## HTTP Security Headers

```typescript
// Helmet middleware
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.example.com'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));
```

| Header | Value | Purpose |
|--------|-------|---------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Force HTTPS |
| `Content-Security-Policy` | Restrict resources | Prevent XSS |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer |
| `Permissions-Policy` | `geolocation=(), camera=()` | Restrict APIs |
| `X-XSS-Protection` | `0` | Deprecated, use CSP |

## Dependency Management

```bash
# Audit
npm audit
npm audit --production

# Check for known vulnerabilities
npx snyk test
npx dependency-check

# Update
npm outdated
npm update
npx npm-check-updates

# Lock file integrity
npm ci  # clean install from lockfile
```

### Checklist

- [ ] `npm audit` en CI (fail on critical/high)
- [ ] Dependencias mínimas necesarias
- [ ] Lockfile (`package-lock.json`) versionado
- [ ] Dependencias de desarrollo separadas
- [ ] Actualizar dependencias semanalmente
- [ ] No usar paquetes con mantenedores únicos
- [ ] Revisar licencias

## Secret Management

```typescript
// Nunca hardcode secrets
// ❌ Mal
const API_KEY = 'sk-123456';

// ✅ Bien
const apiKey = configService.get('STRIPE_API_KEY');

// ✅ Mejor: usar secret manager (AWS Secrets Manager, Vault)
@Injectable()
export class SecretsService {
  async getSecret(name: string): Promise<string> {
    if (process.env.NODE_ENV === 'production') {
      return this.vault.read(`secret/${name}`);
    }
    return process.env[name.toUpperCase()];
  }
}
```

### Checklist

- [ ] Secrets en environment variables o secret manager
- [ ] No secrets en code, logs, error messages
- [ ] .env files en .gitignore
- [ ] Rotación periódica de secrets
- [ ] Encriptación en reposo y tránsito
- [ ] DB credentials con mínimo privilegio

## Secure Logging

```typescript
// Interceptor para sanitizar logs
@Injectable()
export class SanitizeLoggingInterceptor implements NestInterceptor {
  private readonly sensitiveFields = ['password', 'token', 'secret', 'ssn'];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Sanitize body for logging
    const sanitizedBody = this.sanitize(request.body);
    Logger.debug(`Request body: ${JSON.stringify(sanitizedBody)}`);

    return next.handle().pipe(
      tap((response) => {
        const sanitizedResponse = this.sanitize(response);
        Logger.debug(`Response: ${JSON.stringify(sanitizedResponse)}`);
      }),
    );
  }

  private sanitize(obj: any): any {
    if (!obj) return obj;
    const sanitized = { ...obj };
    for (const key of Object.keys(sanitized)) {
      if (this.sensitiveFields.includes(key.toLowerCase())) {
        sanitized[key] = '***REDACTED***';
      }
    }
    return sanitized;
  }
}
```

### Checklist

- [ ] No loggear secrets, tokens, passwords
- [ ] Audit log de acciones sensibles (login, delete, role change)
- [ ] Logs estructurados (JSON) para SIEM
- [ ] Trace ID en cada request
- [ ] Retención de logs según compliance
- [ ] Logs inmutables (append-only)

## Rate Limiting

```typescript
// @nestjs/throttler
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10, // 10 requests per minute
      },
    ]),
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})

// Per-endpoint
@Throttle({ default: { limit: 3, ttl: 60000 } })
@Post('login')
async login(@Body() dto: LoginDto) {}
```

### Checklist

- [ ] Rate limit global por IP
- [ ] Rate limit específico por endpoint (login, register)
- [ ] Rate limit por usuario autenticado (usar userId en lugar de IP)
- [ ] 429 response con Retry-After header
- [ ] Distributed rate limiting (Redis) para múltiples instancias

## API Security Checklist

- [ ] HTTPS enforced (HSTS + redirect)
- [ ] CORS configurado (whitelist origins)
- [ ] API keys con scopes
- [ ] Request size limits
- [ ] Content Security Policy
- [ ] Subresource Integrity (SRI) para CDN assets
- [ ] Cookie flags: HttpOnly, Secure, SameSite=Strict
- [ ] CSRF tokens para mutaciones
- [ ] IDOR prevention (recurso pertenece al usuario)
- [ ] Mass assignment protection (whitelist)
