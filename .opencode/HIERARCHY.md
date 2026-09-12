# Agent Hierarchy

## Organizational Structure

```
                        ┌──────────────────────┐
                        │   Architecture Dir.  │
                        │   (System Design)    │
                        └──────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          │                         │                         │
          ▼                         ▼                         ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Database Dir.   │    │  Animation Dir.  │    │  QA Director     │
│  (Data Layer)    │    │  (Motion Design) │    │  (Quality)       │
└──────────────────┘    └──────────────────┘    └──────────────────┘
                                                    │
          ┌─────────────────────────┼─────────────────────────┐
          │                         │                         │
          ▼                         ▼                         ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Review Director │    │  Documentation   │    │  Frontend Lead   │
│  (Audit)         │    │  Director        │    │  (Coordination)  │
└──────────────────┘    └──────────────────┘    └──────────────────┘
                                                    │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
         ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
         │  Vue Expert  │  │  Nuxt Expert │  │  Tailwind    │
         │  (Component) │  │  (Pages)     │  │  Expert      │
         └──────────────┘  └──────────────┘  └──────────────┘

         ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
         │  GSAP Expert │  │  Three.js    │  │  Motion      │
         │  (Animation) │  │  Expert      │  │  Expert      │
         └──────────────┘  └──────────────┘  └──────────────┘

         ┌──────────────┐  ┌──────────────┐
         │  SEO Expert  │  │  A11y Expert │
         └──────────────┘  └──────────────┘
                            &
                    ┌──────────────────┐
                    │  Backend Lead    │
                    │  (Coordination)  │
                    └──────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  NestJS      │    │  Fastify     │    │  Auth Expert │
│  Expert      │    │  Expert      │    │  (JWT/OAuth) │
└──────────────┘    └──────────────┘    └──────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Prisma      │    │  PostgreSQL  │    │  Redis       │
│  Expert      │    │  Expert      │    │  Expert      │
└──────────────┘    └──────────────┘    └──────────────┘
```

## Escalation Paths

| Issue Type | Escalate To | Final Authority |
|------------|-------------|-----------------|
| Technical decision | Lead | Architecture Director |
| Architecture violation | Architecture specialist | Architecture Director |
| Quality failure | QA specialist | QA Director |
| Security concern | Security specialist | Review Director |
| Documentation gap | Documentation specialist | Documentation Director |
| Animation quality | Animation specialist | Animation Director |
| Database design | Database specialist | Database Director |
| Cross-team conflict | Lead | Architecture Director |

## Decision Authority

| Decision | Authority |
|----------|-----------|
| Technology selection | Architecture Director |
| Database schema | Database Director |
| Animation approach | Animation Director |
| API design | Backend Lead |
| Component design | Frontend Lead |
| Test strategy | QA Director |
| Deployment strategy | Architecture Director |
| Documentation format | Documentation Director |

## Collaboration Matrix

| Domain | Primary | Consults | Informs |
|--------|---------|----------|---------|
| API Design | Backend Lead | Architecture Dir., Database Dir. | Frontend Lead |
| Database Schema | Database Director | Architecture Dir. | Backend Lead |
| Component Design | Frontend Lead | Animation Dir., A11y Expert | Backend Lead |
| Animation | Animation Director | Frontend Lead | QA Director |
| Testing | QA Director | All Leads | Review Director |
| Deployment | Architecture Director | All Directors | Documentation Dir. |
