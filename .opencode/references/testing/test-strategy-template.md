# Test Strategy Template

## Testing Pyramid

```
         ╱╲
        ╱ E2E ╲         ~5%  - Critical user journeys
       ╱━━━━━━╲
      ╱Integration╲      ~20% - Module interactions, API
     ╱━━━━━━━━━━━━╲
    ╱   Unit Tests   ╲   ~75% - Domain, use cases, utils
   ╱━━━━━━━━━━━━━━━━━━╲
```

## Coverage Goals by Layer

| Layer | Coverage | Focus |
|-------|----------|-------|
| **Domain entities** | 100% | Business rules, invariants, value objects |
| **Use cases** | 100% | Orchestration, error paths, edge cases |
| **Controllers** | 90% | HTTP mapping, validation, status codes |
| **Repositories** | 80% | Query logic, mappings, edge cases |
| **Infrastructure** | 70% | Integration points, external services |
| **UI Components** | 80% | Rendering, user interactions, states |
| **E2E** | Critical paths | Happy path + main error scenarios |

## Directory Structure

```
├── test/
│   ├── unit/
│   │   ├── domain/
│   │   │   ├── user.entity.spec.ts
│   │   │   └── email.value-object.spec.ts
│   │   ├── application/
│   │   │   ├── create-user.use-case.spec.ts
│   │   │   └── get-post.query.spec.ts
│   │   └── utils/
│   ├── integration/
│   │   ├── repositories/
│   │   │   └── prisma-user.repository.spec.ts
│   │   ├── controllers/
│   │   │   └── user.controller.spec.ts
│   │   └── database/
│   └── e2e/
│       ├── auth.flow.spec.ts
│       └── posts.crud.spec.ts

├── vitest.config.ts
└── docker-compose.test.yml
```

## Unit Tests

### Domain Entity

```typescript
// test/unit/domain/post.entity.spec.ts
describe('Post Entity', () => {
  describe('publish()', () => {
    it('should change status to PUBLISHED', () => {
      const post = new Post({
        id: '1',
        title: 'Test',
        status: PostStatus.DRAFT,
      });

      post.publish();

      expect(post.status).toBe(PostStatus.PUBLISHED);
    });

    it('should throw if already published', () => {
      const post = new Post({
        id: '1',
        title: 'Test',
        status: PostStatus.PUBLISHED,
      });

      expect(() => post.publish()).toThrow('Only drafts can be published');
    });
  });
});
```

### Use Case

```typescript
// test/unit/application/create-user.use-case.spec.ts
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockRepo: jest.Mocked<IUserRepository>;
  let mockEmail: jest.Mocked<IEmailService>;

  beforeEach(() => {
    mockRepo = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    };
    mockEmail = {
      sendWelcome: jest.fn(),
    };
    useCase = new CreateUserUseCase(mockRepo, mockEmail);
  });

  it('should create user successfully', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);

    const user = await useCase.execute({
      email: 'test@example.com',
      name: 'Test User',
    });

    expect(user.email.value).toBe('test@example.com');
    expect(mockRepo.save).toHaveBeenCalledWith(expect.any(User));
    expect(mockEmail.sendWelcome).toHaveBeenCalledWith(expect.any(User));
  });

  it('should throw DuplicateEmailError if email exists', async () => {
    mockRepo.findByEmail.mockResolvedValue(new User({ ... }));

    await expect(
      useCase.execute({ email: 'existing@example.com', name: 'Test' }),
    ).rejects.toThrow(DuplicateEmailError);
  });

  it('should not fail if email service fails', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    mockEmail.sendWelcome.mockRejectedValue(new Error('SMTP down'));

    await expect(
      useCase.execute({ email: 'test@example.com', name: 'Test' }),
    ).resolves.toBeDefined();
  });
});
```

## Integration Tests

### Repository

