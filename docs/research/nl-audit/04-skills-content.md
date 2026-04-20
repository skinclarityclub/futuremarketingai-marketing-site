# NL Audit — Skills: Social Media / Ad Creator / Reel Builder / Blog Factory

## Summary
- Total keys reviewed: 4 namespaces, ~136 strings
- Issues found: 43 (23 Dunglish/anglicisme, 7 glossary-inconsistenties, 6 grammatica/woordvolgorde, 4 marketing-cliche/onnatuurlijk, 3 meta-typefouten)

Hoofdpatroon: veel Engelstalige vaktermen blijven staan waar een natuurlijk NL-alternatief voor de hand ligt ("Approve + publish", "Publish naar Meta", "Ads generen", "Review + customize", "Export + publiceren"). Daarnaast incorrect gebruik van "brand voice", "brand styling" en "brand guidelines" waar "merkstem", "huisstijl" en "merkrichtlijnen" beter zouden aansluiten bij de rest van de site (memory-namespace gebruikt al "merkstem"). Meerdere glossary-overtredingen rond "klant/klanten" als eindklant (moet "merken" of "klantportfolio" zijn). In `skills-ad-creator` één grammaticafout ("Ideal voor"), één typo ("generen" i.p.v. "genereren"). Geen em-dashes gevonden; wel inconsistente interpunctie (komma-voor-zin i.p.v. punt).

## Issues

### skills-social-media.hero.subtitle
**Issue type**: Anglicisme + glossary
**Current**: "Captions in brand voice, scheduling op optimale tijden, carrousel builder, hashtag research, engagement tracking. Per klant, per merk. Eén AI-medewerker voor je hele klantportfolio."
**Problem**: "brand voice", "scheduling", "carrousel builder", "hashtag research", "engagement tracking" zijn Engels. "Per klant" is in bureau-context dubbelzinnig (verwijst naar eindklant).
**Proposed**: "Captions in jouw merkstem, inplannen op piektijden, carrousel-bouwer, hashtag-onderzoek, engagement-tracking. Per merk, per account. Eén AI-medewerker voor je hele klantportfolio."

### skills-social-media.features.subtitle
**Issue type**: Dunglish
**Current**: "Vier kernfuncties, naadloos geïntegreerd. Elke output past in de brand voice per klant."
**Problem**: "output" + "brand voice" in dezelfde zin voelt technisch-Engels.
**Proposed**: "Vier kernfuncties, naadloos geïntegreerd. Alles wat eruit komt past bij de merkstem per klant."

### skills-social-media.features.feature1.title
**Issue type**: Anglicisme
**Current**: "AI-captions in brand voice"
**Problem**: "brand voice" is Engels; `memory` namespace gebruikt al "merkstem".
**Proposed**: "AI-captions in jouw merkstem"

### skills-social-media.features.feature1.body
**Issue type**: Anglicisme
**Current**: "Clyde genereert posts en captions die klinken als de klant. Geleerd uit eerdere goedgekeurde content en brand guidelines. Elke week scherper."
**Problem**: "brand guidelines" is Engels; "die klinken als de klant" is letterlijk vertaald ("sounds like the client") en onnatuurlijk in NL.
**Proposed**: "Clyde schrijft posts en captions die aanvoelen alsof het merk ze zelf heeft geschreven. Op basis van eerder goedgekeurde content en jouw merkrichtlijnen. Elke week scherper."

### skills-social-media.features.feature2.body
**Issue type**: Dunglish
**Current**: "Instagram, Facebook, LinkedIn met automatische optimale timing per account. Één content-kalender, drag & drop, cross-platform preview."
**Problem**: "cross-platform preview" is Engels, "drag & drop" acceptabel maar "verschuifbaar" of "sleepbaar" kan ook.
**Proposed**: "Instagram, Facebook en LinkedIn met automatisch optimale timing per account. Eén contentkalender, sleepbaar, met voorvertoning per platform."

### skills-social-media.features.feature3.body
**Issue type**: Dunglish
**Current**: "Educatieve carrousels (3-10 slides) en stories met templates in brand styling. Van idee tot publicatie-klaar in één pipeline."
**Problem**: "slides", "brand styling", "pipeline" zijn Engels; "publicatie-klaar" is stug.
**Proposed**: "Educatieve carrousels (3-10 dia's) en stories met sjablonen in jouw huisstijl. Van idee tot publicatieklaar in één doorloop."

