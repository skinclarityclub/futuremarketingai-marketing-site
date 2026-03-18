import type { TopicDefinition } from '../types'
import { CONCIERGE_TOPICS } from './concierge-kb'
import { ECOMMERCE_TOPICS } from './ecommerce-kb'
import { LEADGEN_TOPICS } from './leadgen-kb'
import { SUPPORT_TOPICS } from './support-kb'
import { DEMO_GUIDE_TOPICS } from './demo-guide-kb'

/**
 * Flagship knowledge base: merges all topic definitions from all 5 personas.
 * The topic router filters by keyword relevance at query time, so including
 * all topics does not bloat the prompt -- only matched topics are injected.
 */
export const FLAGSHIP_TOPICS: TopicDefinition[] = [
  ...CONCIERGE_TOPICS,
  ...ECOMMERCE_TOPICS,
  ...LEADGEN_TOPICS,
  ...SUPPORT_TOPICS,
  ...DEMO_GUIDE_TOPICS,
]
