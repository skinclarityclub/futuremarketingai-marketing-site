# 🚀 Complete Cursor IDE Development Setup voor Windows

Deze gids bevat alles wat je nodig hebt voor een professionele development setup met Cursor IDE.

## ✅ Al Geïnstalleerd

- ✅ **Git** (v2.51.0) - Version control
- ✅ **Node.js** - JavaScript runtime (check versie met `node -v`)
- ✅ **npm** - Package manager
- ✅ **ESLint & Prettier** - Code quality tools
- ✅ **Husky** - Git hooks

---

## 📦 Essentiële Tools om te Installeren

### 1. **Windows Terminal** (Hoogste prioriteit)

Modern terminal met tabs, themes, en meerdere shells.

```powershell
winget install --id Microsoft.WindowsTerminal --source winget
```

### 2. **PowerShell 7** (Aangeraden)

Modernere versie dan de standaard PowerShell 5.

```powershell
winget install --id Microsoft.Powershell --source winget
```

### 3. **WSL2 (Windows Subsystem for Linux)** (Zeer aangeraden)

Native Linux omgeving voor betere ontwikkeltool compatibiliteit.

```powershell
wsl --install
```

Na installatie herstart je computer. Kies Ubuntu als distributie.

### 4. **Package Managers**

#### pnpm (Sneller dan npm, minder disk space)

```bash
npm install -g pnpm
```

#### Yarn (Alternatief)

```bash
npm install -g yarn
```

### 5. **Docker Desktop** (Voor databases & containers)

```powershell
winget install --id Docker.DockerDesktop --source winget
```

### 6. **VS Code Extensions voor Cursor**

Cursor is gebaseerd op VS Code, dus deze extensions werken:

- **ESLint** - Linting (al geconfigureerd)
- **Prettier** - Formatting (al geconfigureerd)
- **Error Lens** - Inline error display
- **GitLens** - Advanced Git features
- **Thunder Client** - API testing (alternatief voor Postman)
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **Auto Rename Tag** - HTML/JSX tag sync
- **Import Cost** - Package size weergave
- **Better Comments** - Highlighted comments

---

## 🤖 MCP (Model Context Protocol) Setup

MCP is een protocol waarmee Cursor's AI toegang krijgt tot externe tools en data.

### Wat is MCP?

- **Open protocol** van Anthropic
- Verbindt AI met externe data sources
- Breidt Cursor's mogelijkheden uit
- "USB voor AI" - plug-and-play tools

### MCP Server Setup

1. **Cursor Settings openen:**
   - `File > Preferences > Cursor Settings`
   - Zoek naar "MCP"

2. **Voorbeeld: Weather MCP Server**

```bash
# Download example server
curl -L https://cursorideguide.com/examples/cursor-weather-mcp-server.zip -o weather-mcp.zip

# Of maak eigen MCP server:
mkdir my-mcp-server
cd my-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk
```

3. **Configureer in Cursor:**

```json
{
  "mcpServers": {
    "my-tool": {
      "command": "node",
      "args": ["C:/path/to/your/mcp-server/dist/index.js"]
    }
  }
}
```

### Beschikbare MCP Servers

- **Web Search MCP** - Live web search
- **Brave Search MCP** - Privacy-focused search
- **Sequential Thinking MCP** - Stepwise planning
- **Custom Project Tools** - Maak je eigen!

---

## 🛠️ Development Tools

### API Testing

```powershell
# Postman (populairste)
winget install --id Postman.Postman --source winget

# Of Insomnia (alternatief)
winget install --id Insomnia.Insomnia --source winget
```

### Database Management

#### Docker-based (Aangeraden)

```bash
# PostgreSQL
docker run --name pg-dev -e POSTGRES_PASSWORD=devpass -p 5432:5432 -d postgres:16

# MongoDB
docker run --name mongo-dev -p 27017:27017 -d mongo:7

# Redis
docker run --name redis-dev -p 6379:6379 -d redis:7
```

#### Database GUIs

```powershell
# TablePlus (Multi-database GUI)
winget install --id TablePlus.TablePlus --source winget

# MongoDB Compass
winget install --id MongoDB.Compass --source winget

# pgAdmin (PostgreSQL)
winget install --id PostgreSQL.pgAdmin --source winget
```

### ngrok (Voor webhooks & localhost sharing)

```bash
npm install -g ngrok
```

---

## 🎨 Shopify Development Setup

### Shopify CLI

```bash
npm install -g @shopify/cli @shopify/theme
```

### Shopify Development Workflow

