# Data Modeling Patterns

## Normalization

### 1NF, 2NF, 3NF Basics

```prisma
// Normalizado (3NF)
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  addressId String?
  address   Address? @relation
  posts     Post[]
  createdAt DateTime @default(now())
}

model Address {
  id        String @id @default(uuid())
  street    String
  city      String
  country   String
  zipCode   String
  user      User?
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  tags      Tag[]    // Many-to-many
  createdAt DateTime @default(now())
}

model Tag {
  id    String @id @default(uuid())
  name  String @unique
  posts Post[]
}
```

### Desnormalización (cuando aplica)

```prisma
// Desnormalizado: denormalized_count para evitar JOIN costoso
model User {
  id       String @id @default(uuid())
  email    String @unique
  name     String
  postCount Int   @default(0) // denormalized counter
}

// Actualizar contador con trigger o en app layer
async function createPost(userId: string, data: CreatePostDto) {
  const [post] = await prisma.$transaction([
    prisma.post.create({ data: { ...data, authorId: userId } }),
    prisma.user.update({
      where: { id: userId },
      data: { postCount: { increment: 1 } },
    }),
  ]);
  return post;
}
```

| Approach | Pros | Cons |
|----------|------|------|
| **Normalized** | Sin duplicación, integridad referencial | JOINs costosos en reads |
| **Denormalized** | Reads rápidos, sin JOINs | Updates complejos, datos inconsistentes |

## Inheritance Patterns

### Single Table Inheritance

```prisma
// Todos los tipos en una tabla, con columna discriminadora
model Content {
  id         String   @id @default(uuid())
  type       String   // 'POST', 'VIDEO', 'PODCAST'
  title      String
  body       String?
  videoUrl   String?
  duration   Int?
  audioUrl   String?
  transcript String?
  createdAt  DateTime @default(now())
}
```

### Class Table Inheritance

```prisma
// Tabla base + tablas específicas
model Content {
  id        String   @id @default(uuid())
  type      String
  title     String
  createdAt DateTime @default(now())
}

model Post {
  id      String @id
  content Content @relation(fields: [id], references: [id], onDelete: Cascade)
  body    String
}

model Video {
  id       String @id
  content  Content @relation(fields: [id], references: [id], onDelete: Cascade)
  videoUrl String
  duration Int
}
```

### Concrete Table Inheritance

```prisma
// Tablas completamente separadas, sin tabla base
model Post {
  id        String   @id @default(uuid())
  title     String
  body      String
  createdAt DateTime @default(now())
}

model Video {
  id        String   @id @default(uuid())
  title     String
  videoUrl  String
  duration  Int
  createdAt DateTime @default(now())
}
```

## Soft Delete

```prisma
model User {
  id        String    @id @default(uuid())
  email     String    @unique
  name      String
  deletedAt DateTime? // null = active, set = deleted
  deletedBy String?
}

// Prisma middleware for soft delete
prisma.$use(async (params, next) => {
  if (params.model === 'User') {
    if (params.action === 'findMany' || params.action === 'findFirst') {
      params.args.where = { ...params.args.where, deletedAt: null };
    }
    if (params.action === 'delete') {
      params.action = 'update';
      params.args.data = { deletedAt: new Date() };
    }
  }
  return next(params);
});
```

```typescript
// Repositorio con soft delete
export class PrismaUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
    return record ? this.toDomain(record) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: 'system' },
    });
  }

  async findDeleted(): Promise<User[]> {
    const records = await this.prisma.user.findMany({
      where: { NOT: { deletedAt: null } },
    });
    return records.map(this.toDomain);
  }
}
```

## Audit Logging

```prisma
model AuditLog {
  id        String   @id @default(uuid())
  entity    String   // 'User', 'Post'
  entityId  String
  action    String   // 'CREATE', 'UPDATE', 'DELETE'
  changes   Json     // { "field": { "old": "x", "new": "y" } }
  performedBy String
  performedAt DateTime @default(now())
  metadata   Json?
}
```

