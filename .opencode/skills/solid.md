# SOLID Principles

## Objetivos
- Aplicar SOLID en TypeScript, NestJS y Vue components para código mantenible
- Reconocer violaciones de cada principio y refactorizarlas
- Diseñar interfaces pequeñas, dependencias invertidas y clases con una sola responsabilidad

## Best Practices
- SRP: cada clase/módulo debe tener una sola razón para cambiar; extraer servicios separados
- OCP: extender con nuevas clases (strategy, decorator) sin modificar código existente
- LSP: subtipos deben ser sustituibles sin alterar el contrato; no lanzar excepciones inesperadas
- ISP: interfaces pequeñas y específicas para cada cliente, no interfaces generalistas
- DIP: depender de abstracciones (interfaces/abstract classes), no de implementaciones concretas

## Anti-Patterns
- God Class (viola SRP): clases de miles de líneas con múltiples responsabilidades
- Herencia profunda (viola LSP): jerarquías frágiles donde subtipos rompen el contrato
- Fat Interfaces (viola ISP): interfaces con métodos que muchos clientes no usan

## Errores Comunes
- Inyectar dependencias concretas en NestJS sin usar interfaces (viola DIP)
- Añadir condicionales (if/switch) en lugar de extender con polimorfismo (viola OCP)
- Crear herencia solo para reutilizar código cuando debería usarse composición (viola LSP)

## Checklist
- [ ] Cada clase tiene una única responsabilidad y razón para cambiar
- [ ] Nuevo comportamiento se añade extendiendo, no modificando código existente
- [ ] Subtipos son intercambiables sin romper el cliente
- [ ] Interfaces son pequeñas y específicas para cada consumidor
- [ ] Inyección de dependencias usa abstracciones, no clases concretas

## Convenciones
- Interfaces con prefijo I (ej: IUserRepository) para tipos inyectables
- Implementaciones con sufijo Impl (ej: UserRepositoryImpl) o concreto (UserRepository)
- Providers en NestJS registrados con useClass o useFactory para cumplir DIP

## Ejemplos
```typescript
// SRP + DIP en NestJS
@Injectable()
export class OrderService {
  constructor(
    private readonly repository: IOrderRepository,
    private readonly notifier: INotificationService,
    private readonly logger: ILogger
  ) {}
}

// OCP con Strategy Pattern
interface IDiscountStrategy {
  calculate(amount: number): number;
}

class NoDiscount implements IDiscountStrategy {
  calculate(amount: number): number { return amount; }
}

class PercentageDiscount implements IDiscountStrategy {
  constructor(private readonly percent: number) {}
  calculate(amount: number): number { return amount * (1 - this.percent / 100); }
}

// LSP: subtipos sustituibles
abstract class Shape {
  abstract area(): number;
}
class Rectangle extends Shape {
  constructor(protected w: number, protected h: number) { super(); }
  area() { return this.w * this.h; }
}
// Square hereda sin romper LSP (no modifica w/h independientemente)
class Square extends Shape {
  constructor(private side: number) { super(); }
  area() { return this.side * this.side; }
}
```

## Referencias Oficiales
- Robert C. Martin - SOLID: https://blog.cleancoder.com/uncle-bob/2020/10/18/Solid-Relevance.html
- TypeScript SOLID Examples: https://www.typescriptlang.org/docs/handbook/2/classes.html
- NestJS Providers: https://docs.nestjs.com/providers
