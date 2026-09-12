# Domain-Driven Design

## Objetivos
- Modelar dominios complejos con lenguaje ubicuo y bounded contexts
- Diseñar aggregates con raíces claras y límites de consistencia
- Aplicar patrones tácticos (entities, value objects, domain events, services)

## Best Practices
- Definir bounded contexts explícitos con contractos entre contextos (context maps)
- Preferir value objects inmutables sobre primitivos para modelar conceptos del dominio
- Diseñar aggregates pequeños: cargar solo lo necesario para la transacción
- Usar domain events para efectos secundarios entre aggregates (eventual consistency)
- Separar application services (orquestación) de domain services (lógica de negocio pura)

## Anti-Patterns
- Anemic Domain Model: objetos sin comportamiento, solo getters/setters
- Smart UI anti-pattern: lógica de negocio en controladores o vistas
- God Aggregate: aggregate que carga demasiadas entidades y viola el límite de consistencia

## Errores Comunes
- Confundir entities (identidad) con value objects (igualdad por atributos)
- Ignorar los bounded contexts y crear un modelo de dominio monolítico
- Usar eventos de dominio para flujos síncronos intensivos; deben ser asíncronos

## Checklist
- [ ] Identificar lenguaje ubicuo con stakeholders y documentarlo en glosario
- [ ] Mapear bounded contexts y sus relaciones
- [ ] Modelar aggregates con raíz (Aggregate Root) y reglas de consistencia
- [ ] Separar application services de domain services
- [ ] Implementar domain events con al menos un handler por evento

## Convenciones
- Value objects son inmutables con equals basado en todos los atributos
- Aggregate Root es la única entidad referenciable desde fuera del aggregate
- Repositorios solo para aggregates, no para entidades internas

## Ejemplos
```typescript
// Value Object inmutable
class Money {
  constructor(readonly amount: number, readonly currency: string) {
    if (amount < 0) throw new Error('Amount must be positive');
  }
  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
  add(other: Money): Money {
    if (this.currency !== other.currency) throw new Error('Currency mismatch');
    return new Money(this.amount + other.amount, this.currency);
  }
}

// Aggregate Root
class Order {
  constructor(
    readonly id: OrderId,
    private items: OrderItem[],
    private status: OrderStatus
  ) {}

  addItem(product: Product, quantity: number): void {
    if (this.status !== OrderStatus.DRAFT) throw new Error('Only DRAFT orders can be modified');
    this.items.push(new OrderItem(product, quantity));
    this.addDomainEvent(new ItemAddedEvent(this.id, product.id));
  }

  submit(): void {
    if (this.items.length === 0) throw new Error('Cannot submit empty order');
    this.status = OrderStatus.SUBMITTED;
    this.addDomainEvent(new OrderSubmittedEvent(this.id));
  }
}
```

## Referencias Oficiales
- Domain-Driven Design (Eric Evans): https://www.domainlanguage.com/
- Vaughn Vernon - DDD Distilled: https://www.informit.com/store/ddd-distilled-9780134434421
- Martin Fowler - DDD: https://martinfowler.com/tags/domain%20driven%20design.html
