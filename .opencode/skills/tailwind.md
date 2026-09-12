# TailwindCSS

## Objetivos
- Aplicar utility-first workflow con responsive design, dark mode y custom config
- Gestionar design tokens, arbitrary values, @apply, layers y JIT engine
- Optimizar rendimiento y tamaño de builds con purga y configuración precisa

## Best Practices
- Usar utility classes primero; `@apply` solo para abstraer patrones repetitivos (preferir componentes)
- Configurar design tokens en `tailwind.config.js` (colores, fuentes, spacing) en lugar de arbitrary values
- Aprovechar `theme()` en CSS para acceder a tokens sin duplicar valores
- Habilitar `darkMode: 'class'` para control programático sobre dark mode
- Usar `xl` y `2xl` para pantallas grandes, `sm` para móvil; Mobile-First siempre

## Anti-Patterns
- Abusar de `@apply` en componentes pequeños: pierde las ventajas de utility-first y aumenta CSS output
- Usar arbitrary values (`h-[32px]`) cuando el valor existe en `theme.spacing`: rompe consistencia
- Ignorar la purga: clases generadas dinámicamente deben estar en el contenido configurado
- Mezclar Tailwind con CSS Modules inline: duplica estilos y genera conflictos de especificidad

## Errores Comunes
- Olvidar `dark:` prefijo en clases que deben cambiar en modo oscuro
- No purgar clases generadas con concatenación de strings (usar `safelist`)
- Confundir `gap` con `space-x/y` (gap respeta grid/flex, space usa margin en children)
- Usar `pt` cuando se necesita `padding-top` con unidades relativas de Tailwind

## Checklist
- [ ] ¿Los colores y espaciados usan tokens del tema en lugar de arbitrary values?
- [ ] ¿`darkMode: 'class'` está configurado y se aplica correctamente?
- [ ] ¿Los breakpoints siguen Mobile-First (sm → lg → xl)?
- [ ] ¿Las clases dinámicas están incluidas en la purga?
- [ ] ¿No hay estilos CSS duplicados entre Tailwind y CSS Modules?

## Convenciones
- Orden: layout → positioning → sizing → spacing → typography → visual → interactivity
- Componentes: extraer a clases @apply solo si se repiten 3+ veces
- Responsive: siempre Mobile-First, usar `md:` y `lg:` para breakpoints ascendentes
- Custom tokens: definir en `tailwind.config.js` con `extend`, nunca sobrescribir el tema base

## Ejemplos
```html
<div class="flex flex-col gap-4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-shadow
            sm:flex-row sm:items-center lg:p-8 xl:max-w-4xl xl:mx-auto">
  <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 md:text-xl">
    Título responsive
  </h2>
  <p class="text-sm text-gray-600 dark:text-gray-400">
    Contenido con dark mode y espaciado consistente
  </p>
</div>
```

## Referencias Oficiales
- Utility-First: https://tailwindcss.com/docs/utility-first
- Responsive Design: https://tailwindcss.com/docs/responsive-design
- Dark Mode: https://tailwindcss.com/docs/dark-mode
- Configuration: https://tailwindcss.com/docs/configuration