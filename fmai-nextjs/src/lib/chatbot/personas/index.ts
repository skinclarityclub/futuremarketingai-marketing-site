// Side-effect imports: trigger registerPersona() in each persona file
import './concierge'
import './ecommerce'
import './leadgen'
import './support'
import './demo-guide'
import './flagship'

// Re-export persona configs and starters for convenience
export { conciergePersona, CONCIERGE_STARTERS } from './concierge'
export { ecommercePersona, ECOMMERCE_STARTERS } from './ecommerce'
export { leadgenPersona, LEADGEN_STARTERS } from './leadgen'
export { supportPersona, SUPPORT_STARTERS } from './support'
export { demoGuidePersona, DEMO_GUIDE_STARTERS } from './demo-guide'
export { flagshipPersona, FLAGSHIP_STARTERS } from './flagship'
