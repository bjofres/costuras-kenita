# Playwright

## Objetivos
- Escribir tests end-to-end confiables usando web-first assertions y localizadores semánticos
- Dominar fixtures, page objects y codegen para escalar suites de prueba
- Integrar Playwright en CI con sharding, retries y parallel execution

## Best Practices
- Usar getByRole como localizador preferente, seguido de getByLabel, getByPlaceholder, getByText, y finalmente getByTestId
- Aplicar web-first assertions (toBeVisible, toHaveText, toHaveURL) en lugar de sleeps o waits manuales
- Modelar page objects para encapsular selectores e interacciones de cada página
- Ejecutar tests en paralelo por defecto y usar fullyParallel: true para velocidad máxima
- Utilizar trace viewer para diagnosticar fallos en CI con trace: 'on-first-retry'

## Anti-Patterns
- Localizadores frágiles con XPath o CSS complejos: rompen con cambios mínimos en UI
- Uso de page.waitForTimeout: introduce flakiness; reemplazar con web-first assertions
- Compartir estado entre tests con variables globales: cada test debe ser aislado

## Errores Comunes
- Olvidar await en assertions y acciones de Playwright
- No usar test.use({ storageState }) para mantener sesión entre tests
- Ignorar el auto-waiting de Playwright y añadir waits manuales innecesarios

## Checklist
- [ ] Usar localizadores getByRole/getByTestId en lugar de CSS/XPath
- [ ] Aplicar web-first assertions sin waits manuales
- [ ] Modelar page objects para páginas reutilizables
- [ ] Configurar trace: 'on-first-retry' para depuración en CI
- [ ] Ejecutar codegen para generar tests iniciales

## Convenciones
- Nombres de test en formato given-when-then (ej: "should show error when login fails")
- Archivos de spec agrupados por funcionalidad en e2e/
- Page objects en pages/ con sufijo .page.ts

## Ejemplos
```typescript
// Page object con localizadores semánticos
class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
  }

  async login(username: string) {
    await this.usernameInput.fill(username);
    await this.submitButton.click();
  }
}

// Test con web-first assertion
test('successful login redirects to dashboard', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('admin');
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByText('Welcome')).toBeVisible();
});
```

## Referencias Oficiales
- Playwright Docs: https://playwright.dev/docs/intro
- Best Practices: https://playwright.dev/docs/best-practices
- Trace Viewer: https://playwright.dev/docs/trace-viewer
