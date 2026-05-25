#!/usr/bin/env node
// One-shot helper for Fase 2: adds skills-template shared namespace + per-skill heroPrompts.
// Run from fmai-nextjs/: node scripts/add-fase2-i18n.mjs
// Idempotent: re-running merges in any missing keys without clobbering existing values.

import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const messagesDir = join(__dirname, '..', 'messages')

const SHARED_TEMPLATE = {
  nl: {
    eyebrows: {
      features: 'Functies',
      how: 'Werkwijze',
      integrations: 'Integraties',
      useCases: 'Toepassingen',
      allocation: 'Tier-verdeling',
      proof: 'Bewijs',
      related: 'Combineert met',
      faq: 'FAQ',
      cta: 'Aan de slag',
    },
    related: {
      title: 'Combineert met',
      subtitle: 'Andere vaardigheden die meewerken in hetzelfde geheugen per merk.',
    },
    toc: {
      title: 'Op deze pagina',
      features: 'Functies',
      how: 'Werkwijze',
      integrations: 'Integraties',
      useCases: 'Toepassingen',
      allocation: 'Tier-verdeling',
      proof: 'Bewijs',
      related: 'Combineert met',
      faq: 'FAQ',
      cta: 'Plan een gesprek',
    },
    promptHero: {
      intro: 'Vraag Clyde bijvoorbeeld:',
    },
  },
  en: {
    eyebrows: {
      features: 'Features',
      how: 'How it works',
      integrations: 'Integrations',
      useCases: 'Use cases',
      allocation: 'Per-tier allocation',
      proof: 'Proof',
      related: 'Pairs with',
      faq: 'FAQ',
      cta: 'Get started',
    },
    related: {
      title: 'Pairs with',
      subtitle: 'Other skills that work alongside in the same per-brand memory.',
    },
    toc: {
      title: 'On this page',
      features: 'Features',
      how: 'How it works',
      integrations: 'Integrations',
      useCases: 'Use cases',
      allocation: 'Per-tier allocation',
      proof: 'Proof',
      related: 'Pairs with',
      faq: 'FAQ',
      cta: 'Book a call',
    },
    promptHero: {
      intro: 'Ask Clyde something like:',
    },
  },
  es: {
    eyebrows: {
      features: 'Funciones',
      how: 'Cómo funciona',
      integrations: 'Integraciones',
      useCases: 'Casos de uso',
      allocation: 'Asignación por tier',
      proof: 'Prueba',
      related: 'Combina con',
      faq: 'FAQ',
      cta: 'Empieza',
    },
    related: {
      title: 'Combina con',
      subtitle: 'Otras habilidades que colaboran en la misma memoria por marca.',
    },
    toc: {
      title: 'En esta página',
      features: 'Funciones',
      how: 'Cómo funciona',
      integrations: 'Integraciones',
      useCases: 'Casos de uso',
      allocation: 'Asignación por tier',
      proof: 'Prueba',
      related: 'Combina con',
      faq: 'FAQ',
      cta: 'Reserva una llamada',
    },
    promptHero: {
      intro: 'Pídele a Clyde, por ejemplo:',
    },
  },
}

