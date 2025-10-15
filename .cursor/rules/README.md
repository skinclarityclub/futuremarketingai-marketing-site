# Cursor Rules voor Futuremarketingai

Deze directory bevat best practice rules voor gestructureerde ontwikkeling van web/platform projecten met Cursor AI en Task Master.

## 📋 Overzicht Rules

### Core Rules (Task Master)

- **`cursor_rules.mdc`** - Richtlijnen voor het maken en onderhouden van Cursor rules
- **`self_improve.mdc`** - Automatische verbetering van rules op basis van emerging patterns

### Development Workflow

- **`taskmaster/dev_workflow.mdc`** - Task Master workflow en best practices
- **`taskmaster/taskmaster.mdc`** - Task Master command reference en documentatie

### Code Quality & Architecture

- **`web_development.mdc`** - Moderne web development best practices
  - Modulaire architectuur
  - Responsive design & UX
  - State management
  - Error handling
  - Performance optimization
- **`typescript.mdc`** - TypeScript best practices
  - Type safety fundamentals
  - Advanced types & generics
  - React + TypeScript
  - Runtime validation met Zod
  - Type guards en narrowing

### Security

- **`security.mdc`** - Beveiligingsrichtlijnen
  - Input validation & sanitization
  - XSS & SQL injection preventie
  - Authenticatie & autorisatie
  - Secure communication (HTTPS, CORS)
  - Dependency security
  - OWASP Top 10 compliance

### Testing

- **`testing.mdc`** - Testing strategie & best practices
  - Unit, Integration & E2E tests
  - React Testing Library
  - Mocking & stubbing
  - Test coverage goals
  - CI/CD integration

### Performance

- **`performance.mdc`** - Performance optimization
  - Core Web Vitals
  - React optimization (memo, lazy loading)
  - Bundle optimization
  - Image optimization
  - Network & caching strategies
  - Database query optimization

### Version Control

- **`git_workflow.mdc`** - Git workflow & best practices
  - Branch strategy
  - Commit conventions (Conventional Commits)
  - Pull request guidelines
  - Code review process
  - Task Master + Git integration

## 🚀 Hoe Werken Deze Rules?

Cursor AI leest deze `.mdc` (Markdown Context) bestanden automatisch en gebruikt ze als context bij het helpen met development. De rules zijn:

1. **Always Applied** - Actief voor alle relevante bestanden (zie `globs` in elke rule)
2. **Context-Aware** - Specifieke rules worden toegepast op basis van bestandstype
3. **Self-Improving** - Rules evolueren met je codebase (zie `self_improve.mdc`)

## 📖 Best Practices voor Rule Gebruik

### Voor Ontwikkelaars:

- Lees de relevante rules voordat je aan een nieuwe feature begint
- Gebruik rules als checklist tijdens development
- Suggereer updates als je nieuwe patterns ontdekt

### Voor AI Assistenten:

- Verwijs naar specifieke rules bij code reviews
- Gebruik rule examples in suggesties
- Update rules wanneer nieuwe patterns 3+ keer voorkomen

## 🔄 Rule Maintenance

Rules worden automatisch up-to-date gehouden door:

1. **Self-improvement triggers** - Detectie van nieuwe patterns
2. **Code review feedback** - Recurring comments worden rules
3. **Technology updates** - Nieuwe best practices uit de community
4. **Project evolution** - Rules groeien mee met codebase

## 📚 Referenties

Alle rules zijn gebaseerd op industry best practices van:

- [Web.dev](https://web.dev/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [OWASP](https://owasp.org/)
- [Testing Library](https://testing-library.com/)

## ✨ Volgende Stappen

Nu je rules zijn ingesteld:

1. **Initialiseer Task Master** - Maak een PRD en genereer taken
2. **Start Development** - Volg de `dev_workflow.mdc` guide
3. **Gebruik Rules** - AI assistenten gebruiken deze automatisch
4. **Itereer** - Rules verbeteren naarmate project groeit

---

💡 **Tip**: Vraag je AI assistent om "Show me the relevant rules for [topic]" voor quick reference!
