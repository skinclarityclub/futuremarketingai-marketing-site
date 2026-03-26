const fs = require("fs");
const path = require("path");

const messagesDir = path.join(__dirname, "..", "messages");
const en = JSON.parse(fs.readFileSync(path.join(messagesDir, "en.json"), "utf8"));

// Clone EN as base for NL
const nl = JSON.parse(JSON.stringify(en));

// NL About
nl.about.meta.title = "Over Future Marketing AI | AI-bureau voor Groeiende Teams";
nl.about.meta.description = "Leer over Future Marketing AI, het autonome marketingplatform gebouwd door operators voor ambitieuze bedrijven.";
nl.about.hero.badge = "Lancering Q1 2026";
nl.about.hero.title = "Over Future Marketing AI";
nl.about.hero.tagline = "Bouwend aan het autonome marketingsysteem van de toekomst";
nl.about.mission.heading = "Onze Missie";
nl.about.mission.text = "Enterprise-grade AI marketing automatisering democratiseren voor ambitieuze bedrijven. Wij geloven dat elk bedrijf toegang moet hebben tot dezelfde intelligente marketingmogelijkheden als Fortune 500 bedrijven \u2014 zonder het Fortune 500 budget.";
nl.about.mission.why_heading = "Waarom We Dit Bouwden";
nl.about.mission.why_text = "We bouwden dit platform eerst voor onszelf. Als operators die onze eigen marketing runnen, waren we gefrustreerd door gefragmenteerde tools, handmatige workflows en het onvermogen om te schalen zonder aan te nemen.";
nl.about.timeline.title = "De Evolutie van Marketing Automatisering";
nl.about.timeline.eras.assisted.title = "AI-Assisted Marketing Era";
nl.about.timeline.eras.assisted.description = "ChatGPT en vergelijkbare tools helpen marketeers sneller werken, maar vereisen nog steeds aanzienlijk handmatig toezicht.";
nl.about.timeline.eras.autonomous.title = "Autonome Marketing Era";
nl.about.timeline.eras.autonomous.description = "Complete AI-systemen die de hele workflow autonoom afhandelen.";
nl.about.timeline.eras.standard.title = "Standaard Praktijk";
nl.about.timeline.eras.standard.description = "Autonome marketing wordt de norm.";
nl.about.timeline.key_message.title = "Early adopters behalen een 3-5 jaar concurrentievoordeel";
nl.about.timeline.key_message.description = "Net als vroege Salesforce adopters in 2004.";
nl.about.cta.title = "Sluit Je Aan Bij De Founding Teams";
nl.about.cta.description = "We bouwen dit in partnerschap met 3 vooruitdenkende bedrijven.";
nl.about.cta.demo_button = "Boek een Strategiegesprek";
nl.about.cta.contact_button = "Neem Contact Op";

// NL Pricing
nl.pricing.meta.title = "Prijzen | Future Marketing AI";
nl.pricing.meta.description = "Transparante prijzen voor managed AI-diensten. Kies Starter, Growth of Scale.";
nl.pricing.hero.title = "AI Die Voor Jou Werkt \u2014 Kies Je Plan";
nl.pricing.hero.description = "Managed AI-diensten op maat van je bedrijf. Geen langetermijncontracten.";
nl.pricing.tiers.starter.description = "Perfect voor bedrijven die willen starten met een AI-dienst.";
nl.pricing.tiers.starter.service_count = "1 dienst";
nl.pricing.tiers.starter.features_0 = "Kies 1 dienst";
nl.pricing.tiers.starter.features_1 = "Hosting & infrastructuur inbegrepen";
nl.pricing.tiers.starter.features_2 = "Maandelijkse updates & onderhoud";
nl.pricing.tiers.starter.features_3 = "E-mail support";
nl.pricing.tiers.starter.features_4 = "Setup in 1-2 weken";
nl.pricing.tiers.growth.badge = "Populairst";
nl.pricing.tiers.growth.description = "Voor groeiende teams die meerdere AI-mogelijkheden nodig hebben.";
nl.pricing.tiers.growth.service_count = "2 diensten";
nl.pricing.tiers.growth.features_0 = "Kies 2 diensten";
nl.pricing.tiers.growth.features_1 = "Analytics dashboard";
nl.pricing.tiers.growth.features_2 = "Maandelijks prestatierapport";
nl.pricing.tiers.growth.features_3 = "Chat & e-mail support";
nl.pricing.tiers.growth.features_4 = "Setup in 2-3 weken";
nl.pricing.tiers.scale.description = "Het complete pakket voor ambitieuze bedrijven.";
nl.pricing.tiers.scale.service_count = "Alle 3 diensten";
nl.pricing.tiers.scale.features_0 = "Alle 3 diensten inbegrepen";
nl.pricing.tiers.scale.features_1 = "Prioriteit support (<4u respons)";
nl.pricing.tiers.scale.features_2 = "Maandelijks strategiegesprek";
nl.pricing.tiers.scale.features_3 = "Geavanceerde analytics";
nl.pricing.tiers.scale.features_4 = "Setup in 2-4 weken";
nl.pricing.cta.title = "Klaar Om AI Aan Het Werk Te Zetten?";
nl.pricing.cta.description = "Boek een gratis strategiegesprek.";
nl.pricing.cta.primary_button = "Boek een Strategiegesprek";
nl.pricing.cta.secondary_button = "Neem Contact Op";

