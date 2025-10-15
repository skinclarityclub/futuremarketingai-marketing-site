# Code Quality & Tooling Setup

Dit project gebruikt verschillende tools voor code quality, linting, en formatting.

## 🛠️ Tools

### ESLint

- **Configuratie**: `.eslintrc.cjs`
- **Commands**:
  - `npm run lint` - Check code voor linting errors
  - `npm run lint:fix` - Automatisch fixbare errors oplossen

### Prettier

- **Configuratie**: `.prettierrc`
- **Settings**:
  - No semicolons
  - Single quotes
  - 2 space indentation
  - 100 character line width
- **Commands**:
  - `npm run format` - Format alle bestanden
  - `npm run format:check` - Check formatting zonder changes

### Husky & Lint-Staged

- **Pre-commit Hook**: Automatisch linting en formatting voor staged files
- **Configuratie**: `.husky/pre-commit` en `lint-staged` in `package.json`
- Runt automatisch bij elke commit:
  - ESLint met auto-fix voor `.ts` en `.tsx` files
  - Prettier voor alle staged files

### TypeScript

- **Type Checking**: `npm run type-check`
- Strict mode enabled voor maximale type safety

### Bundle Analysis

- **Command**: `npm run build:analyze`
- Genereert een visualisatie van de bundle size in `dist/stats.html`
- Toont:
  - Gzip en Brotli compressed sizes
  - Code splitting per chunk
  - Dependency tree

## 📋 Workflow

1. **Tijdens development**:

   ```bash
   npm run dev
   ```

2. **Voor commit**:
   - Husky runt automatisch lint-staged
   - Of manueel: `npm run lint:fix && npm run format`

3. **Type checking**:

   ```bash
   npm run type-check
   ```

4. **Bundle analyse**:
   ```bash
   npm run build:analyze
   ```

## ⚠️ Known Lint Issues

Er zijn momenteel enkele TypeScript lint warnings die nog opgelost moeten worden:

- `@typescript-eslint/no-explicit-any`: 29 instances van `any` type
- `react-hooks/rules-of-hooks`: 2 conditional hook calls in `useAnalytics.ts`

Deze worden opgelost in een volgende iteratie.

## 🔧 Configuration Files

- `.eslintrc.cjs` - ESLint rules
- `.prettierrc` - Prettier formatting
- `.husky/pre-commit` - Pre-commit git hook
- `package.json` - lint-staged configuratie
- `.gitignore` - Git ignore patterns