### skills-social-media.features.feature4.body
**Issue type**: Anglicisme
**Current**: "Relevante hashtags per post-onderwerp, performance tracking per post (likes/comments/saves/shares) en auto-learning voor volgende content."
**Problem**: "performance tracking", "auto-learning" zijn Engels.
**Proposed**: "Relevante hashtags per onderwerp, prestatiemeting per post (likes, comments, saves, shares) en automatisch leren voor volgende content."

### skills-social-media.how.step1.body
**Issue type**: Dunglish
**Current**: "Tijdens onboarding leest Clyde eerdere content, brand guidelines en doelgroep-data. Bouwt een brand-profile per klant."
**Problem**: "brand guidelines", "doelgroep-data", "brand-profile" zijn Engels; laatste zin mist onderwerp ("Bouwt" zonder subject).
**Proposed**: "Tijdens de onboarding leest Clyde eerdere content, merkrichtlijnen en doelgroepgegevens in. Daarna bouwt hij een merkprofiel per klant."

### skills-social-media.how.step2.body
**Issue type**: Woordvolgorde
**Current**: "Je geeft thema en frequentie op; Clyde stelt de weekkalender samen met postvoorstellen, captions en hashtags."
**Problem**: Redelijk, maar "opgeven" is ambivalent (opgeven = surrender). "met postvoorstellen" is dubbelzinnig (samen-met of bestaat-uit).
**Proposed**: "Jij bepaalt thema en frequentie. Clyde stelt de weekkalender samen met postvoorstellen, captions en hashtags erbij."

### skills-social-media.how.step3.title
**Issue type**: Dunglish / glossary
**Current**: "Approve + publish"
**Problem**: Puur Engels in een Nederlandse pagina. Inconsistent met de rest van de sitestijl.
**Proposed**: "Goedkeuren en publiceren"

### skills-social-media.how.step3.body
**Issue type**: Dunglish
**Current**: "Jij reviewt de kalender (drag & drop). Na approval publiceert Clyde op optimale tijden en trackt performance."
**Problem**: "reviewt", "approval", "trackt performance" zijn anglicismen.
**Proposed**: "Jij beoordeelt de kalender (sleepbaar). Na jouw akkoord publiceert Clyde op de beste tijdstippen en volgt de prestaties."

### skills-social-media.integrations.subtitle
**Issue type**: Dunglish
**Current**: "Social media skill deelt context met andere vaardigheden via het gedeelde klant-geheugen."
**Problem**: "skill" vermengt met "vaardigheden" in één zin (glossary zegt: "vaardigheden"). Lidwoord ontbreekt.
**Proposed**: "De social media-vaardigheid deelt context met andere vaardigheden via het gedeelde klantgeheugen."

### skills-social-media.integrations.integration2
**Issue type**: Dunglish
**Current**: "Ad Creator. Best-performing organic content wordt ad-testmateriaal"
**Problem**: "Best-performing organic content" is Engels.
**Proposed**: "Ad Creator. Best presterende organische content wordt testmateriaal voor ads"

### skills-social-media.integrations.integration3
**Issue type**: Anglicisme
**Current**: "Reporting. Social KPIs in wekelijkse performance digest"
**Problem**: "performance digest" is Engels.
**Proposed**: "Reporting. Social KPI's in de wekelijkse prestatiedigest"

### skills-social-media.useCases.useCase1.body
**Issue type**: Dunglish
**Current**: "In plaats van 5-30 verschillende social managers: één Clyde met per-klant brand voice en cross-account learning."
**Problem**: "social managers", "brand voice", "cross-account learning" zijn Engels; kolonogebruik is typisch English.
**Proposed**: "In plaats van 5-30 losse social media-managers krijg je één Clyde die per klant de merkstem kent en leert over alle accounts heen."

