# Error Handling Strategy

## Exception Hierarchy

```
Error
├── BaseException (abstract)
│   ├── DomainException
│   │   ├── UserNotFoundError
│   │   ├── DuplicateEmailError
│   │   └── InvalidStatusTransitionError
│   ├── ApplicationException
│   │   ├── ValidationError
│   │   └── UnauthorizedError
│   └── InfrastructureException
│       ├── DatabaseConnectionError
│       └── EmailDeliveryError
└── SystemException (unexpected)
    └── InternalServerError
```

## Base Exception

```typescript
// common/filters/base.exception.ts
export abstract class BaseException extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number,
    public readonly details?: Record<string, any>,
  ) {
    super(message);
    this.name = this.constructor.name;
  }

  abstract toProblemDetails(): ProblemDetails;
}
```

## Domain Exceptions

```typescript
// modules/users/domain/exceptions/user-not-found.error.ts
export class UserNotFoundError extends BaseException {
  constructor(userId: string) {
    super(
      `User with id '${userId}' not found`,
      'USER_NOT_FOUND',
      HttpStatus.NOT_FOUND,
      { userId },
    );
  }

  toProblemDetails(): ProblemDetails {
    return {
      type: 'https://api.example.com/errors/user-not-found',
      title: 'User Not Found',
      status: this.statusCode,
      detail: this.message,
      errors: [{
        field: 'userId',
        message: this.message,
        code: this.code,
      }],
    };
  }
}

// modules/auth/domain/exceptions/duplicate-email.error.ts
export class DuplicateEmailError extends BaseException {
  constructor(email: string) {
    super(
      `A user with email '${email}' already exists`,
      'DUPLICATE_EMAIL',
      HttpStatus.CONFLICT,
      { email },
    );
  }
}
```

## Application Exceptions

```typescript
// common/exceptions/validation.error.ts
export class ValidationError extends BaseException {
  constructor(errors: ValidationErrorDetail[]) {
    super(
      'Validation failed',
      'VALIDATION_ERROR',
      HttpStatus.UNPROCESSABLE_ENTITY,
      { errors },
    );
  }
}

// common/exceptions/unauthorized.error.ts
export class UnauthorizedError extends BaseException {
  constructor(message = 'Authentication required') {
    super(message, 'UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
  }
}
```

## Global Exception Filter

