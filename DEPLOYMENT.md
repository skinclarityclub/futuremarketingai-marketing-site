# Deployment Guide - FutureMarketingAI Demo

## 🚀 Quick Start - Vercel Deployment

### Step 1: Initialize Git Repository (if not done)

Open Git Bash of een terminal met Git en voer uit:

```bash
git init
git add .
git commit -m "Initial commit: FutureMarketingAI demo project"
```

### Step 2: Create GitHub Repository

1. Ga naar [GitHub](https://github.com/new)
2. Maak een nieuwe repository aan (bijv. `futuremarketingai-demo`)
3. **Kies PRIVATE** als je de code niet publiek wilt
4. Voeg GEEN README, .gitignore of license toe (we hebben die al)

### Step 3: Push naar GitHub

```bash
git remote add origin https://github.com/YOUR-USERNAME/futuremarketingai-demo.git
git branch -M main
git push -u origin main
```

### Step 4: Deploy naar Vercel

#### Optie A: Via Vercel Dashboard (Aanbevolen voor eerste keer)

1. Ga naar [vercel.com](https://vercel.com) en login
2. Click "Add New Project"
3. Import je GitHub repository
4. Vercel detecteert automatisch Vite configuratie
5. Click "Deploy"

#### Optie B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Step 5: Configure Environments

#### Staging Environment

1. In Vercel Dashboard → Your Project → Settings → General
2. Voeg een nieuwe environment toe: `staging`
3. Environment Variables (indien nodig):
   - `VITE_API_URL`: staging API endpoint
   - Andere environment-specifieke variabelen

#### Production Environment

1. Configureer production environment variables
2. Enable "Production Branch" voor `main`

### Step 6: Automatic Deployments

Vercel configureert automatisch deployments:

- **Push naar `main`** → Production deployment
- **Push naar andere branches** → Preview deployment
- **Pull Requests** → Preview deployment met unieke URL

## 🌐 Cloudflare CDN Setup (Subtask 2.3)

### Prerequisites

- Eigen domein (bijv. `futuremarketingai.com`)
- Cloudflare account

### Setup Steps

1. **Add Domain to Cloudflare**
   - Login bij Cloudflare
   - Add site → Enter je domein
   - Update nameservers bij je domain registrar

2. **Configure DNS**

   ```
   Type: CNAME
   Name: @ (of subdomain zoals 'demo')
   Target: cname.vercel-dns.com
   Proxy: Enabled (orange cloud)
   ```

3. **SSL/TLS Settings**
   - SSL/TLS → Overview → Full (strict)
   - Edge Certificates → Always Use HTTPS: ON

4. **Cache Rules**
   - Rules → Page Rules → Create:
     - URL: `yourdomain.com/assets/*`
     - Cache Level: Cache Everything
     - Edge Cache TTL: 1 month

5. **Vercel Domain Settings**
   - In Vercel: Settings → Domains
   - Add je custom domain
   - Vercel genereert verificatie record
   - Voeg deze toe in Cloudflare DNS

## 📋 Environment Variables

Create `.env.local` for local development:

```env
# API Configuration
VITE_API_URL=http://localhost:3000

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEMO_MODE=true
```

**In Vercel Dashboard:**

- Set environment-specific variables
- Use different values for Production vs Preview

## ✅ Verification Checklist

- [ ] Git repository initialized and pushed to GitHub
- [ ] Vercel project created and deployed
- [ ] Production deployment successful
- [ ] Preview deployments work on new branches
- [ ] Environment variables configured
- [ ] Custom domain connected (optional)
- [ ] Cloudflare CDN configured (optional)
- [ ] HTTPS enabled and working
- [ ] Assets cached properly

## 🔧 Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Verify all dependencies in `package.json`
- Ensure Node.js version compatibility (20+)

### Environment Variables Not Working

- Prefix all Vite env vars with `VITE_`
- Redeploy after adding/changing env vars
- Check environment-specific settings

### Domain Not Resolving

- Verify DNS propagation (can take up to 48h)
- Check CNAME record in Cloudflare
- Verify domain is added in Vercel

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Cloudflare DNS Setup](https://developers.cloudflare.com/dns/)