### skills-social-media.useCases.useCase2.body
**Issue type**: Dunglish
**Current**: "SkinClarity Club draait al 3 Instagram-accounts × 4 merken op één Clyde-setup. Zie de case study voor concrete output."
**Problem**: "Clyde-setup", "output" zijn Engels.
**Proposed**: "SkinClarity Club draait al 3 Instagram-accounts en 4 merken op één Clyde-inrichting. Zie de case study voor concrete resultaten."

### skills-social-media.allocation.title
**Issue type**: Woordvolgorde / grammatica
**Current**: "Credit kost + tier-beschikbaarheid"
**Problem**: "Credit kost" is Engelse woordvolgorde (noun + noun); in NL hoort genitief: "Credit-kosten" of "Kosten in credits".
**Proposed**: "Kosten in credits + beschikbaarheid per tier"

### skills-social-media.proof.subtitle
**Issue type**: Anglicisme
**Current**: "~21 carrousels per week, ~15 posts, 3 IG-accounts autonoom. Zie case study voor screenshots en output-samples."
**Problem**: "output-samples" is Engels.
**Proposed**: "~21 carrousels per week, ~15 posts, 3 IG-accounts autonoom. Zie de case study voor screenshots en voorbeeldresultaten."

### skills-ad-creator.hero.subtitle
**Issue type**: Dunglish + marketing-cliche
**Current**: "Statische én video ads. Copy, visuals, multi-format (Feed / Stories / Reels). Publiceert direct naar Meta Ads Manager. A/B test varianten inclusief. Geen freelance-designer in de loop."
**Problem**: "Copy, visuals", "A/B test varianten inclusief", "in de loop" (letterlijk vertaald van "in the loop") zijn Engels. "A/B test" als bijvoeglijk naamwoord is ongewoon.
**Proposed**: "Statische én video-ads. Tekst, beeld, meerdere formaten (Feed, Stories, Reels). Publiceert direct naar Meta Ads Manager, inclusief A/B-testvarianten. Geen freelance-designer meer nodig."

### skills-ad-creator.features.feature1.body
**Issue type**: Anglicisme
**Current**: "Beeld + copy generatie in 1080×1080 (Feed) of 1080×1920 (Story/Reel). Orshot templates in brand styling."
**Problem**: "copy generatie" is Engels (moet "tekstgeneratie"); "brand styling" is Engels.
**Proposed**: "Beeld- en tekstgeneratie in 1080×1080 (Feed) of 1080×1920 (Story/Reel). Orshot-sjablonen in jouw huisstijl."

### skills-ad-creator.features.feature2.body
**Issue type**: Typo / grammatica
**Current**: "Korte video ads met motion graphics, text-overlays en muziek. Ideal voor Reels en Stories."
**Problem**: "Ideal" is Engels, moet "Ideaal" zijn (NL). "text-overlays" kan "tekstoverlays".
**Proposed**: "Korte video-ads met motion graphics, tekstoverlays en muziek. Ideaal voor Reels en Stories."

### skills-ad-creator.features.feature3.body
**Issue type**: Marketing-cliche
**Current**: "Clyde analyseert wat concurrenten adverteren. Output: voorbeelden + gap-analyse."
**Problem**: "Output:" + "gap-analyse" is Engels-jargon in een lopende zin.
**Proposed**: "Clyde analyseert wat concurrenten adverteren en levert voorbeelden plus een gap-analyse."

### skills-ad-creator.features.feature4.body
**Issue type**: Dunglish
**Current**: "Vraag 3-5 varianten op één ad-concept. Verschillende hooks, visuals, CTA's. Test tegelijkertijd."
**Problem**: "hooks", "visuals", "CTA's" zijn Engels. Ad-jargon acceptabel maar hier stapelen ze.
**Proposed**: "Vraag 3-5 varianten op één advertentieconcept. Verschillende openers, beelden, CTA's. Test tegelijkertijd."

### skills-ad-creator.how.step1.body
**Issue type**: Anglicisme
**Current**: "Product/dienst, doelgroep, USP en budget. Clyde leest brand guidelines voor consistency."
**Problem**: "brand guidelines voor consistency" is puur Engels.
**Proposed**: "Product of dienst, doelgroep, USP en budget. Clyde leest de merkrichtlijnen voor consistentie."

