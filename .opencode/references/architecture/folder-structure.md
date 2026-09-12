# Folder Structure Convention

## Monorepo Structure (Nuxt + NestJS)

```
project-root/
├── apps/
│   ├── web/                      # Nuxt 3 application
│   │   ├── app/
│   │   │   ├── pages/
│   │   │   ├── layouts/
│   │   │   ├── components/
│   │   │   ├── composables/
│   │   │   ├── middleware/
│   │   │   ├── plugins/
│   │   │   └── server/
│   │   ├── public/
│   │   └── nuxt.config.ts
│   └── api/                      # NestJS application
│       ├── src/
│       │   ├── modules/
│       │   ├── common/
│       │   ├── config/
│       │   └── main.ts
│       ├── test/
│       └── package.json
├── packages/
│   ├── shared/                   # Shared types, DTOs, constants
│   │   ├── src/
│   │   │   ├── types/
│   │   │   ├── dto/
│   │   │   ├── enums/
│   │   │   └── constants/
│   │   └── package.json
│   ├── ui/                       # UI components library
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── composables/
│   │   │   └── styles/
│   │   └── package.json
│   └── config/                   # Shared configuration
│       ├── eslint/
│       ├── typescript/
│       └── tailwind/
├── tools/                        # Build scripts, codegen
├── docs/
└── package.json                  # Root workspace config
```

## Nuxt 3 App Structure

```
apps/web/
├── app/
│   ├── pages/                    # File-based routing
│   │   ├── index.vue
│   │   ├── login.vue
│   │   ├── users/
│   │   │   ├── index.vue         # /users
│   │   │   └── [id].vue          # /users/:id
│   │   └── dashboard.vue
│   ├── layouts/
│   │   ├── default.vue
│   │   ├── auth.vue
│   │   └── dashboard.vue
│   ├── components/
│   │   ├── common/               # Reusable base components
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseInput.vue
│   │   │   └── BaseModal.vue
│   │   ├── feature/              # Feature-specific components
│   │   │   ├── UserCard.vue
│   │   │   └── UserTable.vue
│   │   └── ui/                   # UI primitives
│   │       ├── UiBadge.vue
│   │       └── UiAvatar.vue
│   ├── composables/
│   │   ├── useAuth.ts
│   │   ├── usePagination.ts
│   │   └── useDebounce.ts
│   ├── middleware/
│   │   ├── auth.global.ts
│   │   └── logging.ts
│   ├── plugins/
│   │   ├── pinia.ts
│   │   ├── vuetify.ts
│   │   └── api.ts
│   ├── server/                   # Nitro server (API routes)
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   └── users/
│   │   ├── middleware/
│   │   └── utils/
│   └── app.vue
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── nuxt.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## NestJS App Structure

```
apps/api/
├── src/
│   ├── modules/                  # Feature modules
│   │   ├── auth/
│   │   │   ├── application/
│   │   │   │   ├── use-cases/
│   │   │   │   ├── commands/
│   │   │   │   └── queries/
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   ├── value-objects/
│   │   │   │   ├── events/
│   │   │   │   └── ports/
│   │   │   ├── infrastructure/
│   │   │   │   ├── persistence/
│   │   │   │   ├── guards/
│   │   │   │   └── strategies/
│   │   │   └── presentation/
│   │   │       ├── controllers/
│   │   │       ├── dto/
│   │   │       └── decorators/
│   │   ├── users/
│   │   │   └── ... (same layers)
│   │   └── posts/
│   │       └── ... (same layers)
│   ├── common/                   # Shared infrastructure
│   │   ├── filters/
│   │   ├── interceptors/
│   │   ├── guards/
│   │   ├── pipes/
│   │   ├── decorators/
│   │   └── base/
│   ├── config/                   # Configuration
│   │   ├── database/
│   │   ├── redis/
│   │   └── environment/
│   ├── database/                 # Database concerns
│   │   ├── migrations/
│   │   ├── seeds/
│   │   └── prisma/
│   └── main.ts
└── test/
    ├── unit/
    ├── integration/
    └── e2e/
```

## Package: Shared

```
packages/shared/
├── src/
│   ├── types/
│   │   ├── user.types.ts
│   │   ├── auth.types.ts
│   │   └── api.types.ts          # PaginatedResponse<T>, ApiError, etc.
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   ├── login.dto.ts
│   │   └── pagination.dto.ts
│   ├── enums/
│   │   ├── role.enum.ts
│   │   ├── status.enum.ts
│   │   └── error-codes.enum.ts
│   └── constants/
│       ├── error-messages.ts
│       └── api-paths.ts
├── tsconfig.json
└── package.json
```

## Package: UI

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.vue
│   │   │   ├── Button.stories.ts
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── Table/
│   ├── composables/
│   │   ├── useForm.ts
│   │   └── useValidation.ts
│   └── styles/
│       ├── variables.css
│       └── reset.css
└── package.json
```

## Feature Module by Layers (NestJS)

Cada feature module sigue Clean Architecture:

```
modules/posts/
├── application/
│   ├── use-cases/
│   │   ├── create-post.use-case.ts
│   │   ├── get-feed.use-case.ts
│   │   └── delete-post.use-case.ts
│   └── ports/
│       ├── post.repository.interface.ts
│       └── post-publisher.interface.ts
├── domain/
│   ├── post.entity.ts
│   ├── post-status.enum.ts
│   └── events/
│       └── post-created.event.ts
├── infrastructure/
│   ├── persistence/
│   │   ├── prisma-post.repository.ts
│   │   └── post.mapper.ts
│   └── events/
│       └── rabbitmq-post-publisher.ts
└── presentation/
    ├── post.controller.ts
    ├── dto/
    │   ├── create-post.dto.ts
    ├── guards/
    │   └── post-owner.guard.ts
    └── post.module.ts
```

## Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| **Files** | kebab-case | `create-user.use-case.ts` |
| **Classes** | PascalCase | `CreateUserUseCase` |
| **Functions** | camelCase | `useAuth()` |
| **Folders** | kebab-case | `use-cases/`, `value-objects/` |
| **Interfaces** | Prefixed `I` | `IUserRepository` |
| **Tests** | `.spec.ts` or `.test.ts` | `create-user.use-case.spec.ts` |
| **Stories** | `.stories.ts` | `Button.stories.ts` |

## Key Rules

1. **No archivos `index.ts` barrel** a menos que sean librerías publicadas
2. **Un archivo = una responsabilidad** (una clase, una función)
3. **Nesting máximo 4 niveles** desde `src/`
4. **Test files junto al source** en `__tests__/` o `.spec.ts`
5. **Componentes atómicos** (comunes) vs **feature components** (específicos)
6. **Shared types/DTOs** en `packages/shared`, no duplicados
