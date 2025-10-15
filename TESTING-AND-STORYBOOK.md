# 🧪 Testing & Storybook Setup

Complete guide voor testing en component development met Vitest en Storybook.

---

## 📦 Geïnstalleerde Tools

### Testing Stack

- **Vitest** (v3.2.4) - Snelle unit test runner gebouwd voor Vite
- **@testing-library/react** - React component testing utilities
- **@testing-library/jest-dom** - Custom matchers voor DOM assertions
- **@testing-library/user-event** - User interaction simulation
- **jsdom** - DOM environment voor Node.js

### Storybook Stack

- **Storybook** (v9.1.10) - Component development environment
- **@storybook/react-vite** - Vite plugin voor React Storybook
- **@storybook/addon-a11y** - Accessibility testing
- **@storybook/addon-vitest** - Vitest integratie
- **@storybook/addon-docs** - Auto-generated documentation

---

## 🚀 Quick Start

### Running Tests

```bash
# Run tests in watch mode (development)
npm run test

# Run tests once (CI/CD)
npm run test:run

# Run tests with UI dashboard
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Running Storybook

```bash
# Start Storybook development server
npm run storybook

# Build static Storybook
npm run build-storybook
```

---

## 🧪 Writing Tests

### Test File Location

Plaats test files naast de component:

```
src/
  components/
    common/
      Button.tsx
      Button.test.tsx      ← Test file
      Button.stories.tsx   ← Storybook file
```

### Example Test

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('should handle click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Testing Best Practices

✅ **DO:**

- Test user behavior, not implementation
- Use `getByRole` queries (accessibility-first)
- Test accessibility features
- Mock external dependencies
- Use `userEvent` voor interacties (niet `fireEvent`)
- Keep tests simple and focused

❌ **DON'T:**

- Test implementation details
- Rely on class names or IDs
- Test third-party library behavior
- Create overly complex test setups

---

## 📚 Storybook Stories

### Example Story

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Common/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
    },
    onClick: { action: 'clicked' },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
}
```

### Story Organization

```
Components/
  Common/
    Button
    Card
    Modal
  Layer1-Hero/
    CoreSphere3D
    ParticleSystem
  Layer3-Dashboard/
    AdManager
    CampaignLauncher
```

---

## 🎯 Test Coverage

### Running Coverage

```bash
npm run test:coverage
```

### Coverage Report Locations

- **Terminal**: Summary in console
- **HTML**: `coverage/index.html` - Open in browser voor detailed view
- **JSON**: `coverage/coverage-final.json` - Voor CI/CD integratie

### Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

### Excluded from Coverage

- Node modules
- Test files
- Type definitions (`.d.ts`)
- Config files
- Mock data

---

## 🔧 Vitest Configuration

Configuratie in `vite.config.ts`:

```typescript
test: {
  globals: true,              // Geen imports nodig voor expect, describe, etc.
  environment: 'jsdom',       // DOM environment voor React testing
  setupFiles: './src/test/setup.ts',  // Setup file
  css: true,                  // Proces CSS imports
  coverage: {
    provider: 'v8',          // Native coverage
    reporter: ['text', 'json', 'html'],
    exclude: [
      'node_modules/',
      'src/test/',
      '**/*.d.ts',
      '**/*.config.*',
      '**/*.test.*',
    ],
  },
}
```

---

## 🛠️ Test Utilities

### Setup File (`src/test/setup.ts`)

Bevat global mocks en setup:

- **IntersectionObserver** mock
- **ResizeObserver** mock
- **matchMedia** mock
- Automatic cleanup na elke test

### Custom Render Functions

```typescript
// src/test/utils.tsx
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

export const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter })
}
```

Usage:

```typescript
import { renderWithRouter } from '@/test/utils'

it('should navigate on click', () => {
  renderWithRouter(<NavigationComponent />)
  // Test navigation...
})
```

---

## 🎨 Storybook Addons

### Accessibility Testing

Storybook heeft **a11y addon** voor automatic accessibility checks:

- Color contrast checks
- ARIA attributes validation
- Keyboard navigation testing
- Screen reader compatibility

### Vitest Integration

Run component tests direct in Storybook met **addon-vitest**.

### Documentation

Auto-generated docs via **addon-docs**:

- Component props table
- Live code examples
- Interactive controls

---

## 📊 CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Test & Coverage
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run build-storybook
```

---

## 🐛 Debugging Tests

### VS Code Debug Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Vitest Tests",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "test"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Browser DevTools

Use `screen.debug()` in tests:

```typescript
it('debugging test', () => {
  render(<MyComponent />)
  screen.debug() // Prints DOM to console
})
```

---

## 📖 Testing Patterns

### Testing Async Components

```typescript
it('should load data', async () => {
  render(<AsyncComponent />)

  // Wait voor element
  const heading = await screen.findByRole('heading')
  expect(heading).toBeInTheDocument()
})
```

### Testing Forms

```typescript
it('should submit form', async () => {
  const handleSubmit = vi.fn()
  const user = userEvent.setup()

  render(<LoginForm onSubmit={handleSubmit} />)

  await user.type(screen.getByLabelText(/email/i), 'test@example.com')
  await user.type(screen.getByLabelText(/password/i), 'password123')
  await user.click(screen.getByRole('button', { name: /login/i }))

  expect(handleSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123',
  })
})
```

### Testing Errors

```typescript
it('should show error message', async () => {
  render(<Component />)

  // Trigger error
  await userEvent.click(screen.getByRole('button'))

  // Check error appears
  expect(await screen.findByText(/error/i)).toBeInTheDocument()
})
```

---

## 🎯 Next Steps

1. **Write more tests** voor bestaande components
2. **Create Storybook stories** voor alle UI components
3. **Setup coverage thresholds** in CI/CD
4. **Add visual regression testing** (Chromatic)
5. **Document component API's** in Storybook

---

## 📚 Resources

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Storybook Docs](https://storybook.js.org/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Happy Testing! 🎉**