### skills-ad-creator.how.step2.title
**Issue type**: Typo
**Current**: "Ads generen"
**Problem**: "Generen" bestaat niet; moet "genereren".
**Proposed**: "Ads genereren"

### skills-ad-creator.how.step2.body
**Issue type**: Dunglish
**Current**: "Kies static/video, aantal varianten, formaat. Clyde levert publicatie-klare output binnen minuten."
**Problem**: "static/video" is Engels; "output" is Engels; "publicatie-klare" in combinatie met "output" is stug.
**Proposed**: "Kies statisch of video, aantal varianten en formaat. Clyde levert binnen enkele minuten publicatieklare ads."

### skills-ad-creator.how.step3.title
**Issue type**: Dunglish
**Current**: "Publish naar Meta"
**Problem**: Puur Engels.
**Proposed**: "Publiceren naar Meta"

### skills-ad-creator.how.step3.body
**Issue type**: Dunglish
**Current**: "Direct uitrollen naar Ads Manager via connectie. Jij stelt budget en audience in; Clyde levert creatives."
**Problem**: "audience", "creatives", "via connectie" (onnatuurlijk) zijn Engels.
**Proposed**: "Direct uitrollen naar Ads Manager via de koppeling. Jij stelt budget en doelgroep in; Clyde levert het creatieve materiaal."

### skills-ad-creator.useCases.useCase1.body
**Issue type**: Dunglish
**Current**: "Per product 3-5 ad varianten. Clyde schaalt ad-volume zonder freelance-designer bottleneck."
**Problem**: "bottleneck" is Engels.
**Proposed**: "Per product 3-5 ad-varianten. Clyde schaalt ad-volume zonder flessenhals bij een freelance-designer."

### skills-ad-creator.useCases.useCase2.body
**Issue type**: Anglicisme
**Current**: "Eén Clyde levert ads voor 10 klanten in parallel, elk in eigen brand styling en doelgroep."
**Problem**: "in parallel", "brand styling" zijn Engels.
**Proposed**: "Eén Clyde levert ads voor 10 klanten tegelijk, elk in de eigen huisstijl en voor de eigen doelgroep."

### skills-blog-factory.hero.subtitle
**Issue type**: Dunglish + marketing-cliche
**Current**: "Keyword research + longform (1500-3000 woorden) + SEO-optimalisatie + auto-publicatie naar de website. Eén pipeline van idee tot live. Onze kwaliteit wordt elke week beter. Blog Factory is live maar in doorontwikkeling."
**Problem**: "Keyword research", "longform", "pipeline", "live" (2x) zijn Engels; "van idee tot live" is letterlijk vertaald.
**Proposed**: "Zoekwoordonderzoek, longreads (1500-3000 woorden), SEO-optimalisatie en automatische publicatie naar de website. Eén doorloop van idee tot gepubliceerd. Onze kwaliteit wordt elke week beter. Blog Factory draait al, maar is volop in doorontwikkeling."

### skills-blog-factory.features.feature1.title
**Issue type**: Anglicisme
**Current**: "Keyword research + clustering"
**Problem**: "Keyword research" is Engels; "clustering" idem.
**Proposed**: "Zoekwoordonderzoek + clustering"

### skills-blog-factory.features.feature1.body
**Issue type**: Dunglish
**Current**: "Hoog-volume, laag-concurrentie keywords in de niche. Clustering naar pillar pages en supporting content."
**Problem**: "keywords", "pillar pages", "supporting content" zijn Engels.
**Proposed**: "Zoekwoorden met hoog volume en lage concurrentie in de niche. Gegroepeerd naar pilaarpagina's en ondersteunende content."

### skills-blog-factory.features.feature2.title
**Issue type**: Anglicisme
**Current**: "Longform (1500-3000 woorden)"
**Problem**: "Longform" is Engels; NL: "longread".
**Proposed**: "Longreads (1500-3000 woorden)"

### skills-blog-factory.features.feature2.body
**Issue type**: Anglicisme
**Current**: "Diepgaande artikelen in brand voice. Research-gebaseerd, bronvermelding, scanbare structuur."
**Problem**: "brand voice", "Research-gebaseerd" zijn Engels.
**Proposed**: "Diepgaande artikelen in de merkstem. Onderzoek-gedreven, met bronvermelding en scanbare structuur."

