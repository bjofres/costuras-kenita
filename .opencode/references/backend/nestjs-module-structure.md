# NestJS Module Structure

## Module Types

| Type | Purpose | Examples |
|------|---------|----------|
| **Feature** | Domain functionality | Users, Auth, Posts, Comments |
| **Shared** | Cross-cutting utilities | Config, Logger, Cache, Queue |
| **Core** | Application-wide singleton concerns | Database, Auth guard, Error filter |
| **Library** | External integrations | PrismaModule, RedisModule, SendGridModule |

## Feature Module Pattern

Cada feature module contiene 4 sub-capas: presentation, application, domain, infrastructure.

```
modules/users/
├── presentation/
│   ├── user.controller.ts
│   ├── user.module.ts
│   └── dto/
│       ├── create-user.dto.ts
│       └── update-user.dto.ts
├── application/
│   ├── use-cases/
│   │   ├── create-user.use-case.ts
│   │   ├── get-user.use-case.ts
│   │   └── deactivate-user.use-case.ts
│   └── ports/
│       ├── user.repository.interface.ts
│       └── user-notifier.interface.ts
├── domain/
│   ├── user.entity.ts
│   ├── user-role.enum.ts
│   └── events/
│       └── user-created.event.ts
└── infrastructure/
    ├── persistence/
    │   ├── prisma-user.repository.ts
    │   └── user.mapper.ts
    └── notifiers/
        └── email-user-notifier.ts
```

### Module Definition

```typescript
// modules/users/presentation/user.module.ts
@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule), // cross-module dependency
  ],
  controllers: [UserController],
  providers: [
    // Use Cases
    CreateUserUseCase,
    GetUserUseCase,
    DeactivateUserUseCase,
    // Port implementations
    { provide: IUserRepository, useClass: PrismaUserRepository },
    { provide: IUserNotifier, useClass: EmailUserNotifier },
  ],
  exports: [IUserRepository, CreateUserUseCase],
})
export class UserModule {}
```

## Feature: Auth Module

```typescript
// modules/auth/presentation/auth.controller.ts
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.registerUseCase.execute(dto);
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.refreshTokenUseCase.execute(dto);
  }
}
```

```typescript
// modules/auth/infrastructure/strategies/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: TokenPayload) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
```

```typescript
// modules/auth/infrastructure/guards/jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

## Feature: Posts Module

```typescript
// modules/posts/presentation/post.controller.ts
@Controller('posts')
export class PostController {
  constructor(
    private readonly createPost: CreatePostUseCase,
    private readonly getFeed: GetFeedUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreatePostDto, @User() user: UserPayload) {
    return this.createPost.execute({ ...dto, authorId: user.userId });
  }

  @Get()
  async getFeed(@Query() query: PaginationDto) {
    return this.getFeed.execute(query);
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.getPostById.execute(id);
  }
}
```

```typescript
// modules/posts/domain/post.entity.ts
export class Post {
  constructor(
    public readonly id: string,
    public readonly authorId: string,
    public title: string,
    public content: string,
    public status: PostStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  publish(): void {
    if (this.status !== PostStatus.DRAFT) {
      throw new Error('Only drafts can be published');
    }
    this.status = PostStatus.PUBLISHED;
  }

  archive(): void {
    this.status = PostStatus.ARCHIVED;
  }
}
```

## Shared Modules

### Config Module

```typescript
// common/config/config.module.ts
@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useFactory: () => {
        const config = new ConfigService();
        config.loadEnv('.env');
        return config;
      },
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
```

### Logger Module

```typescript
// common/logger/logger.module.ts
@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
```

## Core Modules

```typescript
// core/database/database.module.ts
@Global()
@Module({
  providers: [
    {
      provide: PrismaService,
      useFactory: (config: ConfigService) => {
        const prisma = new PrismaService({
          datasources: { db: { url: config.get('DATABASE_URL') } },
        });
        prisma.$on('query', (e) => console.log(e.query));
        return prisma;
      },
      inject: [ConfigService],
    },
  ],
  exports: [PrismaService],
})
export class DatabaseModule {}
```

## Dynamic Modules

```typescript
// common/cache/cache.module.ts
@Module({})
export class CacheModule {
  static register(options: CacheOptions): DynamicModule {
    return {
      module: CacheModule,
      providers: [
        { provide: 'CACHE_OPTIONS', useValue: options },
        CacheService,
      ],
      exports: [CacheService],
    };
  }
}

// Usage:
@Module({
  imports: [CacheModule.register({ ttl: 60, max: 100 })],
})
export class UsersModule {}
```

## App Module

```typescript
// app.module.ts
@Module({
  imports: [
    // Core
    ConfigModule,
    DatabaseModule,
    LoggerModule,
    // Features
    AuthModule,
    UserModule,
    PostModule,
    CommentModule,
    // Libraries
    RedisModule,
    QueueModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_PIPE, useClass: ValidationPipe },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
```

## Module Dependency Graph

```
AppModule
├── ConfigModule (Global)
├── DatabaseModule (Global)
├── LoggerModule (Global)
├── AuthModule
│   └── UserModule (forwardRef)
├── UserModule
│   └── AuthModule (forwardRef)
├── PostModule
│   ├── UserModule
│   └── CacheModule
├── CommentModule
│   ├── PostModule
│   └── UserModule
├── RedisModule
└── QueueModule
    └── RedisModule
```

## Key Rules

1. **Feature modules** encapsulan un dominio completo
2. **Shared modules** son `@Global()` o se importan explícitamente
3. **Core modules** son globales y se cargan una vez
4. **Evitar dependencias circulares** con `forwardRef()`
5. **Exports**: solo lo que otros módulos necesitan
6. **Providers por interfaz**: `{ provide: IPort, useClass: Impl }`
7. **Lazy loading** de módulos pesados con `LazyModuleLoader`