// NL How It Works
nl["how-it-works"].meta.title = "Hoe Het Werkt | Future Marketing AI";
nl["how-it-works"].meta.description = "Leer hoe de 6 autonome modules van Future Marketing AI samenwerken.";
nl["how-it-works"].hero.title = "Hoe Werkt Future Marketing AI?";
nl["how-it-works"].hero.description = "Een volledig autonoom systeem met 6 AI modules die 24/7 werken.";
nl["how-it-works"].process.title = "De Autonome Marketing Loop";
nl["how-it-works"].process.steps.research.step = "Stap 1";
nl["how-it-works"].process.steps.research.title = "Platform Analyseert Je Markt 24/7";
nl["how-it-works"].process.steps.research.description = "Onze AI Research module monitort trends, concurrenten en kansen continu.";
nl["how-it-works"].process.steps.content.step = "Stap 2";
nl["how-it-works"].process.steps.content.title = "AI Genereert Premium Content op Schaal";
nl["how-it-works"].process.steps.content.description = "Content Pipelines produceren 15x meer content dan traditionele methoden.";
nl["how-it-works"].process.steps.workflow.step = "Stap 3";
nl["how-it-works"].process.steps.workflow.title = "Manager Coordineert Alles";
nl["how-it-works"].process.steps.workflow.description = "De Manager Orchestrator zorgt ervoor dat alle modules naadloos samenwerken.";
nl["how-it-works"].process.steps.publishing.step = "Stap 4";
nl["how-it-works"].process.steps.publishing.title = "Optimale Distributie Over Kanalen";
nl["how-it-works"].process.steps.publishing.description = "Smart Publishing bepaalt de beste tijd en messaging voor elk stuk content.";
nl["how-it-works"].process.steps.learning.step = "Stap 5";
nl["how-it-works"].process.steps.learning.title = "Analytics Leren en Verbeteren";
nl["how-it-works"].process.steps.learning.description = "Self-Learning Analytics volgen prestaties en identificeren winnende patronen.";
nl["how-it-works"].process.steps.ads.step = "Stap 6";
nl["how-it-works"].process.steps.ads.title = "Beste Content Wordt Advertenties";
nl["how-it-works"].process.steps.ads.description = "Best presterende content wordt automatisch omgezet naar betaalde advertenties.";
nl["how-it-works"].process.loop_title = "Continue Loop";
nl["how-it-works"].process.loop_description = "Dit proces draait 24/7, waarbij elke iteratie het systeem slimmer maakt.";
nl["how-it-works"].cta.title = "Ervaar Het Zelf";
nl["how-it-works"].cta.description = "De beste manier om te begrijpen hoe het werkt is door het te proberen.";
nl["how-it-works"].cta.button = "Boek een Strategiegesprek";

// NL Contact
nl.contact.meta.title = "Contact | Future Marketing AI";
nl.contact.meta.description = "Neem contact op met Future Marketing AI.";
nl.contact.hero.title = "Neem Contact Op";
nl.contact.hero.description = "Klaar om je marketing te transformeren met autonome AI?";
nl.contact.form.title = "Stuur Ons Een Bericht";
nl.contact.form.name_label = "Jouw Naam";
nl.contact.form.name_placeholder = "Jan Janssen";
nl.contact.form.email_label = "E-mailadres";
nl.contact.form.email_placeholder = "jij@bedrijf.nl";
nl.contact.form.company_label = "Bedrijf";
nl.contact.form.company_placeholder = "Jouw Bedrijf B.V.";
nl.contact.form.message_label = "Bericht";
nl.contact.form.message_placeholder = "Vertel ons over je marketingdoelen...";
nl.contact.form.submit_button = "Verstuur Bericht";
nl.contact.book_demo.title = "Boek Een Demo Gesprek";
nl.contact.book_demo.description = "Plan een gepersonaliseerde demo.";
nl.contact.book_demo.button = "Plan Demo";
nl.contact.direct_contact.title = "Direct Contact";
nl.contact.direct_contact.location_text = "Nederland (Remote-First)";
nl.contact.direct_contact.response_time_label = "Reactietijd";
nl.contact.direct_contact.response_time_text = "Binnen 24 uur";

// NL Legal
nl.legal.meta.title = "Juridisch | Future Marketing AI";
nl.legal.meta.description = "Juridische informatie voor Future Marketing AI.";
nl.legal.hero.title = "Juridisch";
nl.legal.sections.terms.title = "Servicevoorwaarden";
nl.legal.sections.privacy.title = "Privacybeleid";
nl.legal.sections.cookies.title = "Cookiebeleid";
nl.legal.sections.disclaimer.title = "Disclaimer";
nl.legal.last_updated = "Laatst bijgewerkt: maart 2026";

