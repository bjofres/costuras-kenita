# API Design Patterns

## RESTful Naming

| Resource | GET | POST | PUT | PATCH | DELETE |
|----------|-----|------|-----|-------|--------|
| `/users` | List users | Create user | - | - | - |
| `/users/:id` | Get user | - | Replace user | Partial update | Delete user |
| `/users/:id/posts` | List user's posts | Create post for user | - | - | - |
| `/posts/:id` | Get post | - | Replace post | Update post | Delete post |

### Naming Rules

1. **Plural nouns**: `/users`, `/posts` (not `/user`, `/getUsers`)
2. **Lowercase kebab-case**: `/blog-posts` (not `/blogPosts`)
3. **Nested for relations**: `/users/:id/posts` (max 2 levels deep)
4. **No verbs**: Use HTTP methods instead of `/createUser`
5. **Consistent ID format**: UUIDs preferidos (`/users/550e8400-e29b-...`)

## Pagination

### Offset Pagination

```typescript
// GET /users?page=1&limit=20
@Get()
async findAll(
  @Query('page') page = 1,
  @Query('limit') limit = 20,
) {
  const skip = (page - 1) * limit;
  const [data, total] = await this.prisma.$transaction([
    this.prisma.user.findMany({ skip, take: limit }),
    this.prisma.user.count(),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}
```

### Cursor Pagination (recomendada para grandes datasets)

```typescript
// GET /posts?cursor=2024-01-01T00:00:00Z&limit=20
@Get()
async findPosts(
  @Query('cursor') cursor?: string,
  @Query('limit') limit = 20,
) {
  const data = await this.prisma.post.findMany({
    take: limit + 1, // fetch one extra to check hasNext
    cursor: cursor ? { createdAt: new Date(cursor) } : undefined,
    orderBy: { createdAt: 'desc' },
  });

  const hasNext = data.length > limit;
  if (hasNext) data.pop();

  return {
    data,
    meta: {
      nextCursor: hasNext ? data[data.length - 1].createdAt.toISOString() : null,
      hasNext,
    },
  };
}
```

| Feature | Offset | Cursor |
|---------|--------|--------|
| **Jump to page** | ✅ | ❌ |
| **Consistent with inserts** | ❌ (shifts) | ✅ |
| **Performance on big data** | Degrades (OFFSET) | Stable |
| **Real-time feeds** | ❌ | ✅ |
| **UX pagination numbers** | ✅ | ✅ (Load More) |

## Filtering

```typescript
// GET /users?status=active&role=admin&search=john
@Get()
async findAll(@Query() filters: UserFilterDto) {
  const where: Prisma.UserWhereInput = {};

  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.role) {
    where.role = filters.role;
  }
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } },
    ];
  }
  if (filters.createdAfter) {
    where.createdAt = { gte: new Date(filters.createdAfter) };
  }

  return this.userRepo.findMany({ where });
}

// DTO
class UserFilterDto {
  @IsOptional() @IsEnum(UserStatus) status?: UserStatus;
  @IsOptional() @IsEnum(UserRole) role?: UserRole;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsDateString() createdAfter?: string;
}
```

## Sorting

```typescript
// GET /users?sort=name:asc,createdAt:desc
@Get()
async findAll(@Query('sort') sort?: string) {
  const orderBy = sort?.split(',').map((s) => {
    const [field, dir = 'asc'] = s.split(':');
    return { [field]: dir };
  }) ?? [{ createdAt: 'desc' }];

  return this.userRepo.findMany({ orderBy });
}
```

## Versioning

```typescript
// app.module.ts
@Module({
  imports: [
    UsersModule,
    // URI versioning
    UsersV2Module,
  ],
  providers: [
    {
      provide: APP_VERSIONING,
      useFactory: () => ({
        type: VersioningType.URI,
        defaultVersion: '1',
      }),
    },
  ],
})

// Controller con version
@Controller({ path: 'users', version: '1' })
export class UserControllerV1 {}

@Controller({ path: 'users', version: '2' })
export class UserControllerV2 {}
```

### Versioning Strategies

| Strategy | Example | When |
|----------|---------|------|
| **URI** | `/v1/users` | Simple, más común |
| **Header** | `Accept: application/vnd.api+json;version=2` | API pública, versionado fino |
| **Query** | `/users?version=2` | Fácil para testing |

## Error Handling (RFC 7807)

```typescript
// Problem Details (RFC 7807)
interface ProblemDetails {
  type: string;       // URI que identifica el tipo de error
  title: string;      // Título legible
  status: number;     // HTTP status code
  detail: string;     // Descripción específica
  instance: string;   // URI del request que causó el error
  // Extensiones
  errors?: ValidationError[];
  traceId?: string;
}

// Respuesta de error
{
  "type": "https://api.example.com/errors/validation",
  "title": "Validation Error",
  "status": 422,
  "detail": "The request body contains invalid fields",
  "instance": "/api/v1/users",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format",
      "code": "INVALID_FORMAT"
    }
  ],
  "traceId": "abc-123-def"
}
```

```typescript
// exception-filters/rfc-7807.filter.ts
@Catch()
export class Rfc7807Filter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const problem: ProblemDetails = {
      type: this.getType(exception),
      title: this.getTitle(exception),
      status: this.getStatus(exception),
      detail: this.getDetail(exception),
      instance: request.url,
      traceId: request['traceId'],
    };

    response.status(problem.status).json(problem);
  }
}
```

## Rate Limiting

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global rate limit
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        type: 'https://api.example.com/errors/rate-limit',
        title: 'Too Many Requests',
        status: 429,
        detail: 'Rate limit exceeded. Try again in 15 minutes.',
      },
    }),
  );

  // Per-endpoint with @nestjs/throttler
  await app.listen(3000);
}

// Decorador para endpoints específicos
@Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 requests per minute
@Post('login')
async login(@Body() dto: LoginDto) {}
```

## Idempotency

```typescript
// POST /payments con Idempotency-Key
@Post()
async createPayment(
  @Body() dto: CreatePaymentDto,
  @Headers('Idempotency-Key') idempotencyKey: string,
) {
  if (!idempotencyKey) {
    throw new BadRequestException('Idempotency-Key header required');
  }

  // Check if already processed
  const existing = await this.cacheService.get(`idempotency:${idempotencyKey}`);
  if (existing) return existing;

  const result = await this.processPayment.execute(dto);

  // Cache result for 24h
  await this.cacheService.set(`idempotency:${idempotencyKey}`, result, 86400);
  return result;
}
```

## Response Envelope

```typescript
// Single item
{
  "data": { "id": "1", "name": "John" }
}

// Collection
{
  "data": [{ "id": "1", "name": "John" }],
  "meta": { "total": 100, "page": 1, "limit": 20 }
}

// Error
{
  "error": {
    "type": "https://api.example.com/errors/not-found",
    "title": "Not Found",
    "status": 404,
    "detail": "User with id '999' not found"
  }
}
```

## Summary

| Pattern | Implementation |
|---------|---------------|
| **Pagination** | Cursor para feeds, offset para UIs con páginas |
| **Filtering** | Query params con DTOs tipados |
| **Sorting** | `sort=field:dir,field2:dir` |
| **Versioning** | URI versioning (`/v1/users`) |
| **Errors** | RFC 7807 Problem Details |
| **Rate Limit** | `@nestjs/throttler` + global middleware |
| **Idempotency** | `Idempotency-Key` header + cache |
| **Response** | Envelope `{ data, meta }` o `{ error }` |