```typescript
// test/integration/repositories/prisma-user.repository.spec.ts
describe('PrismaUserRepository', () => {
  let repo: PrismaUserRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [PrismaUserRepository, PrismaService],
    }).compile();

    prisma = module.get(PrismaService);
    repo = module.get(PrismaUserRepository);
  });

  beforeEach(async () => {
    await prisma.user.deleteMany(); // clean between tests
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should save and retrieve user', async () => {
    const user = new User('1', Email.create('test@test.com'), 'Test');
    await repo.save(user);

    const found = await repo.findById('1');
    expect(found?.email.value).toBe('test@test.com');
    expect(found?.name).toBe('Test');
  });

  it('should return null for non-existent user', async () => {
    const found = await repo.findById('non-existent');
    expect(found).toBeNull();
  });
});
```

### Controller

```typescript
// test/integration/controllers/user.controller.spec.ts
describe('UserController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [UserModule, DatabaseModule],
    })
      .overrideProvider(IUserRepository)
      .useClass(MockUserRepository)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('POST /users should return 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'test@test.com', name: 'Test' })
      .expect(201);

    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.email).toBe('test@test.com');
  });

  it('POST /users should return 409 for duplicate email', async () => {
    // Setup duplicate
    await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'dup@test.com', name: 'First' });

    await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'dup@test.com', name: 'Second' })
      .expect(409);
  });
});
```

## E2E Tests

```typescript
// test/e2e/auth.flow.spec.ts
describe('Auth Flow', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await bootstrapTestApp();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('complete auth flow: register → login → access protected route', async () => {
    // Register
    const registerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'flow@test.com', name: 'Flow', password: 'StrongP@ss1' })
      .expect(201);

    // Login
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'flow@test.com', password: 'StrongP@ss1' })
      .expect(200);

    const token = loginRes.body.data.accessToken;

    // Access protected resource
    await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    // Invalid token
    await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);
  });
});
```

## Mocking Strategy

| Layer | Mocking Approach |
|-------|-----------------|
| **Domain** | No mocks needed (pure functions) |
| **Use Cases** | Mock repository interfaces |
| **Controllers** | Mock use cases |
| **Repositories** | Test DB (testcontainers or SQLite) |
| **External APIs** | `nock` or `MSW` |
| **UI Components** | `vitest` + `@vue/test-utils` with props |
| **Composables** | Mock fetch with `vi.fn()` |

```typescript
// Mock repository
const mockRepo: IUserRepository = {
  findById: vi.fn(),
  save: vi.fn(),
};

// Mock external API with nock
import nock from 'nock';
nock('https://api.stripe.com')
  .post('/v1/charges')
  .reply(200, { id: 'ch_123' });

// MSW (recommended for E2E)
import { http, HttpResponse } from 'msw';
export const handlers = [
  http.get('/api/users', () =>
    HttpResponse.json({ data: [{ id: '1', name: 'Mock' }] })
  ),
];
```

## Test Data Management

```typescript
// Factories
export function createUser(overrides?: Partial<UserProps>): User {
  return new User({
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    status: UserStatus.ACTIVE,
    createdAt: new Date(),
    ...overrides,
  });
}

// Seed helper
export async function seedDatabase(prisma: PrismaService) {
  await prisma.user.createMany({
    data: Array.from({ length: 5 }, () => ({
      email: faker.internet.email(),
      name: faker.person.fullName(),
    })),
  });
}
```

## CI Pipeline

```yaml
# .github/workflows/test.yml
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: test
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4

      - run: npm ci
      - run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgres://postgres:test@localhost/test

      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:e2e

      - run: npm run test:coverage
      - uses: davelosert/vitest-coverage-report-action@v2
        if: always()
```

## Test Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    root: '.',
    include: ['test/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.module.ts',
        'src/main.ts',
        'src/**/*.dto.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
  },
});
```

## Key Rules

1. **Test behavior, not implementation** - test what, not how
2. **One assertion per test** (or related assertions in a logical group)
3. **AAA Pattern**: Arrange, Act, Assert
4. **No mocks for domain logic** - domain should be pure
5. **Integration tests use real DB** (testcontainers)
6. **E2E tests cover critical paths** only (login, signup, core flow)
7. **Factories not fixtures** - generate test data programmatically
8. **Coverage thresholds** enforced in CI
