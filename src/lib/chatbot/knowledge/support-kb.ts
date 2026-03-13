import type { TopicDefinition } from '../types'

export const SUPPORT_TOPICS: TopicDefinition[] = [
  {
    key: 'billing',
    priority: 10,
    keywords: [
      'billing',
      'payment',
      'invoice',
      'refund',
      'upgrade',
      'downgrade',
      'cancel',
      'subscription',
      'charge',
      'credit card',
    ],
    content: `## Billing FAQ

**How to update payment method:**
Go to Settings > Billing > Payment Methods. Click "Update" next to your current method. Enter new card details and save.

**How to upgrade/downgrade plan:**
Go to Settings > Subscription > Change Plan. Select your new plan. Upgrades take effect immediately (prorated). Downgrades take effect at the end of the current billing period.

**Refund policy:**
We offer a 14-day money-back guarantee on all plans. Contact support within 14 days of your first payment for a full refund. After 14 days, refunds are handled on a case-by-case basis.

**Invoice access:**
Go to Settings > Billing > Invoices. All invoices are available for download as PDF. Invoices are generated on the 1st of each month.

**Cancellation process:**
Go to Settings > Subscription > Cancel. Your account remains active until the end of your current billing period. Data is retained for 30 days after cancellation. You can reactivate anytime within 30 days.`,
  },
  {
    key: 'technical',
    priority: 9,
    keywords: [
      'API',
      'rate limit',
      'webhook',
      'SSO',
      'SAML',
      'integration',
      'export',
      'data',
      'technical',
      'error',
      'bug',
    ],
    content: `## Technical FAQ

**API rate limits:**
- Starter: 1,000 requests/minute
- Professional: 5,000 requests/minute
- Enterprise: Unlimited (fair use policy)
Rate limit headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset

**Webhook setup:**
Go to Settings > Integrations > Webhooks. Click "Add Webhook". Enter your endpoint URL, select events to subscribe to, and save. Test with the "Send Test" button. Webhooks use HMAC-SHA256 for signature verification.

**SSO configuration:**
SSO is available on Enterprise plans only. We support SAML 2.0. Go to Settings > Security > SSO. Upload your IdP metadata XML or enter IdP URL, Entity ID, and certificate manually. Contact support for assistance with SSO setup.

**Data export:**
Go to Settings > Data > Export. Choose format: CSV or JSON. Select data types (contacts, campaigns, analytics). Exports are processed in the background — you will receive an email with a download link when ready. Large exports (>100K records) may take up to 1 hour.`,
  },
  {
    key: 'account',
    priority: 8,
    keywords: [
      'password',
      'reset',
      '2FA',
      'two-factor',
      'authentication',
      'team',
      'member',
      'invite',
      'role',
      'admin',
      'delete',
      'account',
    ],
    content: `## Account FAQ

**Password reset:**
Click "Forgot Password" on the login page. Enter your email address. Check your inbox for a reset link (valid for 1 hour). If you don't receive the email, check your spam folder or contact support.

**2FA setup:**
Go to Settings > Security > Enable 2FA. Scan the QR code with your authenticator app (Google Authenticator, Authy, 1Password, etc.). Enter the 6-digit code to confirm. Save your backup codes in a secure location — you will need them if you lose access to your authenticator.

**Team member management:**
Go to Settings > Team > Invite. Enter the email address and select a role:
- Admin: Full access including billing and settings
- Editor: Can create and edit campaigns, contacts, and content
- Viewer: Read-only access to dashboards and reports
Team members receive an email invitation and must create an account to join.

**Account deletion:**
Contact support to request account deletion. We will confirm your identity before proceeding. Data is retained for 30 days after deletion (recovery window). After 30 days, all data is permanently deleted.`,
  },
  {
    key: 'getting_started',
    priority: 7,
    keywords: [
      'getting started',
      'setup',
      'onboarding',
      'first',
      'quickstart',
      'guide',
      'tutorial',
      'how to',
      'begin',
      'new',
    ],
    content: `## Getting Started FAQ

**First-time setup checklist:**
1. Connect your email provider (Settings > Integrations > Email)
2. Import your contacts (Contacts > Import > CSV or CRM sync)
3. Create your first campaign (Campaigns > New Campaign)
4. Set up tracking (Settings > Tracking > Install pixel)
5. Send a test campaign to yourself before going live

**Quickstart guide — 5 steps to your first campaign:**
1. Choose a campaign type (email, landing page, workflow)
2. Select a template or start from scratch
3. Customize your content with the drag-and-drop editor
4. Set your audience (all contacts, segment, or list)
5. Schedule or send immediately

**Integration setup:**
One-click setup available for: Salesforce, HubSpot, Slack, Google Analytics. Go to Settings > Integrations > Browse. Click "Connect" next to your platform. Follow the OAuth flow to authorize. Most integrations sync data within 5 minutes.`,
  },
]

