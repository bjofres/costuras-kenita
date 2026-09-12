# Testing (General)

## Objetivos
- Aplicar la pirámide de tests con la estrategia adecuada (TDD/BDD)
- Distinguir y elegir entre tipos de tests (unitarios, integración, E2E, visuales, mutación)
- Escribir tests mantenibles usando AAA y Given-When-Then

## Best Practices
- Seguir el patrón AAA (Arrange-Act-Assert) para tests legibles y estructurados
- Priorizar unit tests (60-70%) sobre integration (20-25%) y E2E (5-10%) en la pirámide
- Escribir tests como Given-When-Then en BDD para alinear negocio y código
- Usar mocks para límites externos (APIs, DB) y stubs para datos predecibles
- Mantener cobertura de línea > 80% y branch > 70% como meta mínima

## Anti-Patterns
- Tests acoplados a implementación (test white-box frágil): probar comportamiento, no internals
- Mockear todo: solo mockear lo que cruza fronteras del sistema (I/O, red, DB)
- Tests que dependen de orden de ejecución: cada test debe ser independiente y repetible

## Errores Comunes
- Ignorar flaky tests: deshabilitarlos o repararlos inmediatamente, no acumularlos
- Cobertura como única métrica: alta cobertura no garantiza tests de calidad
- No limpiar estado entre tests (DB, mocks, filesystem) causando contaminación

## Checklist
- [ ] Seguir AAA en cada test (Arrange-Act-Assert)
- [ ] Mantener piramide de tests balanceada (unit > integration > e2e)
- [ ] Resetear mocks/stubs en afterEach o beforeEach
- [ ] Ejecutar property-based testing para lógica compleja
- [ ] Monitorear flaky tests con herramienta de CI y retries automáticos

## Convenciones
- Nombrar tests con formato "should [expected] when [condition]"
- Test unitario por archivo fuente: *.spec.ts
- Fixtures en tests/fixtures/ con datos serializados (JSON)

## Ejemplos
```typescript
// AAA Pattern + Given-When-Then
describe('OrderService.calculateTotal', () => {
  it('should apply 10% discount when total exceeds $100', () => {
    // Arrange
    const items = [new Item('Laptop', 150)];
    const service = new OrderService(new DiscountPolicy());
    // Act
    const total = service.calculateTotal(items);
    // Assert
    expect(total).toBe(135); // 150 - 15
  });
});

// Property-based testing
import fc from 'fast-check';
it('should always be positive for valid inputs', () => {
  fc.assert(
    fc.property(fc.integer({ min: 1, max: 10000 }), (price) => {
      const result = new TaxCalculator().compute(price, 'standard');
      return result >= 0 && result <= price;
    })
  );
});
```

## Referencias Oficiales
- Martin Fowler - TestPyramid: https://martinfowler.com/bliki/TestPyramid.html
- xUnit Patterns: http://xunitpatterns.com/
- fast-check: https://github.com/dubzzz/fast-check