1. **Shopify Partner Account** - Maak gratis op partners.shopify.com
2. **Development Store** - Maak test store aan
3. **Theme Development:**

```bash
shopify theme dev --store=your-store.myshopify.com
```

### Shopify Tools

- **Shopify CLI** - Theme & app development
- **Liquid syntax highlighting** - Extension voor .liquid files
- **Shopify Theme Inspector** - Chrome extension

---

## 🌐 Browser Extensions

### Chrome/Edge Extensions

- **React Developer Tools** - Component inspection
- **Redux DevTools** - State debugging
- **Wappalyzer** - Tech stack detection
- **ColorZilla** - Color picker
- **Lighthouse** - Performance audits
- **JSON Viewer** - Pretty JSON
- **Web Developer Toolbar** - Web development tools

---

## 📝 Recommended Cursor Settings

### AI Model Setup

1. Open Cursor Settings
2. Go to "Features > AI"
3. Configureer je preferred model (Claude, GPT-4, etc.)
4. Voeg API keys toe indien nodig

### Cursor Composer (Multi-file editing)

- Enable "Composer" in settings
- Gebruik `Cmd/Ctrl + I` voor inline suggestions
- Gebruik `Cmd/Ctrl + K` voor chat

### Privacy Settings

- Review "Privacy" tab in settings
- Overweeg om sensitive files uit te sluiten via `.cursorignore`

---

## 🔧 Project-Specific Setup

### Voor jouw huidige project:

```bash
# Check Node version
node -v  # Zorg voor v18 of hoger

# Install dependencies (als nog niet gedaan)
npm install

# Development
npm run dev

# Linting & formatting
npm run lint
npm run format

# Type checking
npm run type-check

# Bundle analysis
npm run build:analyze
```

### .cursorignore (Privacy)

Maak dit bestand aan in je project root:

```
node_modules/
.env
.env.local
dist/
build/
*.log
.git/
```

---

## 🎯 Quick Install Script (Alles in één keer)

```powershell
# Core tools
winget install --id Microsoft.WindowsTerminal --source winget
winget install --id Microsoft.Powershell --source winget
winget install --id Docker.DockerDesktop --source winget

# Development tools
winget install --id Postman.Postman --source winget
winget install --id TablePlus.TablePlus --source winget

# Package managers
npm install -g pnpm yarn

# Utilities
npm install -g @shopify/cli @shopify/theme ngrok

# WSL2 (requires restart)
wsl --install
```

---

## 📚 Aanbevolen Leerpaden

### Cursor AI Mastery

1. Gebruik `Cmd/Ctrl + K` voor chat
2. Gebruik `Cmd/Ctrl + L` voor codebase-wide chat
3. Gebruik `@filename` om specifieke files te taggen
4. Gebruik `@web` voor web search (via MCP)

### Best Practices

- ✅ Commit regelmatig met duidelijke messages
- ✅ Gebruik feature branches
- ✅ Laat pre-commit hooks runnen
- ✅ Review AI suggestions voordat je accepteert
- ✅ Test je code na AI-generated changes
- ✅ Gebruik `.cursorignore` voor sensitive files

---

## 🚦 Prioriteit Volgorde

1. **Moet hebben (nu):**
   - ✅ Git (done)
   - Windows Terminal
   - PowerShell 7
   - Docker Desktop

2. **Zeer nuttig (deze week):**
   - WSL2
   - pnpm/yarn
   - Postman
   - Database GUI (TablePlus of MongoDB Compass)

3. **Goed om te hebben (later):**
   - MCP servers setup
   - Shopify CLI (als je Shopify development start)
   - ngrok
   - Extra browser extensions

---

## 🆘 Troubleshooting

### Git issues

```powershell
# Refresh PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

### Docker niet start

- Zorg dat virtualisatie enabled is in BIOS
- Herstart na installatie
- Check Windows Features: Hyper-V en Containers

### WSL2 issues

```powershell
# Update WSL
wsl --update

# Set default version
wsl --set-default-version 2
```

---

## 📖 Nuttige Resources

- [Cursor IDE Docs](https://cursor.sh/docs)
- [MCP Protocol Docs](https://modelcontextprotocol.io)
- [Shopify CLI Docs](https://shopify.dev/docs/themes/tools/cli)
- [Docker Desktop Docs](https://docs.docker.com/desktop/windows/)
- [WSL2 Docs](https://learn.microsoft.com/en-us/windows/wsl/)

---

**Pro Tip:** Start met de "Moet hebben" tools, en voeg de rest toe naarmate je ze nodig hebt. Don't overwhelm yourself! 🚀