export interface KBArticle {
  id: string
  title: string
  category: string
  content: string
  tags: string[]
}

export const KB_ARTICLES: KBArticle[] = [
  // Billing articles
  {
    id: 'billing-001',
    title: 'How to update your payment method',
    category: 'billing',
    content:
      'Navigate to Settings > Billing > Payment Methods. Click the "Update" button next to your current payment method. Enter your new credit card or bank details and click Save. Changes take effect immediately for your next billing cycle.',
    tags: ['payment', 'credit card', 'update', 'billing'],
  },
  {
    id: 'billing-002',
    title: 'How to upgrade or downgrade your plan',
    category: 'billing',
    content:
      'Go to Settings > Subscription > Change Plan. Select the plan you want to switch to. Upgrades are applied immediately with prorated charges. Downgrades take effect at the end of your current billing period. No data is lost when changing plans.',
    tags: ['upgrade', 'downgrade', 'plan', 'subscription'],
  },
  {
    id: 'billing-003',
    title: 'Refund policy and money-back guarantee',
    category: 'billing',
    content:
      'We offer a 14-day money-back guarantee on all plans. If you are not satisfied within the first 14 days, contact support for a full refund. After 14 days, refunds are handled on a case-by-case basis. Annual plan refunds are prorated based on months used.',
    tags: ['refund', 'money-back', 'guarantee', 'cancel'],
  },
  {
    id: 'billing-004',
    title: 'How to access and download invoices',
    category: 'billing',
    content:
      'All invoices are available at Settings > Billing > Invoices. Each invoice can be downloaded as a PDF. Invoices are generated on the 1st of each month. You can also set up automatic invoice forwarding to your accounting email.',
    tags: ['invoice', 'download', 'PDF', 'receipt'],
  },
  // Technical articles
  {
    id: 'tech-001',
    title: 'API rate limits by plan',
    category: 'technical',
    content:
      'API rate limits vary by plan: Starter allows 1,000 requests per minute, Professional allows 5,000 requests per minute, and Enterprise has unlimited requests under a fair use policy. Rate limit information is included in response headers: X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset.',
    tags: ['API', 'rate limit', 'requests', 'throttling'],
  },
  {
    id: 'tech-002',
    title: 'Setting up webhooks for event notifications',
    category: 'technical',
    content:
      'Go to Settings > Integrations > Webhooks and click "Add Webhook". Enter your endpoint URL and select the events you want to subscribe to (e.g., contact.created, campaign.sent, form.submitted). All webhook payloads are signed with HMAC-SHA256. Use the "Send Test" button to verify your endpoint.',
    tags: ['webhook', 'events', 'notifications', 'integration'],
  },
  {
    id: 'tech-003',
    title: 'Configuring SSO with SAML 2.0',
    category: 'technical',
    content:
      'SSO is available on Enterprise plans. Navigate to Settings > Security > SSO. You can either upload your Identity Provider metadata XML file or manually enter the IdP URL, Entity ID, and X.509 certificate. Supported IdPs include Okta, Azure AD, Google Workspace, and OneLogin. Contact support for assistance.',
    tags: ['SSO', 'SAML', 'authentication', 'enterprise', 'security'],
  },
  {
    id: 'tech-004',
    title: 'Exporting your data (CSV and JSON)',
    category: 'technical',
    content:
      'Go to Settings > Data > Export. Select the data type you want to export: contacts, campaigns, analytics, or all. Choose your format (CSV or JSON). Large exports (over 100,000 records) are processed in the background and you will receive an email with a download link. Export files are available for 7 days.',
    tags: ['export', 'data', 'CSV', 'JSON', 'download'],
  },
  // Account articles
  {
    id: 'account-001',
    title: 'How to reset your password',
    category: 'account',
    content:
      'Click "Forgot Password" on the login page and enter your email address. You will receive a password reset link valid for 1 hour. Click the link, enter your new password (minimum 8 characters, must include uppercase, lowercase, and a number). If you do not receive the email, check your spam folder.',
    tags: ['password', 'reset', 'login', 'forgot'],
  },
  {
    id: 'account-002',
    title: 'Setting up two-factor authentication (2FA)',
    category: 'account',
    content:
      'Go to Settings > Security > Enable 2FA. Scan the QR code with your authenticator app (we support Google Authenticator, Authy, 1Password, and any TOTP-compatible app). Enter the 6-digit verification code to confirm setup. Save your backup codes securely — you will need them if you lose access to your authenticator device.',
    tags: ['2FA', 'two-factor', 'security', 'authenticator'],
  },
  {
    id: 'account-003',
    title: 'Managing team members and roles',
    category: 'account',
    content:
      'Go to Settings > Team > Invite to add new team members. Enter their email and assign a role: Admin (full access including billing), Editor (create and edit content), or Viewer (read-only dashboards). Team members receive an email invitation. You can change roles or remove members at any time from the Team settings page.',
    tags: ['team', 'invite', 'roles', 'admin', 'editor', 'viewer'],
  },
  {
    id: 'account-004',
    title: 'How to delete your account',
    category: 'account',
    content:
      'To delete your account, contact our support team. We will verify your identity before processing the request. After deletion, your data is retained for 30 days in case you change your mind. After 30 days, all data including contacts, campaigns, and analytics is permanently and irreversibly deleted.',
    tags: ['delete', 'account', 'close', 'data retention'],
  },
  // Getting started articles
  {
    id: 'start-001',
    title: 'First-time setup checklist',
    category: 'getting_started',
    content:
      'Welcome! Follow these 5 steps to get started: 1) Connect your email provider at Settings > Integrations > Email. 2) Import your contacts via Contacts > Import (CSV upload or CRM sync). 3) Create your first campaign at Campaigns > New Campaign. 4) Install the tracking pixel at Settings > Tracking. 5) Send a test campaign to yourself before going live.',
    tags: ['setup', 'checklist', 'onboarding', 'first steps'],
  },
  {
    id: 'start-002',
    title: 'Quickstart: Create your first campaign in 5 minutes',
    category: 'getting_started',
    content:
      'Creating a campaign is easy: 1) Go to Campaigns > New Campaign. 2) Choose a campaign type (email blast, drip sequence, or landing page). 3) Pick a template or start from scratch using the drag-and-drop editor. 4) Select your audience — all contacts, a specific segment, or a custom list. 5) Preview, test, and send or schedule your campaign.',
    tags: ['quickstart', 'campaign', 'tutorial', 'first campaign'],
  },
  {
    id: 'start-003',
    title: 'Connecting your favorite tools (one-click integrations)',
    category: 'getting_started',
    content:
      'We offer one-click integrations with popular tools: Salesforce, HubSpot, Slack, Google Analytics, and more. Go to Settings > Integrations > Browse to see all available integrations. Click "Connect" and follow the OAuth authorization flow. Most integrations begin syncing data within 5 minutes of setup.',
    tags: ['integrations', 'connect', 'Salesforce', 'HubSpot', 'Slack'],
  },
  {
    id: 'start-004',
    title: 'Understanding the analytics dashboard',
    category: 'getting_started',
    content:
      'Your analytics dashboard shows real-time data on campaign performance, contact engagement, and revenue attribution. Key metrics include: open rate, click rate, conversion rate, and ROI. Use the date picker to filter by time period. Click on any metric to drill down into detailed reports. Export reports as CSV or PDF.',
    tags: ['analytics', 'dashboard', 'reports', 'metrics'],
  },
  {
    id: 'start-005',
    title: 'Importing contacts from a CSV file',
    category: 'getting_started',
    content:
      'Go to Contacts > Import > CSV Upload. Download our CSV template for the correct format. Required fields: email address. Optional fields: first name, last name, company, phone, custom fields. Upload your file and map columns to contact fields. Duplicates are detected by email address and can be skipped or updated.',
    tags: ['import', 'contacts', 'CSV', 'upload'],
  },
]
