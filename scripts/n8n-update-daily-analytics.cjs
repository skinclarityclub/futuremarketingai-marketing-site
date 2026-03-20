#!/usr/bin/env node
/**
 * Update Daily Analytics Collector V1.0 for multi-client operation
 * Adds: Fetch Active Clients -> Loop Clients -> Load Client IG Token -> Skip If No Token
 * Modifies: IG API nodes to use dynamic token, Telegram to use per-client config
 * Scopes: Supabase queries to client_id
 */

const https = require('https');

const API_URL = 'https://skinclarityclub.app.n8n.cloud';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3OTFhOGMwYy04MjQ5LTQzMjItYjM4Ny02MGVkZmE2NzA5NDciLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZDBlNGIyMGQtYjM0MC00NGRmLWFmODMtZWFlZjA0NTUwNjQ5IiwiaWF0IjoxNzcwODgzMDEwfQ.MFUA5Ot0TvCJvSiASmcUnilrjhhiE3fThox4vZoUl48';
const WORKFLOW_ID = 'tIwqBmpgzNGZnVKT';

const SUPABASE_URL = 'https://nurdldgqxseunotmygzn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51cmRsZGdxeHNldW5vdG15Z3puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxNTQzNDksImV4cCI6MjA1MTczMDM0OX0.wr5YpHe-9HxNfWBkuQl6a3L0VJKp1YZSM6QkSdx-qhY';

// SKC fallback values for backward compatibility
const SKC_TELEGRAM_BOT = '7394622882:AAF5ZYZgj9yMPh1LiFBBxxIrs7-GoGvT_sw';
const SKC_TELEGRAM_CHAT = '6475835412';

function apiRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'X-N8N-API-KEY': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const data = Buffer.concat(chunks).toString();
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, data: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  console.log('Fetching current workflow...');
  const { status, data: wf } = await apiRequest('GET', `/api/v1/workflows/${WORKFLOW_ID}`);
  if (status !== 200) { console.error('Failed to fetch:', status); process.exit(1); }

  console.log(`Workflow: "${wf.name}" — ${wf.nodes.length} nodes`);

  // ============================================================
  // NEW NODES
  // ============================================================

  // Node: Fetch Active Clients (placed before existing Get Posts node)
  const fetchActiveClients = {
    id: 'mc-fetch-clients',
    name: 'Fetch Active Clients',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [460, 300],
    parameters: {
      method: 'GET',
      url: `${SUPABASE_URL}/rest/v1/clients`,
      sendQuery: true,
      queryParameters: {
        parameters: [
          { name: 'is_active', value: 'eq.true' },
          { name: 'select', value: 'id,name' }
        ]
      },
      sendHeaders: true,
      headerParameters: {
        parameters: [
          { name: 'apikey', value: SUPABASE_ANON_KEY },
          { name: 'Authorization', value: `Bearer ${SUPABASE_ANON_KEY}` },
          { name: 'Content-Type', value: 'application/json' }
        ]
      },
      options: { response: { response: { responseFormat: 'json' } } }
    }
  };

  // Node: Loop Clients (SplitInBatches, batch size 1)
  const loopClients = {
    id: 'mc-loop-clients',
    name: 'Loop Clients',
    type: 'n8n-nodes-base.splitInBatches',
    typeVersion: 3,
    position: [700, 300],
    parameters: {
      batchSize: 1,
      options: {}
    }
  };

  // Node: Set Client Context (extract client_id and name from loop item)
  const setClientContext = {
    id: 'mc-set-client',
    name: 'Set Client Context',
    type: 'n8n-nodes-base.set',
    typeVersion: 3.4,
    position: [940, 380],
    parameters: {
      mode: 'manual',
      duplicateItem: false,
      assignments: {
        assignments: [
          {
            id: 'client_id',
            name: 'client_id',
            value: '={{ $json.id }}',
            type: 'string'
          },
          {
            id: 'client_name',
            name: 'client_name',
            value: '={{ $json.name }}',
            type: 'string'
          }
        ]
      },
      options: {}
    }
  };

  // Node: Load Client IG Token
  const loadIGToken = {
    id: 'mc-load-ig-token',
    name: 'Load Client IG Token',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [1180, 380],
    parameters: {
      method: 'GET',
      url: `${SUPABASE_URL}/rest/v1/client_config`,
      sendQuery: true,
      queryParameters: {
        parameters: [
          { name: 'client_id', value: '={{ $json.client_id }}' },
          { name: 'config_key', value: 'eq.instagram_access_token' },
          { name: 'select', value: 'config_value' }
        ]
      },
      sendHeaders: true,
      headerParameters: {
        parameters: [
          { name: 'apikey', value: SUPABASE_ANON_KEY },
          { name: 'Authorization', value: `Bearer ${SUPABASE_ANON_KEY}` },
          { name: 'Content-Type', value: 'application/json' }
        ]
      },
      options: { response: { response: { responseFormat: 'json' } } }
    }
  };

  // Node: Skip If No Token (IF node)
  const skipIfNoToken = {
    id: 'mc-skip-no-token',
    name: 'Skip If No Token',
    type: 'n8n-nodes-base.if',
    typeVersion: 2,
    position: [1420, 380],
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' },
        conditions: [
          {
            id: 'has-token',
            leftValue: '={{ $json.length }}',
            rightValue: 0,
            operator: { type: 'number', operation: 'gt' }
          }
        ],
        combinator: 'and'
      },
      options: {}
    }
  };

  // Node: Load Notification Config (per-client Telegram config)
  const loadNotifConfig = {
    id: 'mc-load-notif',
    name: 'Load Notification Config',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [2620, 500],
    parameters: {
      method: 'GET',
      url: `${SUPABASE_URL}/rest/v1/client_config`,
      sendQuery: true,
      queryParameters: {
        parameters: [
          { name: 'client_id', value: '={{ $json.client_id || $("Set Client Context").first().json.client_id }}' },
          { name: 'config_key', value: 'in.(telegram_bot_token,telegram_chat_id)' },
          { name: 'select', value: 'config_key,config_value' }
        ]
      },
      sendHeaders: true,
      headerParameters: {
        parameters: [
          { name: 'apikey', value: SUPABASE_ANON_KEY },
          { name: 'Authorization', value: `Bearer ${SUPABASE_ANON_KEY}` },
          { name: 'Content-Type', value: 'application/json' }
        ]
      },
      options: { response: { response: { responseFormat: 'json' } } }
    }
  };

  // ============================================================
  // MODIFY EXISTING NODES
  // ============================================================

  // Shift all existing nodes right to make room for multi-client loop
  const SHIFT_X = 480;
  const nodesByName = {};
  for (const n of wf.nodes) {
    nodesByName[n.name] = n;
  }

  // Move nodes that come after the trigger
  const nodesToShift = [
    'Get Posts With ig_post_id', 'Get Existing Snapshots',
    'Determine Due Snapshots', 'Any Snapshots Due?',
    'Process Each Snapshot', 'Get Post Insights', 'Get Media Fields',
    'Calculate Metrics', 'Upsert Snapshot', 'Merge Loop',
    'Build Briefing', 'Send Telegram Briefing'
  ];
  for (const name of nodesToShift) {
    if (nodesByName[name]) {
      nodesByName[name].position[0] += SHIFT_X;
    }
  }

  // 1. Modify "Get Posts With ig_post_id" — scope to client_id
  // Change from Supabase node to HTTP Request to add client_id filter
  const getPostsNode = nodesByName['Get Posts With ig_post_id'];
  // Replace Supabase node with HTTP Request for better query control
  getPostsNode.type = 'n8n-nodes-base.httpRequest';
  getPostsNode.typeVersion = 4.2;
  getPostsNode.parameters = {
    method: 'GET',
    url: `${SUPABASE_URL}/rest/v1/content_items`,
    sendQuery: true,
    queryParameters: {
      parameters: [
        { name: 'publish_status', value: 'eq.posted' },
        { name: 'ig_post_id', value: 'not.is.null' },
        { name: 'client_id', value: '={{ "eq." + $("Set Client Context").first().json.client_id }}' },
        { name: 'select', value: 'id,ig_post_id,ig_permalink,posted_at,account_key,hook_type,pillar_key,brand,day_of_week,funnel_stage' }
      ]
    },
    sendHeaders: true,
    headerParameters: {
      parameters: [
        { name: 'apikey', value: SUPABASE_ANON_KEY },
        { name: 'Authorization', value: `Bearer ${SUPABASE_ANON_KEY}` },
        { name: 'Content-Type', value: 'application/json' }
      ]
    },
    options: { response: { response: { responseFormat: 'json' } } }
  };

  // 2. Modify "Get Existing Snapshots" — scope to client content
  const getSnapshotsNode = nodesByName['Get Existing Snapshots'];
  // Add client_id filter to snapshot query (join through content_items)
  // Since snapshots reference ig_post_id, we keep the query but note scoping happens via content_items filter
  // No change needed for snapshots table directly — it's already filtered by ig_post_id from scoped content_items

  // 3. Modify "Get Post Insights" — use dynamic IG token
  const getInsightsNode = nodesByName['Get Post Insights'];
  getInsightsNode.parameters.queryParameters.parameters = [
    { name: 'metric', value: 'views,reach,saved,shares' },
    { name: 'access_token', value: '={{ $("Load Client IG Token").first().json[0]?.config_value || $("Load Client IG Token").first().json.config_value || "" }}' }
  ];

  // 4. Modify "Get Media Fields" — use dynamic IG token
  const getMediaNode = nodesByName['Get Media Fields'];
  getMediaNode.parameters.queryParameters.parameters = [
    { name: 'fields', value: 'like_count,comments_count' },
    { name: 'access_token', value: '={{ $("Load Client IG Token").first().json[0]?.config_value || $("Load Client IG Token").first().json.config_value || "" }}' }
  ];

  // 5. Modify "Upsert Snapshot" — add client_id to snapshot data
  const upsertNode = nodesByName['Upsert Snapshot'];
  upsertNode.parameters.jsonBody = `={{ JSON.stringify({
  ig_post_id: $json.ig_post_id,
  snapshot_type: $json.snapshot_type,
  content_schedule_id: $json.content_schedule_id,
  account_key: $json.account_key,
  client_id: $("Set Client Context").first().json.client_id,
  views: $json.views,
  reach: $json.reach,
  saved: $json.saved,
  shares: $json.shares,
  likes: $json.likes,
  comments: $json.comments,
  save_rate: $json.save_rate,
  share_rate: $json.share_rate,
  engagement_rate: $json.engagement_rate,
  hook_type: $json.hook_type,
  pillar_key: $json.pillar_key,
  brand: $json.brand,
  day_of_week: $json.day_of_week,
  funnel_stage: $json.funnel_stage,
  captured_at: $json.captured_at
}) }}`;

  // 6. Modify "Build Briefing" — include client name in message
  const buildBriefingNode = nodesByName['Build Briefing'];
  buildBriefingNode.parameters.jsCode = `const items = $input.all();
const clientName = $('Set Client Context').first().json.client_name || 'Unknown';
const clientId = $('Set Client Context').first().json.client_id || 'unknown';

// 0-snapshots pad: no_snapshots_due dummy item
const noSnapshotItem = items.find(i => i.json.no_snapshots_due === true);
if (noSnapshotItem) {
  const postsTotal = noSnapshotItem.json.posts_total || 0;
  const msg = [
    '<b>Analytics Collector</b> | ' + clientName + ' | ' + new Date().toLocaleDateString('nl-NL'),
    '',
    'Snapshots gecollect: 0',
    'Tracked posts totaal: ' + postsTotal,
    '',
    'Geen posts op 24h/48h/7d grens vandaag.'
  ].join('\\n');
  return [{ json: { telegram_message: msg, snapshots_collected: 0, posts_total: postsTotal, client_id: clientId, client_name: clientName } }];
}

// Snapshots waren aanwezig
const snapshotItems = items.filter(i => i.json.ig_post_id);
const total = snapshotItems.length;
const postsTotal = snapshotItems[0]?.json?._posts_total || 0;

// Top post op basis van engagement_rate
const withMetrics = snapshotItems
  .filter(i => (parseFloat(i.json.engagement_rate) || 0) > 0)
  .sort((a, b) => (parseFloat(b.json.engagement_rate) || 0) - (parseFloat(a.json.engagement_rate) || 0));
const topPost = withMetrics[0]?.json;

const topPostLine = topPost
  ? 'Top: ' + (topPost.hook_type || '-') + ' (' + (topPost.account_key || '-') + ') | ER: ' + ((topPost.engagement_rate || 0) * 100).toFixed(2) + '% | Views: ' + (topPost.views || 0)
  : 'Geen engagement data beschikbaar';

// Groepeer per snapshot_type voor overzicht
const byType = {};
for (const item of snapshotItems) {
  const t = item.json.snapshot_type || 'unknown';
  byType[t] = (byType[t] || 0) + 1;
}
const typeLines = Object.entries(byType).map(([t, c]) => '  ' + t + ': ' + c + ' posts').join('\\n');

const msg = [
  '<b>Analytics Collector</b> | ' + clientName + ' | ' + new Date().toLocaleDateString('nl-NL'),
  '',
  'Snapshots gecollect: ' + total,
  typeLines,
  '',
  topPostLine,
  '',
  'Tracked posts totaal: ' + postsTotal
].join('\\n');

return [{ json: { telegram_message: msg, snapshots_collected: total, posts_total: postsTotal, client_id: clientId, client_name: clientName } }];`;

  // 7. Modify "Send Telegram Briefing" — use per-client notification config with SKC fallback
  const sendTelegramNode = nodesByName['Send Telegram Briefing'];
  sendTelegramNode.name = 'Send Client Telegram Briefing';
  sendTelegramNode.parameters = {
    method: 'POST',
    url: `={{ (function() {
  const notifData = $("Load Notification Config").first().json;
  let items = Array.isArray(notifData) ? notifData : [notifData];
  const botTokenItem = items.find(i => i.config_key === 'telegram_bot_token');
  let raw = botTokenItem ? botTokenItem.config_value : null;
  if (typeof raw === 'string') { try { raw = JSON.parse(raw); } catch(e) {} }
  const token = raw || '${SKC_TELEGRAM_BOT}';
  return 'https://api.telegram.org/bot' + token + '/sendMessage';
})() }}`,
    sendBody: true,
    specifyBody: 'json',
    jsonBody: `={{ (function() {
  const notifData = $("Load Notification Config").first().json;
  let items = Array.isArray(notifData) ? notifData : [notifData];
  const chatIdItem = items.find(i => i.config_key === 'telegram_chat_id');
  let raw = chatIdItem ? chatIdItem.config_value : null;
  if (typeof raw === 'string') { try { raw = JSON.parse(raw); } catch(e) {} }
  const chatId = raw || '${SKC_TELEGRAM_CHAT}';
  return JSON.stringify({ chat_id: chatId, parse_mode: 'HTML', text: $json.telegram_message });
})() }}`,
    options: { response: { response: { neverError: true } } }
  };

  // ============================================================
  // BUILD NEW NODE LIST
  // ============================================================

  // Remove old nodes and add new ones
  const newNodes = [
    nodesByName['Daily 07:00 Trigger'],
    fetchActiveClients,
    loopClients,
    setClientContext,
    loadIGToken,
    skipIfNoToken,
    getPostsNode,
    getSnapshotsNode,
    nodesByName['Determine Due Snapshots'],
    nodesByName['Any Snapshots Due?'],
    nodesByName['Process Each Snapshot'],
    getInsightsNode,
    getMediaNode,
    nodesByName['Calculate Metrics'],
    upsertNode,
    nodesByName['Merge Loop'],
    buildBriefingNode,
    loadNotifConfig,
    sendTelegramNode
  ];

  // ============================================================
  // BUILD NEW CONNECTIONS
  // ============================================================

  const newConnections = {
    // Trigger -> Fetch Active Clients
    'Daily 07:00 Trigger': {
      main: [[{ node: 'Fetch Active Clients', type: 'main', index: 0 }]]
    },
    // Fetch Active Clients -> Loop Clients
    'Fetch Active Clients': {
      main: [[{ node: 'Loop Clients', type: 'main', index: 0 }]]
    },
    // Loop Clients -> Set Client Context (batch items) and done (nothing)
    'Loop Clients': {
      main: [
        // Output 0: done (no more items) — nothing connected
        [],
        // Output 1: loop item
        [{ node: 'Set Client Context', type: 'main', index: 0 }]
      ]
    },
    // Set Client Context -> Load Client IG Token
    'Set Client Context': {
      main: [[{ node: 'Load Client IG Token', type: 'main', index: 0 }]]
    },
    // Load Client IG Token -> Skip If No Token
    'Load Client IG Token': {
      main: [[{ node: 'Skip If No Token', type: 'main', index: 0 }]]
    },
    // Skip If No Token:
    //   true (has token) -> Get Posts + Get Existing Snapshots
    //   false (no token) -> Loop Clients (skip this client)
    'Skip If No Token': {
      main: [
        // Output 0: true (condition met = has token)
        [
          { node: 'Get Posts With ig_post_id', type: 'main', index: 0 },
          { node: 'Get Existing Snapshots', type: 'main', index: 0 }
        ],
        // Output 1: false (no token) -> back to loop
        [{ node: 'Loop Clients', type: 'main', index: 0 }]
      ]
    },
    // Get Posts -> Determine Due Snapshots (input 0)
    'Get Posts With ig_post_id': {
      main: [[{ node: 'Determine Due Snapshots', type: 'main', index: 0 }]]
    },
    // Get Existing Snapshots -> Determine Due Snapshots (input 1)
    'Get Existing Snapshots': {
      main: [[{ node: 'Determine Due Snapshots', type: 'main', index: 0 }]]
    },
    // Determine Due Snapshots -> Any Snapshots Due?
    'Determine Due Snapshots': {
      main: [[{ node: 'Any Snapshots Due?', type: 'main', index: 0 }]]
    },
    // Any Snapshots Due?: true (no snapshots) -> Build Briefing, false (has snapshots) -> Process Each Snapshot
    'Any Snapshots Due?': {
      main: [
        [{ node: 'Build Briefing', type: 'main', index: 0 }],
        [{ node: 'Process Each Snapshot', type: 'main', index: 0 }]
      ]
    },
    // Process Each Snapshot -> Get Post Insights + Get Media Fields
    'Process Each Snapshot': {
      main: [[
        { node: 'Get Post Insights', type: 'main', index: 0 },
        { node: 'Get Media Fields', type: 'main', index: 0 }
      ]]
    },
    // Get Post Insights -> Calculate Metrics (input 0)
    'Get Post Insights': {
      main: [[{ node: 'Calculate Metrics', type: 'main', index: 0 }]]
    },
    // Get Media Fields -> Calculate Metrics (input 1)
    'Get Media Fields': {
      main: [[{ node: 'Calculate Metrics', type: 'main', index: 1 }]]
    },
    // Calculate Metrics -> Upsert Snapshot
    'Calculate Metrics': {
      main: [[{ node: 'Upsert Snapshot', type: 'main', index: 0 }]]
    },
    // Upsert Snapshot -> Merge Loop
    'Upsert Snapshot': {
      main: [[{ node: 'Merge Loop', type: 'main', index: 0 }]]
    },
    // Merge Loop -> Process Each Snapshot (loop back) + Build Briefing (done)
    'Merge Loop': {
      main: [[
        { node: 'Process Each Snapshot', type: 'main', index: 0 },
        { node: 'Build Briefing', type: 'main', index: 0 }
      ]]
    },
    // Build Briefing -> Load Notification Config
    'Build Briefing': {
      main: [[{ node: 'Load Notification Config', type: 'main', index: 0 }]]
    },
    // Load Notification Config -> Send Client Telegram Briefing
    'Load Notification Config': {
      main: [[{ node: 'Send Client Telegram Briefing', type: 'main', index: 0 }]]
    },
    // Send Client Telegram Briefing -> Loop Clients (next client)
    'Send Client Telegram Briefing': {
      main: [[{ node: 'Loop Clients', type: 'main', index: 0 }]]
    }
  };

  // ============================================================
  // APPLY UPDATE
  // ============================================================

  const updatePayload = {
    name: wf.name,
    nodes: newNodes,
    connections: newConnections,
    settings: wf.settings || {},
    staticData: wf.staticData || null
  };

  console.log(`Updating workflow with ${newNodes.length} nodes...`);
  const result = await apiRequest('PUT', `/api/v1/workflows/${WORKFLOW_ID}`, updatePayload);

  if (result.status === 200) {
    console.log('SUCCESS: Workflow updated');
    console.log(`Nodes: ${result.data.nodes?.length}`);
    console.log(`Active: ${result.data.active}`);

    // Verify key nodes exist
    const nodeNames = result.data.nodes?.map(n => n.name) || [];
    const required = ['Fetch Active Clients', 'Loop Clients', 'Load Client IG Token', 'Skip If No Token', 'Set Client Context', 'Load Notification Config'];
    for (const name of required) {
      console.log(`  ${nodeNames.includes(name) ? 'OK' : 'MISSING'}: ${name}`);
    }
  } else {
    console.error('FAILED:', result.status, JSON.stringify(result.data).substring(0, 500));
    process.exit(1);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
