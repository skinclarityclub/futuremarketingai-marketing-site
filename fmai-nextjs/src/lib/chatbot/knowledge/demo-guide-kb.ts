import type { TopicDefinition } from '../types'

export const MODULE_INFO: Record<
 string,
 { name: string; description: string; features: string[]; icon: string }
> = {
 'research-planning': {
 name: 'Research & Planning',
 description:
 'AI-powered market intelligence that runs 24/7. Competitor monitoring, trend forecasting, and automated research reports so you always know what is happening in your market.',
 features: [
 'Continuous competitor monitoring and benchmarking',
 'AI trend forecasting and opportunity detection',
 'Automated market intelligence reports',
 'Real-time content ideation based on market data',
 'Industry-specific insights and best practices',
 ],
 icon: 'brain',
 },
 'manager-workflow': {
 name: 'Manager Workflow',
 description:
 'Intelligent campaign orchestration engine that coordinates all your marketing activities. Task distribution, A/B testing strategies, and resource allocation across every channel.',
 features: [
 'Full workflow orchestration across all platforms',
 'Intelligent A/B testing strategies',
 'Campaign prioritization and resource allocation',
 'Cross-platform campaign coordination',
 'Automated task distribution to execution pipelines',
 ],
 icon: 'crown',
 },
 'content-pipeline': {
 name: 'Content Pipeline',
 description:
 'AI content factory producing 300+ platform-optimized posts per month. Blog articles, social media, newsletters, carousels, and video scripts, all in your brand voice.',
 features: [
 '300+ platform-optimized posts per month',
 'Absolute brand consistency across all assets',
 'Multiple A/B test variants per piece',
 'Self-learning optimization based on performance',
 'Multi-platform: Instagram, TikTok, LinkedIn, YouTube, Facebook, Pinterest, Blogs',
 'Performance-driven templates that improve continuously',
 ],
 icon: 'pen-tool',
 },
 'telegram-control': {
 name: 'Telegram Control',
 description:
 'Mobile command center for your Marketing Machine. Approve content, check analytics, trigger campaigns, and manage your entire marketing operation from your phone via Telegram.',
 features: [
 'Approve or reject content on the go',
 'Real-time analytics notifications',
 'Campaign trigger and pause controls',
 'Quick-reply content feedback',
 'Daily digest summaries',
 ],
 icon: 'smartphone',
 },
 'publishing-layer': {
 name: 'Publishing Layer',
 description:
 'Smart multi-platform publishing with scientifically optimized timing. Posts your content at the exact right moment for maximum engagement across 7+ platforms.',
 features: [
 'Scientifically optimized posting times (35% better engagement)',
 'Intelligent audience segmentation and targeting',
 'Seamless cross-platform campaign coordination',
 'Automatic platform API handling (7+ platforms)',
 '99.8% publishing success rate. Enterprise reliability',
 ],
 icon: 'send',
 },
 'analytics-lab': {
 name: 'Analytics Lab',
 description:
 'Self-learning analytics engine that tracks performance, identifies winning patterns, and continuously improves your marketing. Compounding 23% month-over-month improvement.',
 features: [
 'Real-time performance tracking across all platforms',
 'AI pattern recognition for winning content',
 'Predictive analytics for future campaign performance',
 '23% monthly performance improvement (compound)',
 'Automated insights and actionable recommendations',
 ],
 icon: 'bar-chart',
 },
 'ad-builder': {
 name: 'Ad Builder',
 description:
 'Automated paid campaign engine that converts your best organic content into high-performing ads. AI-powered budget optimization delivering 3.2x better ROAS.',
 features: [
 'Automatic conversion of winning organic posts to paid ads',
 'AI-powered budget optimization',
 'Multi-platform ad management (Meta, Google, LinkedIn)',
 'Real-time ROI tracking and optimization',
 '3.2x better ROAS than manual campaigns',
 ],
 icon: 'dollar-sign',
 },
}

