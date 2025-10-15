# 🚀 Task 1: Initialize Marketing Repository - Implementation Plan

**Status:** Ready to execute (waiting for Git config)  
**Date:** October 15, 2025  
**Complexity:** 3/10 (Low)  
**Subtasks:** 4

---

## 📋 **Overzicht**

We gaan een **nieuwe Next.js repository aanmaken** voor de marketing site. Dit wordt een **schone, aparte repo** voor:

- Landing page
- Demo hub (/demo)
- Pricing (/pricing)
- About (/about)
- Login (/login)

---

## ✅ **Subtasks Breakdown**

### **Subtask 1.1: Create Next.js project with TypeScript** ⭐

**Dependencies:** None  
**Status:** Pending

**Actions:**

```bash
# Navigate to Desktop (parent directory)
cd C:\Users\daley\Desktop

# Create new Next.js project
npx create-next-app@latest futuremarketingai-marketing \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack

# Enter the new project
cd futuremarketingai-marketing
```

**What this does:**

- ✅ Creates Next.js 14+ project with App Router
- ✅ TypeScript enabled by default
- ✅ Tailwind CSS for styling
- ✅ ESLint pre-configured
- ✅ Src directory structure
- ✅ Import aliases (@/...)

**Test:**

```bash
npm run dev
# Visit http://localhost:3000
```

---

### **Subtask 1.2: Configure ESLint and Prettier**

**Dependencies:** 1.1  
**Status:** Pending

**Actions:**

```bash
# Install Prettier and ESLint plugins
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier

# Create .prettierrc config
echo '{"semi": true, "singleQuote": true, "tabWidth": 2, "trailingComma": "es5"}' > .prettierrc

# Create .prettierignore
echo '.next
node_modules
dist
build
*.md' > .prettierignore

# Update .eslintrc.json (add prettier)
```

**ESLint Config (.eslintrc.json):**

```json
{
  "extends": ["next/core-web-vitals", "plugin:prettier/recommended"],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

**Add scripts to package.json:**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,css,md}\""
  }
}
```

**Test:**

```bash
npm run lint
npm run format
```

---

### **Subtask 1.3: Set up strict TypeScript mode**

**Dependencies:** 1.1  
**Status:** Pending

**Actions:**

Update `tsconfig.json` to enable strict mode:

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    },
    // Additional strict checks
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Test:**

```bash
# Type check the project
npx tsc --noEmit
```

---

### **Subtask 1.4: Initialize and push to GitHub**

**Dependencies:** 1.1, 1.2, 1.3 ✅  
**Status:** Pending

**Prerequisites:**

- ✅ Git configured (user.name and user.email)
- ✅ GitHub account access
- ✅ New repo created on GitHub

**Actions:**

```bash
# Initialize Git
git init

# Create .gitignore (should already exist from create-next-app)
# Verify it includes:
# - node_modules/
# - .next/
# - .env*.local
# - *.log

# Stage all files
git add -A

# Initial commit
git commit -m "feat: initialize Next.js marketing repository

- Next.js 14+ with App Router
- TypeScript with strict mode enabled
- ESLint + Prettier configured
- Tailwind CSS for styling
- Clean project structure ready for marketing site"

# Create GitHub repo (via GitHub website or CLI)
# Then link and push:
git remote add origin https://github.com/YOUR-USERNAME/futuremarketingai-marketing.git
git branch -M main
git push -u origin main
```

**Test:**

```bash
# Verify remote is set
git remote -v

# Check GitHub to see if files are there
```

---

## 🎯 **Success Criteria**

After completing all 4 subtasks:

✅ **New Next.js project created** at `C:\Users\daley\Desktop\futuremarketingai-marketing`  
✅ **TypeScript strict mode enabled** (no compilation errors)  
✅ **ESLint + Prettier working** (can run `npm run lint` and `npm run format`)  
✅ **Git initialized** and **pushed to GitHub**  
✅ **Project builds successfully** (`npm run build`)  
✅ **Dev server runs** (`npm run dev`)

---

## 📊 **Project Structure After Task 1**

```
futuremarketingai-marketing/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page (/)
│   │   └── globals.css         # Global styles
│   ├── components/             # Shared components (we'll add later)
│   └── lib/                    # Utilities (we'll add later)
├── public/
│   └── (static assets)
├── .eslintrc.json              # ESLint config
├── .prettierrc                 # Prettier config
├── .gitignore                  # Git ignore rules
├── tsconfig.json               # TypeScript config (strict mode)
├── next.config.js              # Next.js config
├── tailwind.config.ts          # Tailwind config
├── package.json                # Dependencies
└── README.md                   # Project docs
```

---

## ⚡ **Quick Start Commands (Once Git is configured)**

**Full automated sequence:**

```bash
# 1. Navigate to parent directory
cd C:\Users\daley\Desktop

# 2. Create Next.js project
npx create-next-app@latest futuremarketingai-marketing --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 3. Enter project
cd futuremarketingai-marketing

# 4. Install Prettier
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier

# 5. Test build
npm run build

# 6. Initialize Git (if not already done)
git init
git add -A
git commit -m "feat: initialize marketing repository"

# 7. Push to GitHub (create repo first on GitHub)
git remote add origin https://github.com/YOUR-USERNAME/futuremarketingai-marketing.git
git branch -M main
git push -u origin main
```

---

## 🔄 **Next Steps After Task 1**

Once Task 1 is complete, we move to:

**Task 2:** Commit Clean Demo Code to Marketing Repo

- Copy demo components from current repo
- Migrate to /app/demo routes
- Refactor for Next.js App Router

---

## ⏱️ **Estimated Time**

- Subtask 1.1: 5 minutes
- Subtask 1.2: 5 minutes
- Subtask 1.3: 3 minutes
- Subtask 1.4: 5 minutes
- **Total: ~20 minutes**

---

## 🚨 **CURRENT STATUS**

**⚠️ BLOCKED BY:** Git configuration

**Action Required:**

```bash
# YOU NEED TO RUN THESE FIRST:
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

**Once Git is configured, let me know and we'll execute all 4 subtasks together!** 🚀

---

## 📞 **Ready to Execute?**

**After Git config, tell me:**

- ✅ "Git is configured" → I'll start executing the commands
- ❓ "I have questions" → Ask away!
- 🔄 "Adjust the plan" → What needs changing?
