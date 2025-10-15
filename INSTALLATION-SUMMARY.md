# 🎉 Development Setup Installatie Samenvatting

**Datum:** 1 oktober 2025  
**Duur:** ~20 minuten

---

## ✅ Succesvol Geïnstalleerd

### Core Development Tools

1. **Git** - v2.51.0.windows.1 ✅
   - Version control
   - Repository geïnitialiseerd
   - Husky pre-commit hooks geconfigureerd

2. **Node.js** - v22.19.0 ✅
   - JavaScript runtime
   - Nieuwste LTS versie

3. **npm** - v10.9.3 ✅
   - Standaard package manager

### Package Managers

4. **pnpm** - v10.17.1 ✅
   - Snellere & efficiëntere package manager
   - Gebruikt hard links voor disk space besparing
   - Command: `pnpm install`

5. **Yarn** - v1.22.22 ✅
   - Alternatieve package manager
   - Command: `yarn install`

### Desktop Applications

6. **Windows Terminal** ✅
   - Moderne terminal met tabs
   - Ondersteunt PowerShell, CMD, en WSL
   - Start menu: "Windows Terminal"

7. **PowerShell 7** - v7.5.3 ✅
   - Modernste PowerShell versie
   - Betere scripting capabilities
   - Command: `pwsh`

8. **Docker Desktop** - v4.47.0 ✅
   - Container platform
   - Voor databases en development services
   - Start menu: "Docker Desktop"
   - **Belangrijk:** Herstart vereist om te gebruiken!

9. **Postman** - v11.64.7 ✅
   - API testing en development
   - Start menu: "Postman"

10. **TablePlus** - v6.7.0 ✅
    - Multi-database GUI
    - Werkt met PostgreSQL, MySQL, MongoDB, Redis, etc.
    - Start menu: "TablePlus"

11. **MongoDB Compass** - v1.46.11 ✅
    - MongoDB database GUI
    - Start menu: "MongoDB Compass"

### CLI Development Tools

12. **Shopify CLI** - v3.85.4 ✅
    - Voor Shopify theme & app development
    - Commands:
      - `shopify theme dev`
      - `shopify app dev`

13. **ngrok** ⚠️ (Geblokkeerd door Windows Defender)
    - Localhost tunneling tool
    - Tijdelijk geblokkeerd als PUA (Potentially Unwanted Application)
    - **Fix:** Voeg exception toe in Windows Defender

### Code Quality Tools (Al geconfigureerd)

- **ESLint** - Code linting ✅
- **Prettier** - Code formatting ✅
- **Husky** - Git hooks ✅
- **lint-staged** - Pre-commit linting ✅

---

## ⚠️ Vereist Actie

### 1. Docker Desktop - Herstart Computer

Docker Desktop vereist een herstart om volledig te werken:

```
Herstart je computer nu of later vandaag
```

### 2. WSL2 - Manuele Installatie Vereist

WSL2 kon niet automatisch worden geïnstalleerd. Volg deze stappen:

**Optie A: Via Windows Features (GUI)**

1. Zoek "Windows Functies in- of uitschakelen"
2. Vink aan:
   - ☑️ Windows Subsystem for Linux
   - ☑️ Virtual Machine Platform
3. Klik OK en herstart
4. Na herstart: `wsl --install -d Ubuntu`

**Optie B: Via PowerShell (als Admin)**

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

Dan herstarten en `wsl --install -d Ubuntu` uitvoeren.

### 3. ngrok - Windows Defender Exception

Om ngrok te gebruiken:

1. Open "Windows Beveiliging"
2. Ga naar "Virus- en bedreigingsbeveiliging"
3. Klik "Beveiligingsinstellingen beheren"
4. Scroll naar "Uitsluitingen"
5. Voeg toe: `C:\Users\daley\AppData\Roaming\npm\node_modules\ngrok\bin\ngrok.exe`

---

## 🚀 Volgende Stappen

### Onmiddellijk Beschikbaar

Je kunt nu meteen aan de slag met:

- ✅ Git version control
- ✅ Node.js development (npm, pnpm, yarn)
- ✅ API testing met Postman
- ✅ Database management met TablePlus & MongoDB Compass
- ✅ Shopify development met Shopify CLI

### Na Herstart

Na computer herstart werkt:

- 🔄 Docker Desktop (containers voor databases)
- 🔄 WSL2 (indien manueel geïnstalleerd)

### Testen van je Setup

```bash
# Verifieer installaties
git --version           # Should show v2.51.0
node --version          # Should show v22.19.0
pnpm --version          # Should show v10.17.1
yarn --version          # Should show v1.22.22
shopify version         # Should show v3.85.4

# Test Docker (na herstart)
docker --version
docker run hello-world

# Test je project
cd C:\Users\daley\Desktop\Futuremarketingai
npm run dev             # Start development server
npm run lint            # Check code quality
npm run format          # Format code
```

---

## 📚 Nuttige Commands

### Package Management

```bash
# npm (standaard)
npm install
npm run dev

# pnpm (sneller, minder disk space)
pnpm install
pnpm run dev

# yarn (alternatief)
yarn install
yarn dev
```

### Git Workflow

```bash
git status              # Check changes
git add .               # Stage changes
git commit -m "message" # Commit (pre-commit hook runs!)
git log                 # View history
```

### Docker (na herstart)

```bash
# Start PostgreSQL
docker run --name pg-dev -e POSTGRES_PASSWORD=devpass -p 5432:5432 -d postgres:16

# Start MongoDB
docker run --name mongo-dev -p 27017:27017 -d mongo:7

# Start Redis
docker run --name redis-dev -p 6379:6379 -d redis:7

# View running containers
docker ps
```

### Shopify Development

```bash
# Login to Shopify
shopify login

# Start theme development
shopify theme dev --store=your-store.myshopify.com

# Push theme to Shopify
shopify theme push
```

---

## 🎯 Prioriteit Acties

**Prioriteit 1 (NU):**

1. ✅ Alles is geïnstalleerd
2. ✅ Tools zijn klaar voor gebruik
3. 🔄 **Herstart computer voor Docker**

**Prioriteit 2 (Vandaag/Deze Week):**

1. WSL2 manueel installeren (optioneel maar aangeraden)
2. ngrok Windows Defender exception toevoegen (als je het nodig hebt)
3. Docker Desktop configureren na herstart

**Prioriteit 3 (Later):**

1. MCP servers setup in Cursor
2. Browser extensions installeren
3. Cursor AI features exploreren

---

## 💡 Tips & Tricks

### Windows Terminal

- **Ctrl + Shift + T**: Nieuwe tab
- **Ctrl + Shift + P**: Command palette
- **Alt + Shift + D**: Duplicate pane

### Cursor IDE

- **Ctrl + K**: AI chat inline
- **Ctrl + L**: Codebase-wide chat
- **@filename**: Tag specifieke files in chat
- **Ctrl + I**: Composer mode (multi-file editing)

### Git met Husky

Pre-commit hook runt automatisch:

- ESLint auto-fix op staged TypeScript files
- Prettier formatting op alle staged files

---

## 🆘 Troubleshooting

### "Command not found" errors

Refresh PATH variabele:

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

### Docker niet start na herstart

- Check virtualisatie in BIOS is enabled
- Zorg dat Hyper-V enabled is in Windows Features

### pnpm/yarn werkt niet

Herstart terminal na installatie of refresh PATH.

---

## 📊 Installatie Statistiek

- **Totaal geïnstalleerd:** 13 tools
- **Totale download size:** ~1.3 GB
- **Installatie tijd:** ~20 minuten
- **Tools klaar voor gebruik:** 11/13
- **Vereist herstart:** 2 (Docker, WSL2)

---

**🎉 Je bent nu klaar voor professionele web development met Cursor IDE!**

Voor vragen of problemen, check `CURSOR-SETUP-GUIDE.md` voor gedetailleerde info.