### skills-blog-factory.features.feature3.body
**Issue type**: Dunglish
**Current**: "Meta description, heading structuur, internal linking, image alt tags, Core Web Vitals check."
**Problem**: "heading structuur", "internal linking", "image alt tags", "check" zijn Engels.
**Proposed**: "Meta-description, koppenstructuur, interne links, alt-teksten voor afbeeldingen, controle van Core Web Vitals."

### skills-blog-factory.features.feature4.body
**Issue type**: Dunglish
**Current**: "WordPress/Webflow/Shopify connectie. Draft → review → publish. Plannen ook mogelijk."
**Problem**: "Draft → review → publish" is volledig Engels.
**Proposed**: "Koppeling met WordPress, Webflow of Shopify. Concept → beoordelen → publiceren. Inplannen kan ook."

### skills-blog-factory.how.step1.body
**Issue type**: Dunglish + typo
**Current**: "Clyde identificeert 50-100 target keywords per klant, clustered naar content-themas."
**Problem**: "target keywords", "clustered" zijn Engels; "content-themas" mist trema ("content-thema's").
**Proposed**: "Clyde identificeert 50-100 zoekwoorden per klant, gegroepeerd naar content-thema's."

### skills-blog-factory.how.step2.body
**Issue type**: Dunglish
**Current**: "Kies welke keywords aanpakken. Clyde maakt outline + schrijft. Jij reviewt op een Google Doc-achtige interface."
**Problem**: "keywords", "outline", "reviewt" zijn Engels; "welke keywords aanpakken" is grammaticaal incompleet (ontbrekend werkwoord: "wil je aanpakken").
**Proposed**: "Kies welke zoekwoorden je wilt aanpakken. Clyde maakt een opzet en schrijft het artikel. Jij beoordeelt het in een Google Docs-achtige interface."

### skills-blog-factory.how.step3.body
**Issue type**: Anglicisme
**Current**: "Na approval publiceert Clyde. SEO-rankings worden getracked door SEO/GEO-skill in parallel."
**Problem**: "approval", "SEO-rankings worden getracked", "in parallel" zijn Engels.
**Proposed**: "Na jouw akkoord publiceert Clyde. De SEO/GEO-vaardigheid volgt de rankings tegelijkertijd."

### skills-blog-factory.integrations.integration2
**Issue type**: Woordvolgorde
**Current**: "Social Media. Blog content wordt social posts afgeleid"
**Problem**: Grammaticaal incorrect. "Blog content wordt [naar] social posts afgeleid" mist voorzetsel; de hele zinsconstructie klopt niet in NL.
**Proposed**: "Social Media. Blogcontent wordt afgeleid naar social posts"

### skills-blog-factory.useCases.useCase1.body
**Issue type**: Woordvolgorde
**Current**: "Product-gerelateerde longform blogs die organic traffic opbouwen. SkinClarity Club publiceert zo 2-4 blogs/maand."
**Problem**: "longform blogs", "organic traffic" zijn Engels.
**Proposed**: "Productgerelateerde longreads die organisch verkeer opbouwen. SkinClarity Club publiceert zo 2-4 blogs per maand."

### skills-blog-factory.useCases.useCase2.body
**Issue type**: Onnatuurlijk
**Current**: "Thought leadership blogs in niche. Clyde werkt jouw expertise uit tot artikelen."
**Problem**: "Thought leadership blogs in niche" zonder lidwoord is krom en Engels-geplakt.
**Proposed**: "Thought leadership-blogs binnen jouw niche. Clyde werkt jouw expertise uit tot volwaardige artikelen."

### skills-reel-builder.meta.title
**Issue type**: Anglicisme
**Current**: "Reel Builder. Verticale AI-videos met captions + muziek | Clyde"
**Problem**: "videos" zou "video's" moeten zijn (NL spelling met apostrof).
**Proposed**: "Reel Builder. Verticale AI-video's met captions + muziek | Clyde"