fs.writeFileSync(path.join(messagesDir, "nl.json"), JSON.stringify(nl, null, 2));
console.log("nl.json created");

// Clone EN as base for ES
const es = JSON.parse(JSON.stringify(en));

// ES About
es.about.meta.title = "Acerca de Future Marketing AI | Agencia IA para Equipos";
es.about.meta.description = "Conoce Future Marketing AI, la plataforma de marketing autonomo construida por operadores.";
es.about.hero.badge = "Lanzamiento Q1 2026";
es.about.hero.title = "Acerca de Future Marketing AI";
es.about.hero.tagline = "Construyendo el sistema de marketing autonomo del futuro";
es.about.mission.heading = "Nuestra Mision";
es.about.mission.text = "Democratizar la automatizacion de marketing IA de nivel empresarial para negocios ambiciosos.";
es.about.mission.why_heading = "Por Que Construimos Esto";
es.about.mission.why_text = "Construimos esta plataforma para nosotros mismos primero.";
es.about.timeline.title = "La Evolucion de la Automatizacion de Marketing";
es.about.timeline.eras.assisted.title = "Era del Marketing Asistido por IA";
es.about.timeline.eras.autonomous.title = "Era del Marketing Autonomo";
es.about.timeline.eras.standard.title = "Practica Estandar";
es.about.cta.title = "Unete a los Equipos Fundadores";
es.about.cta.description = "Estamos construyendo esto con 3 negocios visionarios.";
es.about.cta.demo_button = "Reservar una Llamada";
es.about.cta.contact_button = "Contactenos";

// ES Pricing
es.pricing.meta.title = "Precios | Future Marketing AI";
es.pricing.meta.description = "Precios transparentes para servicios de IA gestionados.";
es.pricing.hero.title = "IA Que Trabaja Para Ti";
es.pricing.hero.description = "Servicios de IA gestionados a medida para tu negocio.";
es.pricing.cta.title = "Listo Para Poner la IA a Trabajar?";
es.pricing.cta.description = "Reserva una llamada de estrategia gratuita.";
es.pricing.cta.primary_button = "Reservar una Llamada";
es.pricing.cta.secondary_button = "Contactenos";

// ES How It Works
es["how-it-works"].meta.title = "Como Funciona | Future Marketing AI";
es["how-it-works"].meta.description = "Aprende como los 6 modulos autonomos automatizan tu marketing.";
es["how-it-works"].hero.title = "Como Funciona Future Marketing AI?";
es["how-it-works"].hero.description = "Un sistema completamente autonomo con 6 modulos IA trabajando 24/7.";
es["how-it-works"].process.title = "El Ciclo de Marketing Autonomo";
es["how-it-works"].cta.title = "Experimentalo Tu Mismo";
es["how-it-works"].cta.description = "La mejor manera de entender como funciona es probarlo.";
es["how-it-works"].cta.button = "Reservar una Llamada";

// ES Contact
es.contact.meta.title = "Contacto | Future Marketing AI";
es.contact.meta.description = "Ponte en contacto con Future Marketing AI.";
es.contact.hero.title = "Contactanos";
es.contact.hero.description = "Listo para transformar tu marketing con IA autonoma?";
es.contact.form.title = "Envianos un Mensaje";
es.contact.form.name_label = "Tu Nombre";
es.contact.form.name_placeholder = "Juan Perez";
es.contact.form.email_label = "Direccion de Email";
es.contact.form.email_placeholder = "tu@empresa.com";
es.contact.form.company_label = "Empresa";
es.contact.form.company_placeholder = "Tu Empresa S.L.";
es.contact.form.message_label = "Mensaje";
es.contact.form.message_placeholder = "Cuentanos sobre tus objetivos de marketing...";
es.contact.form.submit_button = "Enviar Mensaje";
es.contact.book_demo.title = "Reservar Llamada de Demo";
es.contact.book_demo.description = "Programa una demo personalizada.";
es.contact.book_demo.button = "Programar Demo";
es.contact.direct_contact.title = "Contacto Directo";
es.contact.direct_contact.location_text = "Paises Bajos (Remoto)";
es.contact.direct_contact.response_time_label = "Tiempo de Respuesta";
es.contact.direct_contact.response_time_text = "Dentro de 24 horas";

// ES Legal
es.legal.meta.title = "Legal | Future Marketing AI";
es.legal.meta.description = "Informacion legal para Future Marketing AI.";
es.legal.hero.title = "Legal";
es.legal.sections.terms.title = "Terminos de Servicio";
es.legal.sections.privacy.title = "Politica de Privacidad";
es.legal.sections.cookies.title = "Politica de Cookies";
es.legal.sections.disclaimer.title = "Aviso Legal";
es.legal.last_updated = "Ultima actualizacion: marzo 2026";

fs.writeFileSync(path.join(messagesDir, "es.json"), JSON.stringify(es, null, 2));
console.log("es.json created");
