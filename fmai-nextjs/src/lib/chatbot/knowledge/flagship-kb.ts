import type { TopicDefinition } from '../types'
import { CONCIERGE_TOPICS } from './concierge-kb'
import { ECOMMERCE_TOPICS } from './ecommerce-kb'
import { LEADGEN_TOPICS } from './leadgen-kb'
import { SUPPORT_TOPICS } from './support-kb'

/**
 * Flagship knowledge base: merges the agency-relevant topic definitions.
 * The topic router filters by keyword relevance at query time, so including
 * all topics does not bloat the prompt -- only matched topics are injected.
 *
 * The legacy DEMO_GUIDE_TOPICS (the non-existent "Marketing Machine" with its
 * 7 modules, "300+ posts/month" and "3.2x ROAS") were removed: they fired on
 * generic prompts like "what modules" / "ROI benchmarks" and injected a product
 * that does not exist into Clyde's answers. Skills/pricing/ROI knowledge now
 * comes from the concierge + leadgen + support topics, aligned with the real
 * 12-skill model.
 */
export const FLAGSHIP_TOPICS: TopicDefinition[] = [
 ...CONCIERGE_TOPICS,
 ...ECOMMERCE_TOPICS,
 ...LEADGEN_TOPICS,
 ...SUPPORT_TOPICS,
]
