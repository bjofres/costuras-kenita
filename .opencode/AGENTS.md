# Agent Registry

## Orchestrator

| ID | Role | File | Reports To |
|----|------|------|------------|
| orchestrator | Orchestrator (Chief of Staff) | agents/directors/orchestrator.md | User |

## Directors

| ID | Role | File | Reports To |
|----|------|------|------------|
| dir-arch | Architecture Director | agents/directors/architecture.md | Orchestrator |
| dir-db | Database Director | agents/directors/database.md | Architecture Director |
| dir-anim | Animation Director | agents/directors/animation.md | Architecture Director |
| dir-qa | QA Director | agents/directors/qa.md | Architecture Director |
| dir-review | Review Director | agents/directors/review.md | Architecture Director |
| dir-docs | Documentation Director | agents/directors/documentation.md | Architecture Director |

## Leads

| ID | Role | File | Reports To |
|----|------|------|------------|
| lead-fe | Frontend Lead | agents/leads/frontend.md | Architecture Director |
| lead-be | Backend Lead | agents/leads/backend.md | Architecture Director |

## Frontend Specialists

| ID | Role | File | Reports To |
|----|------|------|------------|
| spe-vue | Vue Expert | agents/specialists/frontend/vue.md | Frontend Lead |
| spe-nuxt | Nuxt Expert | agents/specialists/frontend/nuxt.md | Frontend Lead |
| spe-tailwind | Tailwind Expert | agents/specialists/frontend/tailwind.md | Frontend Lead |
| spe-typescript | TypeScript Expert | agents/specialists/frontend/typescript.md | Frontend Lead |
| spe-pinia | Pinia Expert | agents/specialists/frontend/pinia.md | Frontend Lead |
| spe-vueuse | VueUse Expert | agents/specialists/frontend/vueuse.md | Frontend Lead |
| spe-shadcn | Shadcn Vue Expert | agents/specialists/frontend/shadcn.md | Frontend Lead |
| spe-floating | Floating UI Expert | agents/specialists/frontend/floating-ui.md | Frontend Lead |
| spe-seo | SEO Expert | agents/specialists/frontend/seo.md | Frontend Lead |
| spe-a11y | Accessibility Expert | agents/specialists/frontend/accessibility.md | Frontend Lead |
| spe-perf-fe | Performance Expert | agents/specialists/frontend/performance.md | Frontend Lead |

## Animation Specialists

| ID | Role | File | Reports To |
|----|------|------|------------|
| spe-gsap | GSAP Expert | agents/specialists/animation/gsap.md | Animation Director |
| spe-lenis | Lenis Expert | agents/specialists/animation/lenis.md | Animation Director |
| spe-motion | Motion Expert | agents/specialists/animation/motion.md | Animation Director |
| spe-three | Three.js Expert | agents/specialists/animation/three.md | Animation Director |
| spe-lottie | Lottie Expert | agents/specialists/animation/lottie.md | Animation Director |
| spe-svg | SVG Expert | agents/specialists/animation/svg.md | Animation Director |
| spe-canvas | Canvas Expert | agents/specialists/animation/canvas.md | Animation Director |
| spe-css-anim | CSS Animation Expert | agents/specialists/animation/css-animation.md | Animation Director |
| spe-scroll | Scroll Animations Expert | agents/specialists/animation/scroll.md | Animation Director |
| spe-micro | Microinteractions Expert | agents/specialists/animation/microinteractions.md | Animation Director |
| spe-trans | Page Transitions Expert | agents/specialists/animation/page-transitions.md | Animation Director |
| spe-text | Text Reveal Expert | agents/specialists/animation/text-reveal.md | Animation Director |
| spe-parallax | Parallax Expert | agents/specialists/animation/parallax.md | Animation Director |
| spe-sticky | Sticky Sections Expert | agents/specialists/animation/sticky.md | Animation Director |

## Backend Specialists

| ID | Role | File | Reports To |
|----|------|------|------------|
| spe-nestjs | NestJS Expert | agents/specialists/backend/nestjs.md | Backend Lead |
| spe-fastify | Fastify Expert | agents/specialists/backend/fastify.md | Backend Lead |
| spe-express | Express Expert | agents/specialists/backend/express.md | Backend Lead |
| spe-auth | Authentication Expert | agents/specialists/backend/auth.md | Backend Lead |
| spe-authz | Authorization Expert | agents/specialists/backend/authorization.md | Backend Lead |
| spe-rest | REST API Expert | agents/specialists/backend/rest.md | Backend Lead |
| spe-graphql | GraphQL Expert | agents/specialists/backend/graphql.md | Backend Lead |
| spe-websocket | WebSocket Expert | agents/specialists/backend/websocket.md | Backend Lead |
| spe-queue | Queue Expert | agents/specialists/backend/queue.md | Backend Lead |
| spe-cache | Caching Expert | agents/specialists/backend/caching.md | Backend Lead |

