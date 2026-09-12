# Clean Architecture Layers

## Overview

Clean Architecture separa el software en capas con dependencias hacia adentro. El código fuente **nunca depende de detalles externos** (frameworks, DB, UI).

## Layer Diagram

```
Frameworks & Drivers    (NestJS, Prisma, Express)
    ↑
Interface Adapters      (Controllers, Presenters, Gateways)
    ↑
Application/Use Cases   (Commands, Queries, Ports)
    ↑
Domain / Entities       (Models, Value Objects, Domain Events)
```

## Dependency Rule

Las dependencias **solo apuntan hacia adentro**. Capas externas pueden depender de capas internas. Lo interno **nunca importa** nada de lo externo.

```typescript
// ✅ Correcto: UseCase depende de una interfaz (puerto), no del framework
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

// ❌ Incorrecto: El dominio importa algo de infraestructura
import { PrismaClient } from '@prisma/client'; // No hacer esto en dominio
```

## Domain Layer

Entidades y Value Objects puros, sin dependencias externas.

```typescript
// entities/user.entity.ts
export class User {
  constructor(
    public readonly id: string,
    public readonly email: Email,  // Value Object
    public name: string,
    private _isActive: boolean = true,
  ) {}

  activate(): void {
    if (this._isActive) throw new Error('User already active');
    this._isActive = true;
  }

  deactivate(): void {
    if (!this._isActive) throw new Error('User already inactive');
    this._isActive = false;
  }

  get isActive(): boolean {
    return this._isActive;
  }
}
```

```typescript
// value-objects/email.ts
export class Email {
  private constructor(public readonly value: string) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      throw new Error('Invalid email format');
    }
  }

  static create(value: string): Email {
    return new Email(value);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
```

## Application / Use Cases

Orquestan flujos. Dependen de interfaces (puertos), no de implementaciones.

```typescript
// use-cases/create-user.use-case.ts
export class CreateUserUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly emailService: IEmailService,
  ) {}

  async execute(dto: CreateUserDTO): Promise<User> {
    const email = Email.create(dto.email);
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new DuplicateEmailError();

    const user = new User(crypto.randomUUID(), email, dto.name);
    await this.userRepo.save(user);
    await this.emailService.sendWelcome(user);
    return user;
  }
}
```

## Interface Adapters

Adaptan datos externos a los formatos que esperan los casos de uso.

```typescript
// controllers/user.controller.ts
@Controller('users')
export class UserController {
  constructor(private readonly createUser: CreateUserUseCase) {}

  @Post()
  async create(@Body() dto: CreateUserDTO) {
    const result = await this.createUser.execute(dto);
    return {
      id: result.id,
      email: result.email.value,
      name: result.name,
    };
  }
}
```

```typescript
// repositories/prisma-user.repository.ts
@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { id } });
    if (!record) return null;
    return this.toDomain(record);
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      create: this.toPersistence(user),
      update: this.toPersistence(user),
    });
  }

  private toDomain(record: PrismaUser): User {
    return new User(record.id, Email.create(record.email), record.name);
  }

  private toPersistence(user: User): PrismaUserInput {
    return {
      id: user.id,
      email: user.email.value,
      name: user.name,
    };
  }
}
```

## Folder Structure

```
src/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── domain-events/
│   └── ports/            # Interfaces (repositorios, servicios)
├── application/
│   ├── use-cases/
│   ├── commands/
│   ├── queries/
│   └── dto/
├── infrastructure/
│   ├── repositories/
│   ├── services/
│   └── config/
└── presentation/
    ├── controllers/
    ├── guards/
    ├── interceptors/
    └── filters/
```

## NestJS with Clean Architecture

```typescript
// module definition
@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    { provide: IUserRepository, useClass: PrismaUserRepository },
    { provide: IEmailService, useClass: SendGridEmailService },
  ],
})
export class UserModule {}
```

## Inyección de Dependencias en Use Cases

```typescript
@Module({
  providers: [
    {
      provide: CreateUserUseCase,
      useFactory: (repo: IUserRepository, email: IEmailService) =>
        new CreateUserUseCase(repo, email),
      inject: [IUserRepository, IEmailService],
    },
  ],
})
export class ApplicationModule {}
```

## Testing

```typescript
// Tests sin infraestructura
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  const mockRepo: jest.Mocked<IUserRepository> = {
    findByEmail: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(() => {
    useCase = new CreateUserUseCase(mockRepo, mockEmailService);
  });

  it('should create a user', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    const user = await useCase.execute({ email: 'a@b.com', name: 'Test' });
    expect(user.email.value).toBe('a@b.com');
  });
});
```

## Key Rules

1. **Domain no importa nada** (ni NestJS, ni Prisma, ni Express)
2. **Dependencias apuntan hacia adentro** siempre
3. **Puertos (interfaces)** en capa de dominio o aplicación
4. **Adaptadores** en infraestructura implementan los puertos
5. **Casos de uso** orquestan, no contienen lógica de negocio
6. **DTOs** cruzan fronteras, no entidades