```typescript
// common/filters/global-exception.filter.ts
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 1. Known domain/application exceptions
    if (exception instanceof BaseException) {
      this.logger.warn('Domain exception', {
        code: exception.code,
        message: exception.message,
        path: request.url,
        traceId: request['traceId'],
      });

      return response
        .status(exception.statusCode)
        .json(exception.toProblemDetails());
    }

    // 2. NestJS HTTP exceptions
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const responseBody = exception.getResponse();

      this.logger.warn('HTTP exception', {
        status,
        response: responseBody,
        path: request.url,
      });

      return response.status(status).json({
        type: `https://api.example.com/errors/http-${status}`,
        title: exception.message,
        status,
        detail: typeof responseBody === 'string'
          ? responseBody
          : (responseBody as any).message,
        traceId: request['traceId'],
      });
    }

    // 3. Unexpected errors (500)
    this.logger.error('Unexpected error', {
      exception: exception instanceof Error ? {
        message: exception.message,
        stack: exception.stack,
        name: exception.name,
      } : exception,
      path: request.url,
    });

    // En producción, no enviar stack trace
    const isProd = this.config.get('NODE_ENV') === 'production';
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      type: 'https://api.example.com/errors/internal',
      title: 'Internal Server Error',
      status: 500,
      detail: isProd ? 'An unexpected error occurred' : (exception as Error).message,
      traceId: request['traceId'],
    });
  }
}
```

## Use Case Error Handling

```typescript
// modules/users/application/use-cases/create-user.use-case.ts
export class CreateUserUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly emailService: IEmailService,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const email = Email.create(dto.email);

    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new DuplicateEmailError(dto.email);
    }

    const user = new User(crypto.randomUUID(), email, dto.name);
    await this.userRepo.save(user);

    try {
      await this.emailService.sendWelcome(user);
    } catch (err) {
      // No fallar la operación si el email falla
      // Loggear y continuar
      throw new InfrastructureException('Failed to send welcome email', err);
    }

    return user;
  }
}
```

## Error Codes Registry

```typescript
// common/exceptions/error-codes.ts
export const ErrorCodes = {
  // Auth (AUTH-*)
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_INSUFFICIENT_PERMISSIONS: 'AUTH_INSUFFICIENT_PERMISSIONS',

  // Users (USR-*)
  USR_NOT_FOUND: 'USR_NOT_FOUND',
  USR_DUPLICATE_EMAIL: 'USR_DUPLICATE_EMAIL',
  USR_INACTIVE: 'USR_INACTIVE',

  // Posts (PST-*)
  PST_NOT_FOUND: 'PST_NOT_FOUND',
  PST_NOT_OWNER: 'PST_NOT_OWNER',
  PST_INVALID_STATUS: 'PST_INVALID_STATUS',

  // General (GEN-*)
  GEN_VALIDATION: 'GEN_VALIDATION',
  GEN_RATE_LIMIT: 'GEN_RATE_LIMIT',
  GEN_INTERNAL: 'GEN_INTERNAL',
} as const;
```

## Validation Pipe custom

```typescript
// common/pipes/typed-validation.pipe.ts
@Injectable()
export class TypedValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Use class-validator + class-transformer
    const metatype = metadata.metatype;
    if (!metatype || !this.toValidate(metatype)) return value;

    const object = plainToInstance(metatype, value);
    const errors = validateSync(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      throw new ValidationError(
        errors.map((e) => ({
          field: e.property,
          message: Object.values(e.constraints || {}).join(', '),
          code: 'VALIDATION_ERROR',
        })),
      );
    }

    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype as any);
  }
}
```

## Logging Strategy

```typescript
// common/interceptors/logging.interceptor.ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const traceId = crypto.randomUUID();
    request['traceId'] = traceId;

    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          this.logger.info('Request completed', {
            method, url, traceId,
            duration: Date.now() - start,
          });
        },
        error: (err) => {
          this.logger.error('Request failed', {
            method, url, traceId,
            duration: Date.now() - start,
            error: err.message,
            code: err.code || err.status,
          });
        },
      }),
    );
  }
}
```

## Error Response Format

```typescript
// Success
{
  "data": { ... }
}

// Validation Error (422)
{
  "type": "https://api.example.com/errors/validation",
  "title": "Validation Error",
  "status": 422,
  "detail": "The request contains invalid fields",
  "instance": "/api/v1/users",
  "errors": [
    { "field": "email", "message": "Invalid email", "code": "INVALID_FORMAT" }
  ],
  "traceId": "abc-123"
}

// Not Found (404)
{
  "type": "https://api.example.com/errors/not-found",
  "title": "User Not Found",
  "status": 404,
  "detail": "User with id '999' not found",
  "traceId": "abc-123"
}

// Unauthorized (401)
{
  "type": "https://api.example.com/errors/unauthorized",
  "title": "Unauthorized",
  "status": 401,
  "detail": "Invalid or expired token",
  "traceId": "abc-123"
}
```

## Key Rules

1. **Domain exceptions** en su propio módulo (cerca de la entidad)
2. **Error codes** con prefijo por módulo (`USR_`, `AUTH_`, `PST_`)
3. **Loggear siempre** con traceId para correlación
4. **Nunca exponer stack traces** en producción
5. **Errores de dominio** tienen status HTTP específico (no 500 genérico)
6. **Fallos de infraestructura** (DB, email) → 503, no enmascarar como 400
7. **Format response** uniforme con RFC 7807
