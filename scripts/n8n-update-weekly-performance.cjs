#!/usr/bin/env node
/**
 * Update Weekly Performance Intelligence V1.0 for multi-client operation
 * Adds: Fetch Active Clients -> Loop Clients -> Set Client Context
 * Modifies: Snapshot queries scoped to client_id, report delivery per-client
 */

const https = require('https');

const API_URL = 'https://skinclarityclub.app.n8n.cloud';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3OTFhOGMwYy04MjQ5LTQzMjItYjM4Ny02MGVkZmE2NzA5NDciLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZDBlNGIyMGQtYjM0MC00NGRmLWFmODMtZWFlZjA0NTUwNjQ5IiwiaWF0IjoxNzcwODgzMDEwfQ.MFUA5Ot0TvCJvSiASmcUnilrjhhiE3fThox4vZoUl48';
const WORKFLOW_ID = 'Pr4F6fzHh8RYwlnX';

const SUPABASE_URL = 'https://nurdldgqxseunotmygzn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51cmRsZGdxeHNldW5vdG15Z3puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxNTQzNDksImV4cCI6MjA1MTczMDM0OX0.wr5YpHe-9HxNfWBkuQl6a3L0VJKp1YZSM6QkSdx-qhY';

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

  const nodesByName = {};
  for (const n of wf.nodes) { nodesByName[n.name] = n; }

  // ============================================================
  // NEW NODES
  // ============================================================

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

  const loopClients = {
    id: 'mc-loop-clients',
    name: 'Loop Clients',
    type: 'n8n-nodes-base.splitInBatches',
    typeVersion: 3,
    position: [700, 300],
    parameters: { batchSize: 1, options: {} }
  };

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
          { id: 'client_id', name: 'client_id', value: '={{ $json.id }}', type: 'string' },
          { id: 'client_name', name: 'client_name', value: '={{ $json.name }}', type: 'string' }
        ]
      },
      options: {}
    }
  };

  const loadNotifConfig = {
    id: 'mc-load-notif',
    name: 'Load Notification Config',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [2620, 380],
    parameters: {
      method: 'GET',
      url: `${SUPABASE_URL}/rest/v1/client_config`,
      sendQuery: true,
      queryParameters: {
        parameters: [
          { name: 'client_id', value: '={{ $("Set Client Context").first().json.client_id }}' },
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
  // SHIFT AND MODIFY EXISTING NODES
  // ============================================================
  const SHIFT_X = 700;
  const nodesToShift = ['Get Recent 7d Snapshots', 'Aggregate Performance', 'Has Snapshot Data?',
    'Save to scheduling_intelligence', 'Build Weekly Report', 'Build No-Data Report', 'Send Weekly Report'];
  for (const name of nodesToShift) {
    if (nodesByName[name]) nodesByName[name].position[0] += SHIFT_X;
  }

  // 1. Modify "Get Recent 7d Snapshots" — add client_id filter
  const getSnapshotsNode = nodesByName['Get Recent 7d Snapshots'];
  getSnapshotsNode.parameters.queryParameters.parameters.push({
    name: 'client_id',
    value: '={{ "eq." + $("Set Client Context").first().json.client_id }}'
  });

  // 2. Modify "Save to scheduling_intelligence" — add client_id
  const saveNode = nodesByName['Save to scheduling_intelligence'];
  saveNode.parameters.jsonBody = `={{ JSON.stringify({
  performance_signal: $json.performance_signal,
  signal_type: 'weekly_performance',
  client_id: $("Set Client Context").first().json.client_id,
  created_at: new Date().toISOString()
}) }}`;

  // 3. Modify "Build Weekly Report" — include client name
  const buildWeeklyNode = nodesByName['Build Weekly Report'];
  buildWeeklyNode.parameters.jsCode = `// BUILD WEEKLY REPORT — MULTI-CLIENT
const data = $input.first().json;
const clientName = $('Set Client Context').first().json.client_name || 'Unknown';
const clientId = $('Set Client Context').first().json.client_id || 'unknown';

if (data.no_data) {
  return [{ json: {
    telegram_message: '<b>Weekly Intelligence</b> | ' + clientName + ' | ' + new Date().toLocaleDateString('nl-NL') + '\\n\\nGeen 7d snapshot data beschikbaar. Poller nog niet actief of posts nog niet oud genoeg.',
    client_id: clientId,
    client_name: clientName
  }}];
}

const signal = data.performance_signal;
const accounts = Object.entries(signal.account_summary)
  .map(([k, v]) => k + ': ER=' + (v.avg_er*100).toFixed(2) + '% (' + v.n + ' posts)')
  .join('\\n');

const topHooks = Object.entries(signal.top_hook_types)
  .map(([acc, types]) => acc + ': ' + types.join(', '))
  .join('\\n');

const message = '<b>Weekly Performance Intelligence</b> | ' + clientName + ' | ' + new Date().toLocaleDateString('nl-NL') + '\\n\\nSnapshots geanalyseerd: ' + signal.snapshot_count + '\\n\\nAccount performance (7d avg ER):\\n' + accounts + '\\n\\nTop hook types per account:\\n' + topHooks + '\\n\\nSignal opgeslagen in scheduling_intelligence voor R&P (18:00).';

return [{ json: { telegram_message: message, client_id: clientId, client_name: clientName } }];
`;

  // 4. Modify "Build No-Data Report" — include client name
  const buildNoDataNode = nodesByName['Build No-Data Report'];
  buildNoDataNode.parameters.jsCode = `// NO DATA REPORT — MULTI-CLIENT
const data = $input.first().json;
const clientName = $('Set Client Context').first().json.client_name || 'Unknown';
const clientId = $('Set Client Context').first().json.client_id || 'unknown';

const message = '<b>Weekly Intelligence</b> | ' + clientName + ' | ' + new Date().toLocaleDateString('nl-NL') + '\\n\\nGeen 7d snapshot data beschikbaar.\\nPoller nog niet actief of posts nog niet oud genoeg voor 7d snapshots.\\n\\nActie nodig: Activeer ig_post_id Poller na Instagram token configuratie.';

return [{ json: { telegram_message: message, client_id: clientId, client_name: clientName } }];
`;

  // 5. Modify "Send Weekly Report" — use per-client notification config with SKC fallback
  const sendReportNode = nodesByName['Send Weekly Report'];
  sendReportNode.name = 'Send Client Weekly Report';
  sendReportNode.parameters = {
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
  return JSON.stringify({ chat_id: chatId, text: $json.telegram_message, parse_mode: 'HTML' });
})() }}`,
    options: { response: { response: { neverError: true } } }
  };

  // ============================================================
  // BUILD NEW NODE LIST
  // ============================================================

  const newNodes = [
    nodesByName['Sunday 16:00 Trigger'],
    fetchActiveClients,
    loopClients,
    setClientContext,
    getSnapshotsNode,
    nodesByName['Aggregate Performance'],
    nodesByName['Has Snapshot Data?'],
    saveNode,
    buildWeeklyNode,
    buildNoDataNode,
    loadNotifConfig,
    sendReportNode
  ];

  // ============================================================
  // BUILD NEW CONNECTIONS
  // ============================================================

  const newConnections = {
    'Sunday 16:00 Trigger': {
      main: [[{ node: 'Fetch Active Clients', type: 'main', index: 0 }]]
    },
    'Fetch Active Clients': {
      main: [[{ node: 'Loop Clients', type: 'main', index: 0 }]]
    },
    'Loop Clients': {
      main: [
        // Output 0: done (no more items)
        [],
        // Output 1: loop item
        [{ node: 'Set Client Context', type: 'main', index: 0 }]
      ]
    },
    'Set Client Context': {
      main: [[{ node: 'Get Recent 7d Snapshots', type: 'main', index: 0 }]]
    },
    'Get Recent 7d Snapshots': {
      main: [[{ node: 'Aggregate Performance', type: 'main', index: 0 }]]
    },
    'Aggregate Performance': {
      main: [[{ node: 'Has Snapshot Data?', type: 'main', index: 0 }]]
    },
    'Has Snapshot Data?': {
      main: [
        // Output 0: true (no_data=true) -> Build No-Data Report
        [{ node: 'Build No-Data Report', type: 'main', index: 0 }],
        // Output 1: false (has data) -> Save to scheduling_intelligence
        [{ node: 'Save to scheduling_intelligence', type: 'main', index: 0 }]
      ]
    },
    'Save to scheduling_intelligence': {
      main: [[{ node: 'Build Weekly Report', type: 'main', index: 0 }]]
    },
    'Build Weekly Report': {
      main: [[{ node: 'Load Notification Config', type: 'main', index: 0 }]]
    },
    'Build No-Data Report': {
      main: [[{ node: 'Load Notification Config', type: 'main', index: 0 }]]
    },
    'Load Notification Config': {
      main: [[{ node: 'Send Client Weekly Report', type: 'main', index: 0 }]]
    },
    // Loop-back: after sending report, go to next client
    'Send Client Weekly Report': {
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

    const nodeNames = result.data.nodes?.map(n => n.name) || [];
    const required = ['Fetch Active Clients', 'Loop Clients', 'Set Client Context', 'Load Notification Config', 'Send Client Weekly Report'];
    for (const name of required) {
      console.log(`  ${nodeNames.includes(name) ? 'OK' : 'MISSING'}: ${name}`);
    }

    // Verify no hardcoded client-specific values without fallback
    const allParams = JSON.stringify(result.data.nodes?.map(n => n.parameters));
    const hardcodedTelegram = (allParams.match(/bot7394622882/g) || []).length;
    const hardcodedChat = (allParams.match(/6475835412/g) || []).length;
    console.log(`  Hardcoded telegram bot refs: ${hardcodedTelegram} (should be 0, fallbacks are in expression)`);
    console.log(`  Hardcoded chat_id refs: ${hardcodedChat} (should be 0, fallbacks are in expression)`);
  } else {
    console.error('FAILED:', result.status, JSON.stringify(result.data).substring(0, 500));
    process.exit(1);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
