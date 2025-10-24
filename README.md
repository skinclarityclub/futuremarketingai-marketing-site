# FutureMarketingAI - Interactive Demo Showcase

[![CI Pipeline](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml)
[![E2E Tests](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/e2e-tests.yml)
[![Test Coverage](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/test-coverage.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/test-coverage.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)
[![Production Ready](https://img.shields.io/badge/status-production%20ready-brightgreen.svg)](PRODUCTION-READINESS.md)
[![Quality Score](<https://img.shields.io/badge/quality-A%20(92%2F100)-brightgreen.svg>)](FINAL-QUALITY-AUDIT.md)

An interactive, high-end demo website showcasing FutureMarketingAI's complete Marketing Machine for enterprise clients.

**✅ Production Ready** | **🎯 Quality Score: A (92/100)** | **♿ WCAG 2.1 AA** | **🚀 Lighthouse 90+**

> 📚 **Quick Links:** [Production Guide](PRODUCTION-READINESS.md) | [Quality Audit](FINAL-QUALITY-AUDIT.md) | [E2E Tests](tests/e2e/README.md)

## 🚨 Architecture: Desktop-First

**THIS PROJECT IS DESKTOP-FIRST. MOBILE IS SUPPLEMENTAL.**

- **Primary**: Desktop experience (B2B professionals)
- **Supplemental**: Mobile variant for discovery/teaser
- **Critical**: Desktop components NEVER modified for mobile
- **Approach**: Separate mobile components + conditional rendering

📖 **Read First**: [MOBILE-ARCHITECTURE-PRINCIPLES.md](MOBILE-ARCHITECTURE-PRINCIPLES.md) and [START-HERE.md](START-HERE.md)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠 Tech Stack

- **Framework:** React 18.3+ with TypeScript
- **Build Tool:** Vite 6.0+
- **Styling:** Tailwind CSS 3.4+
- **Animations:** Framer Motion 11.0+
- **Routing:** React Router 6.22+
- **Deployment:** Vercel
- **CDN:** Cloudflare (for assets)

## 📁 Project Structure

```
futuremarketingai/
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles with Tailwind
├── public/              # Static assets
├── dist/                # Production build output
└── .taskmaster/         # Task Master AI project management
```

## 🎨 Custom Theme

The project uses a custom Tailwind theme with:

- **Dark Background:** #050814
- **Surface:** #0A0E27
- **Primary Accent:** #00D4FF (Cyan)
- **Secondary Accent:** #A855F7 (Purple)
- **Success:** #00FF88 (Green)
- **Typography:** Inter (sans), JetBrains Mono (mono)

## 📦 Available Scripts

| Script                  | Description                           |
| ----------------------- | ------------------------------------- |
| `npm run dev`           | Start development server on port 5173 |
| `npm run build`         | Build for production                  |
| `npm run preview`       | Preview production build locally      |
| `npm run lint`          | Run ESLint                            |
| `npm run lint:fix`      | Auto-fix ESLint errors                |
| `npm run format`        | Format code with Prettier             |
| `npm run format:check`  | Check code formatting                 |
| `npm run type-check`    | Run TypeScript type checking          |
| `npm test`              | Run tests in watch mode               |
| `npm run test:run`      | Run tests once                        |
| `npm run test:coverage` | Run tests with coverage report        |

## ✅ Code Quality & CI/CD

### Automated Checks

All pull requests must pass the following checks before merging:

- ✅ **Code Quality** - ESLint + Prettier
- ✅ **Type Safety** - TypeScript compilation
- ✅ **Tests** - 51 unit & integration tests
- ✅ **Build** - Production build verification
- ✅ **Security** - npm audit for vulnerabilities
- ✅ **Coverage** - Minimum 70% test coverage

### Running Checks Locally

```bash
# Run all pre-merge checks
npm run lint        # ESLint
npm run format:check # Prettier
npm run type-check  # TypeScript
npm test -- --run   # Tests
npm run build       # Build
```

### CI Pipeline

GitHub Actions automatically runs all checks on every push and pull request. See [`.github/workflows/ci.yml`](.github/workflows/ci.yml) for details.

**Branch Protection:** Merging is blocked if any CI check fails. See [docs/GITHUB-BRANCH-PROTECTION.md](docs/GITHUB-BRANCH-PROTECTION.md) for setup instructions.

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy to Vercel:**

```bash
npm install -g vercel
vercel login
vercel --prod
```

## 📋 Development Workflow

This project uses [Task Master AI](https://github.com/your-org/task-master-ai) for task management:

```bash
# View all tasks
task-master list

# Get next task to work on
task-master next

# View specific task
task-master show 2

# Update task status
task-master set-status --id=2 --status=done
```

## 🎯 Project Goals

- **Engagement:** >3 min average session duration
- **Interaction Rate:** >60% clicks on interactive elements
- **Conversion:** 15%+ books demo call
- **Visual Impact:** 9/10 "wow factor" in first 10 seconds

## 📄 License

Private - FutureMarketingAI Internal Use Only

## 🤝 Contributing

This is an internal project. Please follow the established Git workflow:

- Create feature branches from `develop`
- Use conventional commits
- Submit PRs for review before merging

See `.cursor/rules/git.mdc` for detailed Git workflow guidelines.