export const DEMO_GUIDE_TOPICS: TopicDefinition[] = [
 {
 key: 'modules_overview',
 content: `## Marketing Machine Modules Overview\n\nThe FutureMarketingAI Marketing Machine consists of 7 integrated modules that work together as one autonomous marketing system:\n\n**Research & Planning**. AI-powered 24/7 market intelligence: competitor monitoring, trend forecasting, and automated research reports.\n\n**Manager Workflow**. Intelligent campaign orchestration: task distribution, A/B testing strategies, and resource allocation across every channel.\n\n**Content Pipeline**. AI content factory producing 300+ platform-optimized posts per month in your brand voice across all formats.\n\n**Telegram Control**. Mobile command center: approve content, check analytics, and manage campaigns from your phone.\n\n**Publishing Layer**. Smart multi-platform publishing with scientifically optimized timing for maximum engagement.\n\n**Analytics Lab**. Self-learning analytics that tracks performance, identifies patterns, and compounds 23% improvement month-over-month.\n\n**Ad Builder**. Automated paid campaigns that convert winning organic content into high-performing ads with 3.2x better ROAS.`,
 keywords: [
 'modules',
 'overview',
 'marketing machine',
 'what does it include',
 'features',
 'capabilities',
 'components',
 'parts',
 'system',
 'how many modules',
 ],
 priority: 10,
 },
 {
 key: 'demo_flow',
 content: `## Demo Walkthrough\n\nThe Marketing Machine demo has three interactive sections:\n\n**Explorer**. Interactive overview of all 7 modules. See capabilities live, explore how each module works, and understand how they connect. Best starting point for first-time visitors.\n\n**Calculator**. ROI calculator where you input your team size and current marketing costs to see projected savings. Personalized numbers based on your business.\n\n**Dashboard**. Live analytics mockup showing what daily operations look like. See how the system tracks performance, identifies winning content, and optimizes automatically.\n\n**Recommended order:** Explorer (understand the system) then Calculator (see your ROI) then Dashboard (see daily operations). This flow builds understanding before showing value, then makes it tangible.`,
 keywords: [
 'demo',
 'tour',
 'walkthrough',
 'explore',
 'show me',
 'how does the demo work',
 'where do I start',
 'explorer',
 'calculator',
 'dashboard',
 'rondleiding',
 ],
 priority: 9,
 },
 {
 key: 'roi_data',
 content: `## ROI Benchmarks\n\nMarketing Machine ROI benchmarks based on typical B2B deployments:\n\n- **Time saved:** Average 40 hours per week saved on content creation and marketing operations\n- **Cost reduction:** 60% reduction in marketing tool costs by consolidating into one system\n- **Content output:** 3x more content output with the same team (or more with full automation)\n- **Implementation:** 2-week setup sprint. Live within 14 days\n- **Monthly value:** EUR 5,997 to 15,000 in labor savings depending on team size\n- **Annual impact:** EUR 60,000 to 180,000+ in total savings per year\n\nROI calculation formula: (hours saved x hourly rate) + (tool cost savings) = monthly ROI. Most businesses see positive ROI within the first month.`,
 keywords: [
 'ROI',
 'savings',
 'cost',
 'save',
 'return on investment',
 'how much can I save',
 'worth it',
 'value',
 'besparen',
 'kosten',
 'money',
 'budget',
 ],
 priority: 8,
 },
 {
 key: 'module_details',
 content: `## Module Deep Dives\n\n**Research & Planning**. Uses AI to scan 100+ data sources continuously. Delivers competitor benchmarks, trend forecasts, and content ideas based on real market data. Replaces a full-time research analyst plus enterprise tools.\n\n**Manager Workflow**. The brain of the system. Reads planned content, generates A/B variants, assigns to the right pipelines, monitors execution, and optimizes in real-time. Eliminates the need for 3 marketing coordinators.\n\n**Content Pipeline**. Enterprise-grade content factory. Creates blog posts, social captions, carousels, video scripts, and newsletters. Maintains brand consistency across 300+ monthly assets. Self-learning: gets better with every piece of feedback.\n\n**Telegram Control**. Your marketing on your phone. Approve content with a tap, get real-time notifications on campaign performance, trigger or pause campaigns instantly. Daily digest keeps you informed without email overload.\n\n**Publishing Layer**. Scientific timing optimization delivers 35% better engagement. Handles all platform APIs automatically. 99.8% success rate. Coordinates cross-platform campaigns so your message is consistent everywhere.\n\n**Analytics Lab**. Tracks everything, learns from everything. Pattern recognition identifies what works and why. Predictive models forecast performance before you publish. Compounds at 23% improvement per month.\n\n**Ad Builder**. Finds your best organic content and turns it into ads automatically. AI optimizes budgets across Meta, Google, and LinkedIn. 3.2x better ROAS than manual campaign management. Scales winners automatically.`,
 keywords: [
 'detail',
 'deep dive',
 'explain',
 'how does',
 'tell me more',
 'what does',
 'specific',
 'research',
 'manager',
 'content',
 'telegram',
 'publishing',
 'analytics',
 'ad builder',
 ],
 priority: 7,
 },
 {
 key: 'getting_started',
 content: `## Getting Started with Marketing Machine\n\nGetting started is straightforward:\n\n1. **Book a demo**: 45-minute session where we walk through the system and discuss your specific needs\n2. **Receive custom strategy**. We analyze your current marketing and design a tailored implementation plan\n3. **2-week setup sprint**. We configure the system, integrate your platforms, and train the AI on your brand\n4. **Live within 14 days**. Your Marketing Machine is operational and producing results\n\nNo long-term contracts. Monthly billing. Cancel anytime with 30-day notice. We are confident enough in the ROI that we do not need to lock you in.\n\nReady to see it in action? Book a demo and we will show you exactly how it works for your business.`,
 keywords: [
 'get started',
 'start',
 'begin',
 'sign up',
 'onboarding',
 'how to start',
 'next steps',
 'book',
 'demo',
 'contract',
 'billing',
 'cancel',
 'aanmelden',
 'beginnen',
 ],
 priority: 6,
 },
]
