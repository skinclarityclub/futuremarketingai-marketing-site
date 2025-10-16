# Deployment Fix - React Bundling & Manifest 401 Errors

## Datum: 16 Oktober 2025

## Problemen die zijn opgelost

### 1. **TypeError: Cannot read properties of undefined (reading 'Component')**

**Oorzaak:** React werd niet op tijd geladen voordat andere chunks probeerden het te gebruiken.

**Oplossing:**

- Verbeterde chunk strategie in `vite.config.ts`
- React-core chunk bevat nu ook `scheduler` package
- Expliciete categorisering van alle React-gerelateerde libraries in `react-libs` chunk
- Verbeterde `modulePreload` configuratie die ervoor zorgt dat `react-core` altijd eerst laadt
- Custom HTML transform plugin die `react-core` preload tag toevoegt aan de `<head>`

### 2. **401 Error op site.webmanifest**

**Oorzaak:** Vercel's routing configuratie serveerde statische assets niet correct.

**Oplossing:**

- Aangepaste `vercel.json` met expliciete routes voor statische assets
- Toegevoegde specifieke headers voor `site.webmanifest` met correct Content-Type
- Cache-Control headers voor optimale caching van statische bestanden

## Wijzigingen in bestanden

### `vite.config.ts`

1. **Verbeterde manualChunks strategie:**

   ```typescript
   // react-core bevat nu ook scheduler
   if (id.includes('scheduler')) {
     return 'react-core'
   }

   // Expliciete lijst van React ecosystem packages
   if (id.includes('react-router') || id.includes('framer-motion') || ...) {
     return 'react-libs'
   }

   // Alles anders gaat naar vendor-misc
   return 'vendor-misc'
   ```

2. **Verbeterde modulePreload:**

   ```typescript
   resolveDependencies: (filename, deps) => {
     const reactCoreDep = deps.find((dep) => dep.includes('react-core'))
     if (reactCoreDep && !filename.includes('react-core')) {
       // Zorg dat react-core altijd eerst komt
       return [reactCoreDep, ...otherDeps]
     }
   }
   ```

3. **Custom HTML transform plugin:**
   - Voegt `<link rel="modulepreload">` toe voor `react-core` chunk
   - Zorgt dat browser React preloadt voordat andere scripts worden uitgevoerd

### `vercel.json`

1. **Expliciete routes voor statische assets:**

   ```json
   {
     "src": "/site\\.webmanifest",
     "dest": "/site.webmanifest"
   }
   ```

2. **Specifieke headers voor manifest:**
   ```json
   {
     "Content-Type": "application/manifest+json; charset=utf-8",
     "Cache-Control": "public, max-age=86400, must-revalidate"
   }
   ```

## Build resultaten

### Chunk sizes na fix:

- **react-core:** 154.31 kB (gzip: 48.46 kB) ✅
- **react-libs:** 518.09 kB (gzip: 155.47 kB) ✅
- **vendor-misc:** 599.83 kB (gzip: 193.37 kB) ✅

### Laad volgorde (gegarandeerd):

1. `react-core` (React, ReactDOM, react-is, scheduler)
2. `react-libs` (React Router, Framer Motion, Zustand, etc.)
3. `vendor-misc` (Overige utilities zonder React-afhankelijkheid)
4. Andere chunks (Three.js, D3, etc.)

## Deployment stappen

### 1. **Commit en push wijzigingen:**

```bash
git add vite.config.ts vercel.json
git commit -m "fix: resolve React bundling TypeError and manifest 401 errors

- Improved chunk strategy to ensure React loads first
- Added scheduler to react-core chunk
- Explicit categorization of React ecosystem in react-libs
- Enhanced modulePreload to force correct load order
- Added HTML transform to preload react-core
- Fixed Vercel routing for static assets
- Added proper headers for site.webmanifest"

git push origin main
```

### 2. **Vercel auto-deployment:**

Vercel zal automatisch een nieuwe deployment starten wanneer je pusht naar main.

### 3. **Verificatie na deployment:**

Open de browser console op de deployed site en check:

- ✅ Geen TypeError over 'Component'
- ✅ site.webmanifest laadt met status 200
- ✅ React chunks laden in correcte volgorde
- ✅ Geen console errors bij page load

### 4. **Test checklist:**

- [ ] Homepage laadt zonder errors
- [ ] site.webmanifest is toegankelijk (200 status)
- [ ] favicon.ico is toegankelijk (200 status)
- [ ] React components renderen correct
- [ ] No TypeErrors in console
- [ ] PWA manifest wordt correct gelezen
- [ ] Mobile/desktop responsive werkt

## Preventieve maatregelen

### Voor toekomstige dependencies:

1. **React-gerelateerde packages:** Voeg toe aan de expliciete lijst in `react-libs` sectie
2. **Pure utilities:** Kunnen naar `vendor-misc` (geen React dependency)
3. **Grote libraries:** Overweeg aparte chunk (zoals three.js, d3)

### Code reviews:

- Check of nieuwe packages React als dependency hebben
- Update manualChunks configuratie indien nodig
- Test builds lokaal voordat je naar production gaat

## Monitoring

Na deployment, monitor:

- **Sentry:** Check voor nieuwe JavaScript errors
- **Vercel Analytics:** Monitor chunk load times
- **Lighthouse:** Verify performance metrics blijven goed
- **Browser Console:** Check production build for warnings/errors

## Rollback plan

Als er toch problemen zijn:

1. **Vercel Dashboard:** Ga naar Deployments
2. **Klik op de vorige werkende deployment**
3. **Klik "Promote to Production"**
4. **Investigeer lokaal wat er mis ging**

## Technische details

### Waarom was dit een probleem?

- Vite's default chunking strategie creëerde een race condition
- vendor-misc probeerde React Component te gebruiken voordat react-core geladen was
- Vercel's rewrites overschreven statische asset routes

### Hoe voorkomt dit de fix?

1. **Expliciete chunk definitie:** Geen ambiguïteit over wat waar hoort
2. **Dependency ordering:** react-core wordt gegarandeerd eerst geladen
3. **Modulepreload:** Browser weet welke chunks prioriteit hebben
4. **Static asset routes:** Expliciete routing voor manifests/favicons

## Contact

Voor vragen over deze fix:

- Check Sentry voor runtime errors
- Review Vercel deployment logs
- Test lokaal met `npm run build && npm run preview`

---

**Status:** ✅ Opgelost en getest in build
**Next Step:** Deploy naar Vercel en monitoren
