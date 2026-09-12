# TypeScript

## Objetivos
- Usar strict mode, utility types, genéricos, type inference y branded types correctamente
- Implementar discriminated unions, template literal types, conditional types y mapped types
- Aprovechar satisfies operator, const assertions, declaration files y tsconfig paths

## Best Practices
- Habilitar `strict: true` en tsconfig para máximo rigor de tipos
- Usar `satisfies` en lugar de anotaciones de tipo para validar estructuras sin perder inferencia
- Preferir `interface` para objetos públicos/API y `type` para uniones, tuplas y utilitarios
- Utilizar branded types (`type Email = string & { __brand: 'Email' }`) para tipos nominales
- Definir paths alias en `tsconfig.json` con `@/` como prefijo estándar

## Anti-Patterns
- Abusar de `any`: desactiva completamente el type checker, usar `unknown` + type guards
- Usar `as` (type assertion) para silenciar errores sin resolver la causa raíz
- Mezclar `namespace` y `module`: genera conflictos, preferir ES modules + imports
- Tipar excesivamente con tipos literales complejos cuando una interfaz simple basta

## Errores Comunes
- No diferenciar `null` y `undefined` con el flag `strictNullChecks`
- Olvidar que `readonly` no es profundo (usar `as const` o `DeepReadonly`)
- Confundir `interface` (extensible) con `type` (cerrado, alias)
- Usar `const enum` que genera código inline y rompe con bundlers modernos

## Checklist
- [ ] ¿`strict: true` está habilitado en tsconfig?
- [ ] ¿No hay usos de `any` sin justificación documentada?
- [ ] ¿Las funciones tienen tipos explícitos en parámetros y retorno?
- [ ] ¿Se usan branded types para IDs y valores semánticos?
- [ ] ¿Los paths alias están configurados en tsconfig?

## Convenciones
- Naming: interfaces con prefijo `I` solo si hay ambigüedad, tipos en PascalCase
- Genéricos: usar `T` para simple, nombres descriptivos (`TData`, `TError`) para complejos
- Declarations: archivos `.d.ts` para tipos globales, exportar tipos desde `types/`
- imports: usar `type` keyword para imports que solo son tipos (`import type { Foo }`)

## Ejemplos
```typescript
// strict mode, branded type, satisfies, discriminated union
type UserId = string & { __brand: 'UserId' }
type Status = 'active' | 'inactive' | 'banned'

interface User {
  id: UserId
  name: string
  status: Status
}

const users = [
  { id: 'abc' as UserId, name: 'Alice', status: 'active' },
  { id: 'def' as UserId, name: 'Bob', status: 'inactive' }
] satisfies User[]

type ActiveUsers = Extract<typeof users[number], { status: 'active' }>
```

## Referencias Oficiales
- Strict Mode: https://www.typescriptlang.org/tsconfig#strict
- Utility Types: https://www.typescriptlang.org/docs/handbook/utility-types.html
- satisfies Operator: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html