### skills-reel-builder.meta.description
**Issue type**: Dunglish
**Current**: "Korte verticale videos (9:16), AI scripts, auto-captions, muziek, voor Instagram Reels / TikTok / Shorts. 25 cr per reel."
**Problem**: "videos", "AI scripts" zijn Engels (scripts acceptabel in context, maar videos niet).
**Proposed**: "Korte verticale video's (9:16), AI-scripts, auto-captions, muziek, voor Instagram Reels, TikTok en Shorts. 25 cr per reel."

### skills-reel-builder.hero.subtitle
**Issue type**: Dunglish
**Current**: "Korte verticale videos (9:16) met AI-gegenereerde scripts, auto-captions die synchroon lopen, achtergrondmuziek. Voor Instagram Reels, TikTok, YouTube Shorts. Coming soon."
**Problem**: "videos" spellfout; "Coming soon" is puur Engels.
**Proposed**: "Korte verticale video's (9:16) met AI-gegenereerde scripts, auto-captions die synchroon lopen en achtergrondmuziek. Voor Instagram Reels, TikTok en YouTube Shorts. Binnenkort beschikbaar."

### skills-reel-builder.features.feature2.body
**Issue type**: Anglicisme
**Current**: "Captions lopen synchroon met de audio, geanimeerd volgens platform-conventies."
**Problem**: Acceptabel, maar "audio" kan "gesproken tekst" of "geluid" zijn; "platform-conventies" is krom.
**Proposed**: "Captions lopen synchroon met de gesproken tekst, geanimeerd volgens de conventies van elk platform."

### skills-reel-builder.features.feature3.body
**Issue type**: Dunglish
**Current**: "Passende achtergrondmuziek met beat-sync. Ingebouwde licentie-vrije library."
**Problem**: "beat-sync", "library" zijn Engels.
**Proposed**: "Passende achtergrondmuziek op de beat. Ingebouwde licentievrije muziekbibliotheek."

### skills-reel-builder.features.feature4.body
**Issue type**: Dunglish
**Current**: "Talking head / B-roll montage / text-overlay templates. Snelle start per format."
**Problem**: "templates", "format", "text-overlay" zijn Engels (B-roll acceptabel als vakjargon).
**Proposed**: "Sjablonen voor talking head, B-roll-montage en tekstoverlay. Snelle start per formaat."

### skills-reel-builder.how.step2.title
**Issue type**: Dunglish
**Current**: "Review + customize"
**Problem**: Volledig Engels.
**Proposed**: "Beoordelen en aanpassen"

### skills-reel-builder.how.step2.body
**Issue type**: Anglicisme
**Current**: "Script editen, caption-style kiezen, muziek selecteren. Alles preview-baar."
**Problem**: "editen", "caption-style", "preview-baar" zijn Engels (of hybride).
**Proposed**: "Script aanpassen, caption-stijl kiezen, muziek selecteren. Alles direct voor te vertonen."

### skills-reel-builder.how.step3.title
**Issue type**: Dunglish
**Current**: "Export + publiceren"
**Problem**: "Export" is Engels in een werkwoord-gevolgde zin; "exporteren" is NL.
**Proposed**: "Exporteren en publiceren"

### skills-reel-builder.how.step3.body
**Issue type**: Anglicisme
**Current**: "Publicatie-klare MP4 (9:16). Direct uploaden of via Social Media skill schedulen."
**Problem**: "uploaden" is geaccepteerd, "schedulen" minder (inplannen is standaard NL); "skill" i.p.v. "vaardigheid".
**Proposed**: "Publicatieklare MP4 (9:16). Direct uploaden of via de Social Media-vaardigheid inplannen."

### skills-reel-builder.useCases.useCase1.body
**Issue type**: Dunglish
**Current**: "Wekelijks 3-5 reels, zonder eigen videograaf. Template-gedreven productie."
**Problem**: "Template-gedreven" is Engels.
**Proposed**: "Wekelijks 3-5 reels, zonder eigen videograaf. Productie op basis van sjablonen."

### skills-reel-builder.useCases.useCase2.body
**Issue type**: Anglicisme
**Current**: "Per product een korte Reel voor organic + ads. Clyde schaalt output."
**Problem**: "organic + ads", "output" zijn Engels.
**Proposed**: "Per product een korte Reel voor organisch bereik en ads. Clyde schaalt de productie mee."
