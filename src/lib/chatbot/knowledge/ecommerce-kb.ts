import type { TopicDefinition } from '../types'

export interface Product {
  id: string
  name: string
  price: number
  skinTypes: string[]
  concerns: string[]
  ingredients: string[]
  description: string
}

export const PRODUCT_CATALOG: Product[] = [
  {
    id: 'gentle-cleansing-foam',
    name: 'Gentle Cleansing Foam',
    price: 24.95,
    skinTypes: ['dry', 'sensitive', 'normal'],
    concerns: ['dryness', 'irritation', 'cleansing'],
    ingredients: ['ceramides', 'glycerin', 'aloe vera'],
    description:
      'A soft, pH-balanced foaming cleanser that removes impurities without stripping the skin barrier. Ideal for dry and sensitive skin types.',
  },
  {
    id: 'balancing-toner',
    name: 'Balancing Toner',
    price: 19.95,
    skinTypes: ['oily', 'combination', 'normal'],
    concerns: ['pores', 'oiliness', 'balance'],
    ingredients: ['niacinamide', 'witch hazel', 'green tea extract'],
    description:
      'A lightweight toner that minimizes pores and controls excess oil while maintaining hydration. Perfect after cleansing.',
  },
  {
    id: 'hydra-boost-serum',
    name: 'Hydra Boost Serum',
    price: 34.95,
    skinTypes: ['dry', 'normal', 'combination'],
    concerns: ['hydration', 'dryness', 'plumping'],
    ingredients: ['hyaluronic acid', 'squalane', 'vitamin E'],
    description:
      'A deeply hydrating serum with multi-weight hyaluronic acid that plumps and locks in moisture for up to 72 hours.',
  },
  {
    id: 'barrier-repair-cream',
    name: 'Barrier Repair Cream',
    price: 29.95,
    skinTypes: ['dry', 'sensitive'],
    concerns: ['barrier repair', 'redness', 'dryness'],
    ingredients: ['ceramides', 'cholesterol', 'fatty acids'],
    description:
      'A rich, protective moisturizer that rebuilds the skin barrier with a lipid-identical formula. Soothes redness and prevents moisture loss.',
  },
  {
    id: 'daily-spf-50',
    name: 'Daily SPF 50',
    price: 27.95,
    skinTypes: ['normal', 'oily', 'combination', 'dry', 'sensitive'],
    concerns: ['sun protection', 'UV defense', 'anti-aging'],
    ingredients: ['zinc oxide', 'vitamin E', 'niacinamide'],
    description:
      'A lightweight, non-greasy broad-spectrum SPF 50 that blends invisibly and works under makeup. Essential daily protection.',
  },
  {
    id: 'glow-vitamin-c-serum',
    name: 'Glow Vitamin C Serum',
    price: 39.95,
    skinTypes: ['normal', 'oily', 'combination'],
    concerns: ['brightening', 'dark spots', 'dullness', 'anti-aging'],
    ingredients: ['vitamin C', 'ferulic acid', 'vitamin E'],
    description:
      'A potent 15% vitamin C serum that brightens skin tone, fades dark spots, and provides antioxidant protection against environmental damage.',
  },
  {
    id: 'acne-control-serum',
    name: 'Acne Control Serum',
    price: 32.95,
    skinTypes: ['oily', 'combination'],
    concerns: ['acne', 'breakouts', 'blemishes', 'congestion'],
    ingredients: ['salicylic acid', 'niacinamide', 'tea tree oil'],
    description:
      'A targeted treatment serum with 2% salicylic acid that unclogs pores, reduces inflammation, and prevents future breakouts.',
  },
  {
    id: 'night-recovery-mask',
    name: 'Night Recovery Mask',
    price: 36.95,
    skinTypes: ['dry', 'normal', 'sensitive'],
    concerns: ['overnight repair', 'hydration', 'anti-aging'],
    ingredients: ['retinal', 'squalane', 'peptides'],
    description:
      'An overnight sleeping mask with gentle retinal that repairs and renews skin while you sleep. Wake up to smoother, more radiant skin.',
  },
]

