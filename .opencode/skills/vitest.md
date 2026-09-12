# Vitest

## Objetivos
- Configurar Vitest con integración nativa de Vite para tests ultrarrápidos
- Implementar mocking, cobertura y snapshots de forma eficiente
- Estructurar tests unitarios, de integración y e2e con workspace y reporters

## Best Practices
- Usar vi.mock y vi.importActual para mockear módulos sin perder tipos
- Configurar coverage con v8 (por defecto) o istanbul, excluyendo node_modules y test helpers
- Mantener snapshots ligeros y actualizarlos con --update tras cambios intencionados
- Definir workspace multi-proyecto para separar tests unitarios, integración y e2e
- Activar watch mode con --reporter verbose para feedback rápido en desarrollo

## Anti-Patterns
- Mockear demasiado: prefierir fixtures y datos reales sobre mocks profundos
- Snapshots enormes (más de 50 líneas): difíciles de revisar; usar inline snapshots o toMatchSnapshot parcial
- Compartir vi.fn() entre tests sin reset: cada test debe tener mocks frescos

## Errores Comunes
- Olvidar vi.unmock o vi.restoreAllMocks en afterEach dejando mocks residuales
- Ejecutar tests de integración sin limpiar base de datos entre ejecuciones
- Usar fake timers (vi.useFakeTimers) sin restaurarlos, causando timeouts

## Checklist
- [ ] Configurar vitest.config.ts con alias de Vite y exclude correcto
- [ ] Resetear mocks en afterEach (vi.restoreAllMocks)
- [ ] Separar test unitarios, integración y e2e usando workspace
- [ ] Activar coverage con reporter lcov y html
- [ ] Usar --reporter=html en CI para visualizar resultados

## Convenciones
- Tests unitarios junto al archivo fuente con sufijo .spec.ts
- Tests de integración en tests/integration/ con sufijo .int.spec.ts
- Mock factories en tests/__mocks__/ con la misma estructura que el source

## Ejemplos
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from './user.service';
import { Database } from './database';

vi.mock('./database');

describe('UserService', () => {
  let service: UserService;
  let db: Database;

  beforeEach(() => {
    vi.restoreAllMocks();
    db = new Database();
    service = new UserService(db);
  });

  it('should create a user', async () => {
    vi.mocked(db.save).mockResolvedValue({ id: 1, name: 'Alice' });
    const user = await service.createUser({ name: 'Alice' });
    expect(user.id).toBe(1);
    expect(db.save).toHaveBeenCalledWith({ name: 'Alice' });
  });

  it('should throw on duplicate email', async () => {
    vi.mocked(db.save).mockRejectedValue(new Error('Duplicate email'));
    await expect(service.createUser({ email: 'a@a.com' })).rejects.toThrow('Duplicate email');
  });
});
```

## Referencias Oficiales
- Vitest Docs: https://vitest.dev/guide/
- Vitest Config: https://vitest.dev/config/
- Vitest Workspace: https://vitest.dev/guide/workspace