## Database Specialists

| ID | Role | File | Reports To |
|----|------|------|------------|
| spe-pgsql | PostgreSQL Expert | agents/specialists/database/postgresql.md | Database Director |
| spe-mysql | MySQL Expert | agents/specialists/database/mysql.md | Database Director |
| spe-sqlite | SQLite Expert | agents/specialists/database/sqlite.md | Database Director |
| spe-mongodb | MongoDB Expert | agents/specialists/database/mongodb.md | Database Director |
| spe-redis | Redis Expert | agents/specialists/database/redis.md | Database Director |
| spe-prisma | Prisma Expert | agents/specialists/database/prisma.md | Database Director |
| spe-drizzle | Drizzle Expert | agents/specialists/database/drizzle.md | Database Director |

## Architecture Specialists

| ID | Role | File | Reports To |
|----|------|------|------------|
| spe-ddd | DDD Expert | agents/specialists/architecture/ddd.md | Architecture Director |
| spe-solid | SOLID Expert | agents/specialists/architecture/solid.md | Architecture Director |
| spe-clean | Clean Architecture Expert | agents/specialists/architecture/clean-architecture.md | Architecture Director |
| spe-hexagonal | Hexagonal Architecture Expert | agents/specialists/architecture/hexagonal.md | Architecture Director |
| spe-cqrs | CQRS Expert | agents/specialists/architecture/cqrs.md | Architecture Director |
| spe-repo | Repository Pattern Expert | agents/specialists/architecture/repository.md | Architecture Director |
| spe-di | Dependency Injection Expert | agents/specialists/architecture/dependency-injection.md | Architecture Director |

## QA Specialists

| ID | Role | File | Reports To |
|----|------|------|------------|
| spe-unit | Unit Testing Expert | agents/specialists/qa/unit-testing.md | QA Director |
| spe-int | Integration Testing Expert | agents/specialists/qa/integration-testing.md | QA Director |
| spe-e2e | Playwright E2E Expert | agents/specialists/qa/playwright.md | QA Director |
| spe-a11y-test | Accessibility Tester | agents/specialists/qa/accessibility-tester.md | QA Director |
| spe-perf-test | Performance Tester | agents/specialists/qa/performance-tester.md | QA Director |
| spe-sec-test | Security Tester | agents/specialists/qa/security-tester.md | QA Director |
| spe-regr-test | Regression Tester | agents/specialists/qa/regression-tester.md | QA Director |

## Review Specialists

| ID | Role | File | Reports To |
|----|------|------|------------|
| spe-code-rv | Code Reviewer | agents/specialists/review/code-reviewer.md | Review Director |
| spe-arch-rv | Architecture Reviewer | agents/specialists/review/architecture-reviewer.md | Review Director |
| spe-sec-rv | Security Reviewer | agents/specialists/review/security-reviewer.md | Review Director |
| spe-perf-rv | Performance Reviewer | agents/specialists/review/performance-reviewer.md | Review Director |
| spe-a11y-rv | Accessibility Reviewer | agents/specialists/review/accessibility-reviewer.md | Review Director |
| spe-ux-rv | UX Reviewer | agents/specialists/review/ux-reviewer.md | Review Director |
| spe-fe-rv | Frontend Reviewer | agents/specialists/review/frontend-reviewer.md | Review Director |
| spe-be-rv | Backend Reviewer | agents/specialists/review/backend-reviewer.md | Review Director |

## Documentation Specialists

| ID | Role | File | Reports To |
|----|------|------|------------|
| spe-readme | README Writer | agents/specialists/documentation/readme-writer.md | Documentation Director |
| spe-adr | ADR Writer | agents/specialists/documentation/adr-writer.md | Documentation Director |
| spe-api-doc | API Documentation Writer | agents/specialists/documentation/api-writer.md | Documentation Director |
| spe-changelog | Changelog Writer | agents/specialists/documentation/changelog-writer.md | Documentation Director |
| spe-diagram | Diagram Writer | agents/specialists/documentation/diagram-writer.md | Documentation Director |