const PROMPTS = {
  'skills-social-media': {
    nl: [
      'Plan de Instagram-content voor alle SKC-merken deze week',
      'Maak 5 carrouselposts over de winter-routine',
      'Welke captions presteren het best op LinkedIn voor B2B?',
    ],
    en: [
      'Plan the Instagram content for all SKC brands this week',
      'Draft 5 carousel posts about the winter routine',
      'Which captions perform best on LinkedIn for B2B?',
    ],
    es: [
      'Planifica el contenido de Instagram de todas las marcas SKC esta semana',
      'Crea 5 carruseles sobre la rutina de invierno',
      '¿Qué pies de foto rinden mejor en LinkedIn para B2B?',
    ],
  },
  'skills-blog-factory': {
    nl: [
      'Schrijf een SEO-artikel over serum voor de gevoelige huid',
      'Bouw een topic cluster rond hydratatieroutines',
      'Update meta-beschrijvingen van de tien best gelezen blogs',
    ],
    en: [
      'Write an SEO article on serum for sensitive skin',
      'Build a topic cluster around hydration routines',
      'Refresh meta descriptions for our ten top blogs',
    ],
    es: [
      'Redacta un artículo SEO sobre sérum para piel sensible',
      'Construye un cluster temático sobre rutinas de hidratación',
      'Actualiza las metadescripciones de los diez blogs más leídos',
    ],
  },
  'skills-ad-creator': {
    nl: [
      'Maak 3 ad-varianten voor de winter-campagne',
      'Schrijf een video-ad-script voor de glow serum-lancering',
      'A/B-test 2 visuele varianten voor de promotie volgende week',
    ],
    en: [
      'Create 3 ad variants for the winter campaign',
      'Write a video ad script for the glow serum launch',
      'A/B test 2 creative variants for next week’s promo',
    ],
    es: [
      'Crea 3 variantes de anuncio para la campaña de invierno',
      'Escribe un guion de video-anuncio para el lanzamiento del serum',
      'Prueba A/B con 2 visuales para la promoción de la próxima semana',
    ],
  },
  'skills-reel-builder': {
    nl: [
      'Maak een 30-seconden Reel over het ochtendritueel',
      'Genereer een TikTok-script voor de productlancering',
      'Maak 5 hook-varianten voor onze best presterende Reel',
    ],
    en: [
      'Build a 30-second Reel about the morning ritual',
      'Generate a TikTok script for the product launch',
      'Spin 5 hook variants for our top-performing Reel',
    ],
    es: [
      'Crea un Reel de 30 segundos sobre la rutina matinal',
      'Genera un guion de TikTok para el lanzamiento',
      'Diseña 5 variantes de hook para nuestro Reel destacado',
    ],
  },
  'skills-voice-agent': {
    nl: [
      'Bel de wachtlijst en boek afspraken voor volgende week',
      'Beantwoord inkomende vragen over de levertijd',
      'Volg klanten op die hun afspraak hebben gemist',
    ],
    en: [
      'Call the waitlist and book appointments for next week',
      'Answer inbound questions about delivery times',
      'Follow up with customers who missed their appointment',
    ],
    es: [
      'Llama a la lista de espera y agenda citas para la próxima semana',
      'Responde llamadas entrantes sobre los plazos de entrega',
      'Haz seguimiento a clientes que faltaron a su cita',
    ],
  },
  'skills-lead-qualifier': {
    nl: [
      'Kwalificeer de leads van de afgelopen 24 uur',
      'Route alle hot leads direct naar de sales-inbox',
      'Geef me een sample van tien net binnengekomen chats',
    ],
    en: [
      'Qualify the leads from the past 24 hours',
      'Route all hot leads straight to the sales inbox',
      'Show me a sample of ten freshly arrived chats',
    ],
    es: [
      'Califica los leads de las últimas 24 horas',
      'Enruta los hot leads directamente a la bandeja de ventas',
      'Muéstrame diez chats recién llegados',
    ],
  },
  'skills-email-management': {
    nl: [
      'Vat de belangrijkste e-mails van vandaag samen',
      'Label alle facturen en route ze naar de boekhouder',
      'Wat zijn de drie acties die vandaag in de inbox moeten?',
    ],
    en: [
      'Summarize today’s most important emails',
      'Label every invoice and route them to bookkeeping',
      'Which three inbox actions matter today?',
    ],
    es: [
      'Resume los correos más importantes de hoy',
      'Etiqueta cada factura y envíalas a contabilidad',
      '¿Cuáles son las tres acciones clave del buzón hoy?',
    ],
  },
  'skills-manychat': {
    nl: [
      "Beantwoord DM's met het keyword levertijd automatisch",
      "Stuur warme leads via DM door naar onze sales-pagina",
      'Maak een Story-trigger voor de nieuwe productlaunch',
    ],
    en: [
      'Auto-answer DMs containing the keyword delivery time',
      'Forward warm DM leads to our sales page',
      'Set up a Story trigger for the new product launch',
    ],
    es: [
      'Responde automáticamente DMs con la palabra tiempos de entrega',
      'Envía leads cálidos por DM a la página de ventas',
      'Configura un trigger de Story para el nuevo lanzamiento',
    ],
  },
  'skills-reporting': {
    nl: [
      'Genereer de wekelijkse performance-digest voor alle merken',
      'Welke metrics wijken deze week meer dan 20% af?',
      'Vergelijk de Q4-cijfers van SkinClarity met Q3',
    ],
    en: [
      'Generate the weekly performance digest for every brand',
      'Which metrics drifted more than 20% this week?',
      'Compare SkinClarity’s Q4 numbers against Q3',
    ],
    es: [
      'Genera el resumen semanal de rendimiento para todas las marcas',
      '¿Qué métricas se desviaron más del 20% esta semana?',
      'Compara las cifras de Q4 de SkinClarity con las de Q3',
    ],
  },
  'skills-seo-geo': {
    nl: [
      'Voer een technische SEO-audit uit op de hoofddomeinen',
      'Track hoe vaak ons merk wordt geciteerd in ChatGPT en Perplexity',
      'Welke keywords zijn deze week gezakt in ranking?',
    ],
    en: [
      'Run a technical SEO audit on the main domains',
      'Track how often our brand is cited by ChatGPT and Perplexity',
      'Which keywords dropped in ranking this week?',
    ],
    es: [
      'Ejecuta una auditoría SEO técnica de los dominios principales',
      'Mide con qué frecuencia ChatGPT y Perplexity citan nuestra marca',
      '¿Qué keywords bajaron de posición esta semana?',
    ],
  },
  'skills-research': {
    nl: [
      'Onderzoek de top-5 concurrenten in de hydratatie-markt',
      'Wat zijn de trending topics in skincare deze maand?',
      'Vat de laatste branche-rapporten over EU-cosmetica samen',
    ],
    en: [
      'Research the top-5 competitors in the hydration market',
      'What are this month’s trending topics in skincare?',
      'Summarize the latest industry reports on EU cosmetics',
    ],
    es: [
      'Investiga los 5 principales competidores en hidratación',
      '¿Cuáles son los temas tendencia en skincare este mes?',
      'Resume los últimos informes del sector cosmético europeo',
    ],
  },
  'skills-clyde': {
    nl: [
      'Plan deze week voor alle SKC-merken inclusief Reels',
      'Maak een wekelijks rapport over de top presterende posts',
      'Welke skill werkt aan welke campagne deze sprint?',
    ],
    en: [
      'Plan this week for all SKC brands, Reels included',
      'Build a weekly report on the top performing posts',
      'Which skill is running which campaign this sprint?',
    ],
    es: [
      'Planifica esta semana para todas las marcas SKC, Reels incluidos',
      'Crea un informe semanal de las publicaciones con mejor rendimiento',
      '¿Qué habilidad gestiona cada campaña en este sprint?',
    ],
  },
}

