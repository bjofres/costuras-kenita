# Workflow Registry

| ID | Workflow | File | Trigger |
|----|----------|------|---------|
| WF-01 | New Feature | workflows/new-feature.md | User request |
| WF-02 | Bug Fix | workflows/bug-fix.md | Bug report |
| WF-03 | Refactor | workflows/refactor.md | Tech debt resolution |
| WF-04 | New API | workflows/new-api.md | API requirement |
| WF-05 | New Component | workflows/new-component.md | UI requirement |
| WF-06 | New Animation | workflows/new-animation.md | Motion requirement |
| WF-07 | New Database | workflows/new-database.md | Data model change |
| WF-08 | New Migration | workflows/new-migration.md | Schema change |
| WF-09 | Deploy | workflows/deploy.md | Release |
| WF-10 | Hotfix | workflows/hotfix.md | Production incident |
| WF-11 | Documentation | workflows/documentation.md | Doc requirement |

## Workflow Engine

All workflows follow the SDD pipeline:

```
┌─────────────────────────────────────────────────────────┐
│                   1. DISCOVERY                           │
│  Understand requirements, constraints, context          │
│  Output: Discovery brief                                 │
├─────────────────────────────────────────────────────────┤
│                   2. SPECIFICATION                       │
│  Write SPEC.md with stories, criteria, constraints      │
│  Output: SPEC.md                                         │
├─────────────────────────────────────────────────────────┤
│                   3. ARCHITECTURE                        │
│  Design technical solution, update ADRs                 │
│  Output: ARCHITECTURE.md, ADRs                          │
├─────────────────────────────────────────────────────────┤
│                   4. PLAN                                │
│  Create task breakdown with estimates                   │
│  Output: PLAN.md                                         │
├─────────────────────────────────────────────────────────┤
│                   5. IMPLEMENTATION                      │
│  Write code per spec, following patterns                │
│  Output: Working code                                    │
├─────────────────────────────────────────────────────────┤
│                   6. REVIEW                              │
│  Code review, architecture review, security review      │
│  Output: REVIEW.md                                       │
├─────────────────────────────────────────────────────────┤
│                   7. QA                                  │
│  All test levels, a11y, perf, security verification     │
│  Output: QA_REPORT.md                                    │
├─────────────────────────────────────────────────────────┤
│                   8. DOCUMENTATION                       │
│  Docs, changelog, ADRs, README updates                  │
│  Output: Updated docs                                    │
├─────────────────────────────────────────────────────────┤
│                   9. DELIVERY                            │
│  Merge, deploy, notify                                   │
│  Output: Delivered artifact                              │
└─────────────────────────────────────────────────────────┘
```

## Agent Invocation by Workflow

| Workflow | Primary Agent | Support Agents |
|----------|--------------|----------------|
| New Feature | Frontend Lead / Backend Lead | All specialists as needed |
| Bug Fix | Relevant specialist | QA Director |
| Refactor | Architecture Director | All leads |
| New API | Backend Lead | Database Director, Auth Expert |
| New Component | Frontend Lead | Animation Dir., A11y Expert |
| New Animation | Animation Director | Frontend Lead, Perf Expert |
| New Database | Database Director | Architecture Director |
| New Migration | Database Director | Backend Lead |
| Deploy | Architecture Director | All directors |
| Hotfix | Relevant Lead | QA Director, Review Director |
| Documentation | Documentation Director | All leads |
