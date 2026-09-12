# Global Engineering Rules

## 1. Specification Driven Development (SDD)

- **Never write code before a specification exists** for the task.
- Every task must produce a SPEC.md or reference an existing one.
- Specifications must be approved by the relevant Lead before implementation begins.
- Changes to specifications mid-implementation must be approved and versioned.

## 2. Agent Hierarchy & Escalation

- Specialists execute; Leads coordinate; Directors govern.
- Agents must never skip levels in the hierarchy without justification.
- When a specialist cannot resolve an issue, they escalate to their Lead.
- When a Lead cannot resolve, they escalate to the relevant Director.
- Cross-domain issues go to the appropriate Directors.

## 3. Quality Gates

Every deliverable must pass all applicable quality gates before being marked complete:

| Gate | Owner | Requirement |
|------|-------|-------------|
| Syntax | Lead | Compiles, lints, typechecks |
| Unit | QA Director | Coverage ≥ 80% |
| Integration | QA Director | All integration tests pass |
| E2E | QA Director | All E2E tests pass |
| Accessibility | QA Director | WCAG AA (AAA for critical paths) |
| Performance | QA Director | Lighthouse ≥ 90 |
| Security | Review Director | Zero critical/high vulns |
| Architecture | Architecture Director | Follows ADRs |
| Documentation | Documentation Director | Docs complete |
| Changelog | Documentation Director | CHANGELOG updated |

## 4. Artifact Standards

- **SPEC.md** must include: objective, user stories, acceptance criteria, technical constraints, out of scope
- **ARCHITECTURE.md** must include: system context, component diagram, data model, sequence diagrams, ADRs
- **PLAN.md** must include: task breakdown, estimates, dependencies, risk assessment
- **REVIEW.md** must include: findings by severity, code quality score, recommendations
- **QA_REPORT.md** must include: test results, coverage report, accessibility audit, performance audit, security scan

## 5. Communication Rules

- Use Spanish for all internal communication and documentation.
- Technical terms, code, and error messages remain in English.
- All artifacts must be written in clear, professional language.
- When delegating, always include: context, objective, constraints, output format.

## 6. Documentation Rules

- Every project must have: README.md, ARCHITECTURE.md, CHANGELOG.md
- Every significant decision must have an ADR in `docs/adr/`
- Every API endpoint must be documented (OpenAPI/Swagger for REST, SDL for GraphQL)
- Documentation must be maintained alongside code changes

## 7. Testing Rules

- Unit tests are mandatory for all business logic.
- Integration tests are mandatory for all API endpoints.
- E2E tests are mandatory for critical user flows.
- Accessibility tests are mandatory for all UI components.
- Performance tests are mandatory for all critical paths.

## 8. Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch
- `feat/*`: Feature branches
- `fix/*`: Bug fix branches
- `refactor/*`: Refactoring branches
- `docs/*`: Documentation branches

## 9. Commit Standards

- Follow Conventional Commits: `type(scope): description`
- Types: feat, fix, refactor, docs, test, chore, perf, security, style
- Scope: component, module, or area affected
- Description: imperative, present tense, no period

## 10. Code Review Rules

- All code must be reviewed before merging.
- Review must check: correctness, architecture, security, performance, accessibility, style.
- Critical issues block merge; warnings should be addressed.
- At least one approval from a Lead is required for merge.

## 11. Definition of Done (Mandatory)

Every task is complete only when ALL items in DEFINITION_OF_DONE.md are verified.

## 12. AI Agent Conduct

- Agents must identify themselves by role when starting a task.
- Agents must never make assumptions about requirements; always ask if unclear.
- Agents must log their decisions and reasoning.
- Agents must flag when they exceed their authority or expertise.
- Agents must never commit secrets, credentials, or sensitive data.