```typescript
// Audit decorator
export function AuditLog(entity: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const original = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const result = await original.apply(this, args);
      await this.auditService.log({
        entity,
        entityId: result.id,
        action: propertyKey.toUpperCase(),
        changes: args[0], // DTO
        performedBy: this.currentUser?.id,
      });
      return result;
    };
  };
}

// Uso
@AuditLog('Post')
async createPost(dto: CreatePostDto): Promise<Post> {
  return this.postRepo.save(new Post(dto));
}
```

## Temporal Tables (Versioning)

```prisma
// Versioning manual con snapshot table
model PostVersion {
  id        String   @id @default(uuid())
  postId    String
  title     String
  content   String
  version   Int
  createdAt DateTime @default(now())
  createdBy String

  post Post @relation(fields: [postId], references: [id])
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String
  version   Int      @default(1)
  versions  PostVersion[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

```typescript
// Auto-versioning on update
async function updatePost(postId: string, data: UpdatePostDto, userId: string) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new NotFoundError();

  const [updated] = await prisma.$transaction([
    prisma.post.update({
      where: { id: postId },
      data: {
        ...data,
        version: { increment: 1 },
      },
    }),
    prisma.postVersion.create({
      data: {
        postId,
        title: post.title,
        content: post.content,
        version: post.version,
        createdBy: userId,
      },
    }),
  ]);

  return updated;
}
```

## Schema Design Patterns

### Enum vs Lookup Table

```prisma
// ✅ Enum para valores fijos y pequeños
enum UserRole {
  ADMIN
  EDITOR
  VIEWER
}

// ✅ Lookup table para valores dinámicos o con metadata
model Category {
  id          String   @id @default(uuid())
  name        String   @unique
  slug        String   @unique
  description String?
  posts       Post[]
  createdAt   DateTime @default(now())
}
```

### Json vs Relation

```prisma
// ✅ Relation para datos que necesitan queries, índices, integridad
model User {
  id    String @id @default(uuid())
  addresses Address[] // relation
}

// ✅ JSON para datos embebidos que siempre se leen juntos y no se consultan
model AuditLog {
  id      String @id @default(uuid())
  metadata Json   // { "ip": "1.2.3.4", "userAgent": "Mozilla/..." }
}
```

### Composite Keys

```prisma
model Membership {
  userId String
  teamId String
  role   UserRole
  joinedAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id])
  team Team @relation(fields: [teamId], references: [id])

  @@id([userId, teamId])
  @@index([teamId])
}
```

## Indexing Strategies

```prisma
model Post {
  id        String   @id @default(uuid())
  authorId  String
  slug      String   @unique
  status    PostStatus
  createdAt DateTime @default(now())
  publishedAt DateTime?

  author User @relation(fields: [authorId], references: [id])

  // Compuestos para queries comunes
  @@index([authorId, status])
  @@index([status, publishedAt])
  @@index([createdAt])
}
```

## Migration of Data Patterns

```typescript
// Backfill pattern for new columns
async function backfillSlug() {
  const posts = await prisma.post.findMany({
    where: { slug: null },
    take: 100,
  });

  for (const post of posts) {
    await prisma.post.update({
      where: { id: post.id },
      data: { slug: slugify(post.title) },
    });
  }
}
```

## Summary Decision Table

| Pattern | Use When | Avoid When |
|---------|----------|------------|
| **Normalized** | Data integrity critical | Read-heavy, high throughput |
| **Denormalized** | Read performance > write | Frequent updates |
| **Soft Delete** | Data recovery needed | GDPR/purge requirements |
| **Audit Log** | Compliance/history needed | High write volume |
| **Temporal** | Full version history needed | Storage constrained |
| **JSON field** | Variable schema, embebbed data | Need to query individual fields |
| **Enum** | Fixed set of values | Values change frequently |
