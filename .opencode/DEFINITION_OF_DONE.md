# Definition of Done (DoD)

Every task MUST satisfy ALL applicable gates before it can be marked complete.

## Mandatory Gates

### 1. Compilation Gate
- Project compiles without errors
- No TypeScript errors (strict mode)
- No dependency resolution errors

### 2. Lint Gate
- ESLint passes with zero errors
- Oxlint passes if configured
- Prettier format check passes
- No unused imports or variables

### 3. TypeCheck Gate
- TypeScript strict mode passes
- No `any` types without documented justification
- Proper generics used where applicable
- No implicit `any` in function parameters

### 4. Test Gate
- Unit tests: ≥ 80% line coverage
- All existing tests continue to pass
- New code has corresponding tests
- Edge cases are covered

### 5. Integration Gate
- API integration tests pass
- Database integration tests pass
- Third-party integration tests pass
- Error handling is tested

### 6. E2E Gate (UI projects)
- Critical user flows pass
- All page loads succeed
- Form submissions work correctly
- Navigation flows work

### 7. Accessibility Gate
- WCAG AA compliance confirmed
- Keyboard navigation works
- Screen reader tested
- Color contrast ratios ≥ 4.5:1 (text)
- Focus indicators visible
- ARIA attributes correct
- No accessibility violations in audit

### 8. Performance Gate
- Lighthouse score ≥ 90 in all categories
- No layout shifts > 0.1 CLS
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- No render-blocking resources
- Images are optimized
- Bundle size is monitored

### 9. Security Gate
- No hardcoded secrets or credentials
- Input validation is implemented
- Output is properly escaped (XSS prevention)
- CSRF protection is in place
- Rate limiting is configured for APIs
- Dependencies are scanned for vulnerabilities
- Proper authentication and authorization

### 10. Architecture Gate
- Follows established patterns in ADRs
- No circular dependencies
- Proper separation of concerns
- Follows the defined folder structure
- Components are properly modularized
- No architectural anti-patterns

### 11. Documentation Gate
- README.md is updated if needed
- API documentation is current
- Component documentation exists
- CHANGELOG.md has entry for this change
- ADR created or updated for architectural decisions

### 12. Code Review Gate
- Code reviewed by at least one peer
- No critical or high-severity findings
- All review comments are resolved
- Lead has approved the merge

### 13. QA Gate
- QA Director has signed off
- QA_REPORT.md is generated
- All test levels pass
- No known regressions

## Gate Weight Table

| Gate | Blocking | Non-Blocking Warning |
|------|----------|---------------------|
| Compilation | ❌ | - |
| Lint | ❌ | Warnings |
| TypeCheck | ❌ | - |
| Unit Tests | ❌ Coverage < 80% | Coverage < 90% |
| Integration Tests | ❌ | - |
| E2E Tests | ❌ | - |
| Accessibility | ❌ AA violations | AAA violations |
| Performance | ❌ Score < 80 | Score < 90 |
| Security | ❌ Critical/High | Medium/Low |
| Architecture | ❌ Pattern violations | Minor inconsistencies |
| Documentation | ❌ Missing required docs | Minor gaps |
| Code Review | ❌ Unresolved critical | Unresolved warnings |
| QA | ❌ Failed tests | Coverage gaps |

## DoD Verification Process

```
1. Developer runs local checks (compile, lint, typecheck, test)
2. Developer creates pull request
3. Review Director assigns reviewers
4. Reviewers verify their domains
5. QA Director runs full test suite
6. Documentation Director verifies docs
7. Lead performs final DoD check
8. Architect approves architecture compliance
9. All gates pass → Task complete
10. Any gate fails → Return for fixes
```