export const ECOMMERCE_TOPICS: TopicDefinition[] = [
  {
    key: 'products',
    content: `## Product Catalog

Our curated skincare collection features 8 products designed for every skin type:

- **Gentle Cleansing Foam** (EUR 24.95) — pH-balanced foam for dry/sensitive skin. Key: ceramides, glycerin.
- **Balancing Toner** (EUR 19.95) — Pore-minimizing toner for oily/combination skin. Key: niacinamide, witch hazel.
- **Hydra Boost Serum** (EUR 34.95) — Multi-weight hyaluronic acid serum for deep hydration. 72-hour moisture lock.
- **Barrier Repair Cream** (EUR 29.95) — Lipid-identical moisturizer for barrier restoration. Soothes redness.
- **Daily SPF 50** (EUR 27.95) — Lightweight broad-spectrum sunscreen. Non-greasy, works under makeup.
- **Glow Vitamin C Serum** (EUR 39.95) — 15% vitamin C for brightening and dark spot correction. Antioxidant protection.
- **Acne Control Serum** (EUR 32.95) — 2% salicylic acid for breakout control. Unclogs pores, reduces inflammation.
- **Night Recovery Mask** (EUR 36.95) — Overnight sleeping mask with gentle retinal. Repairs and renews while you sleep.

All products are cruelty-free, dermatologist-tested, and free from parabens and sulfates.`,
    keywords: [
      'products',
      'catalog',
      'what do you sell',
      'collection',
      'range',
      'cleanser',
      'toner',
      'serum',
      'cream',
      'SPF',
      'sunscreen',
      'mask',
    ],
    priority: 10,
  },
  {
    key: 'skin_types',
    content: `## Skin Type Guide

Understanding your skin type is the first step to an effective routine:

**Dry Skin**
- Signs: tightness, flaking, rough patches, visible fine lines
- Needs: rich hydration, gentle cleansers, ceramide-based moisturizers
- Avoid: harsh foaming cleansers, alcohol-based toners, over-exfoliation

**Oily Skin**
- Signs: shine by midday, enlarged pores, frequent breakouts
- Needs: BHA exfoliation, lightweight gel moisturizers, mattifying SPF
- Avoid: heavy creams, occlusive oils, skipping moisturizer

**Combination Skin**
- Signs: oily T-zone (forehead, nose, chin) with dry cheeks
- Needs: zone-specific approach, balancing products, lightweight hydration
- Avoid: one-size-fits-all heavy products

**Sensitive Skin**
- Signs: redness, stinging, reactivity to new products
- Needs: fragrance-free formulas, minimal ingredients, patch testing
- Avoid: essential oils, strong actives, frequent product switching

**Normal Skin**
- Signs: balanced moisture, few breakouts, even texture
- Needs: maintenance routine, prevention focus, antioxidant protection
- Avoid: over-treating — keep it simple`,
    keywords: [
      'skin type',
      'dry skin',
      'oily skin',
      'combination skin',
      'sensitive skin',
      'normal skin',
      'my skin',
      'skin concern',
    ],
    priority: 9,
  },
  {
    key: 'routines',
    content: `## Skincare Routine Guide

**Morning Routine (5 steps):**
1. **Cleanser** — Gentle wash to remove overnight buildup
2. **Toner** — Balance pH and prep skin for actives
3. **Serum** — Targeted treatment (vitamin C for morning antioxidant protection)
4. **Moisturizer** — Lock in hydration and create a protective barrier
5. **SPF** — Always the last step. Non-negotiable for skin health and anti-aging.

**Evening Routine (4 steps):**
1. **Cleanser** — Remove makeup, sunscreen, and daily grime (double cleanse if wearing heavy makeup)
2. **Toner** — Rebalance and hydrate
3. **Treatment** — Active ingredients work best overnight (retinal, AHA/BHA, targeted serums)
4. **Night Cream or Mask** — Rich moisturizer or sleeping mask for overnight repair

**Layering Rule:** Apply products from thinnest to thickest consistency. Serums before creams, water-based before oil-based.

**Key Tips:**
- Wait 1-2 minutes between active serums for proper absorption
- Introduce new actives one at a time, with 2 weeks between additions
- Morning = protect and prevent. Evening = treat and repair.`,
    keywords: [
      'routine',
      'morning routine',
      'evening routine',
      'night routine',
      'skincare steps',
      'order',
      'layering',
      'how to apply',
      'regimen',
    ],
    priority: 8,
  },
  {
    key: 'ingredients',
    content: `## Key Ingredient Glossary

**Hyaluronic Acid**
Humectant that holds up to 1000x its weight in water. Multi-weight forms penetrate different skin layers. Best for: all skin types needing hydration.

**Niacinamide (Vitamin B3)**
Multi-tasker that controls oil production, minimizes pores, brightens skin tone, and strengthens the barrier. Best for: oily, combination, and acne-prone skin.

**Salicylic Acid (BHA)**
Oil-soluble exfoliant that penetrates into pores to dissolve buildup. Anti-inflammatory. Best for: acne, blackheads, congested skin. Use 1-3x per week.

**Vitamin C (L-Ascorbic Acid)**
Potent antioxidant that brightens, fades hyperpigmentation, and boosts collagen. Best for: dull skin, dark spots, anti-aging. Use in morning for UV defense.

**Ceramides**
Lipids naturally found in the skin barrier. Topical ceramides repair and reinforce barrier function. Best for: dry, sensitive, or compromised skin.

**Retinal (Retinaldehyde)**
Gentle yet effective vitamin A derivative — one step from retinoic acid. Promotes cell turnover and collagen. Best for: anti-aging, texture improvement. Start 2-3x per week.

**Squalane**
Lightweight, non-comedogenic oil derived from olives. Mimics skin's natural sebum. Best for: all skin types, especially dry skin needing moisture without heaviness.`,
    keywords: [
      'ingredient',
      'hyaluronic acid',
      'niacinamide',
      'salicylic acid',
      'vitamin C',
      'ceramides',
      'retinal',
      'retinol',
      'squalane',
      'BHA',
      'active',
    ],
    priority: 7,
  },
]
