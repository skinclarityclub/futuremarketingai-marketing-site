# Domein Koppelen aan Vercel (GoDaddy)

## 🌐 Jouw GoDaddy Domein Koppelen

### Stap 1: Domein Toevoegen in Vercel

1. Ga naar **Vercel Dashboard**: https://vercel.com
2. Selecteer je project: **futuremarketingai-demo**
3. Ga naar **Settings** → **Domains**
4. Klik op **"Add"** of **"Add Domain"**
5. Voer je domein in, bijvoorbeeld:
   - `futuremarketingai.com` (root domain)
   - `www.futuremarketingai.com` (subdomain)
   - `demo.futuremarketingai.com` (custom subdomain)

### Stap 2: DNS Configuratie bij GoDaddy

Vercel geeft je nu DNS instructies. Je hebt **2 opties**:

#### Optie A: A Record (Root Domain) ⭐ Aanbevolen

Voor `futuremarketingai.com`:

1. Login bij **GoDaddy** → **My Products** → **DNS**
2. Voeg toe of bewerk de volgende records:

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 600 seconds (of default)
```

Voor www subdomain:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 600 seconds
```

#### Optie B: CNAME Record (Subdomain)

Voor `demo.futuremarketingai.com`:

```
Type: CNAME
Name: demo
Value: cname.vercel-dns.com
TTL: 600 seconds
```

### Stap 3: Vercel Verificatie

1. Vercel controleert automatisch de DNS records
2. Dit kan **5 minuten tot 48 uur** duren (DNS propagation)
3. Je ziet een ✅ als het domein verified is

### Stap 4: SSL Certificaat (Automatisch)

- Vercel configureert **automatisch** een gratis SSL certificaat
- Van Let's Encrypt
- HTTPS wordt automatisch geforceerd
- Certificaat wordt automatisch vernieuwd

---

## ⚡ Quick Check

**Test of DNS werkt:**

```bash
# Windows
nslookup futuremarketingai.com

# Mac/Linux
dig futuremarketingai.com
```

**Verwachte output:**

- A record: `76.76.21.21`
- CNAME: `cname.vercel-dns.com`

---

## 🔧 Troubleshooting

### "Domain not found"

- Wacht 10-30 minuten voor DNS propagation
- Check of records correct zijn ingevuld bij GoDaddy
- Probeer incognito browser

### "SSL Certificate Pending"

- Kan tot 24 uur duren voor eerste keer
- Vercel regelt dit automatisch
- Geen actie nodig

### "Invalid Configuration"

- Verwijder eventuele oude A/CNAME records voor hetzelfde domein
- Zorg dat er geen conflicterende records zijn

---

## 📋 Checklist

- [ ] Domein toegevoegd in Vercel Dashboard
- [ ] DNS records toegevoegd bij GoDaddy
- [ ] Vercel domein verificatie ✅
- [ ] SSL certificaat actief (HTTPS)
- [ ] Domein werkt in browser
- [ ] www redirect werkt (optioneel)

---

## 🎯 Na Configuratie

Je site is nu bereikbaar via:

- ✅ `https://futuremarketingai.com`
- ✅ `https://www.futuremarketingai.com` (als geconfigureerd)
- ✅ `https://futuremarketingai-demo.vercel.app` (blijft werken)

**Automatische updates:**

- Elke push naar `main` branch → automatische deployment op je domein
- SSL auto-renewal elk kwartaal
- Global CDN via Vercel Edge Network

---

## 💡 Pro Tips

1. **Redirect www → root:**
   - Voeg beide domeinen toe in Vercel
   - Vercel redirected automatisch naar je primary domain

2. **Subdomain voor staging:**
   - Maak `staging.futuremarketingai.com`
   - Koppel aan een andere branch (bijv. `develop`)

3. **Email setup:**
   - Vercel doet **alleen** hosting, geen email
   - Gebruik GoDaddy Email of Google Workspace voor `@futuremarketingai.com` emails

---

**Need help?** Check Vercel Docs: https://vercel.com/docs/custom-domains