function deepMerge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      deepMerge(target[key], value)
    } else if (!(key in target)) {
      target[key] = value
    }
  }
  return target
}

async function patchLocale(locale) {
  const path = join(messagesDir, `${locale}.json`)
  const raw = await readFile(path, 'utf8')
  const json = JSON.parse(raw)

  // 1. Insert top-level "skills-template" namespace if missing.
  if (!json['skills-template']) {
    json['skills-template'] = SHARED_TEMPLATE[locale]
  } else {
    deepMerge(json['skills-template'], SHARED_TEMPLATE[locale])
  }

  // 2. Inject per-skill hero.prompts under each skills-X namespace.
  for (const [skillNs, langs] of Object.entries(PROMPTS)) {
    const skill = json[skillNs]
    if (!skill) {
      console.warn(`Locale ${locale}: missing namespace ${skillNs}`)
      continue
    }
    skill.hero ??= {}
    if (!skill.hero.prompts) {
      const [p1, p2, p3] = langs[locale]
      skill.hero.prompts = { prompt1: p1, prompt2: p2, prompt3: p3 }
    }
  }

  await writeFile(path, JSON.stringify(json, null, 2) + '\n', 'utf8')
  console.log(`Patched ${locale}.json`)
}

for (const loc of ['nl', 'en', 'es']) {
  await patchLocale(loc)
}
