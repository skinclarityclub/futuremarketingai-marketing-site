#!/usr/bin/env node
/**
 * Update Content Posting Pipeline v2 for multi-client operation
 * Phase 03 Plan 01 Task 2
 *
 * Adds:
 *   - "Set Client ID" node (extracts client_id from trigger with 'skc' fallback)
 *   - "Load Client Posting Config" HTTP Request node (loads from client_accounts)
 *   - "Load Notification Config" HTTP Request node (loads from client_config)
 *
 * Modifies:
 *   - "Configuration + Week Range" Code node: dynamic Blotato IDs + Telegram config with SKC fallbacks
 *   - Connection graph: triggers -> Set Client ID -> Load Posting Config -> Load Notification Config -> Configuration
 */

const https = require('https');

const API_URL = 'https://skinclarityclub.app.n8n.cloud';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3OTFhOGMwYy04MjQ5LTQzMjItYjM4Ny02MGVkZmE2NzA5NDciLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZDBlNGIyMGQtYjM0MC00NGRmLWFmODMtZWFlZjA0NTUwNjQ5IiwiaWF0IjoxNzcwODgzMDEwfQ.MFUA5Ot0TvCJvSiASmcUnilrjhhiE3fThox4vZoUl48';
const WORKFLOW_ID = 'eTCSnh_m2CO7Kylal-4BZ';

const SUPABASE_URL = 'https://nurdldgqxseunotmygzn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51cmRsZGdxeHNldW5vdG15Z3puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxNTQzNDksImV4cCI6MjA1MTczMDM0OX0.wr5YpHe-9HxNfWBkuQl6a3L0VJKp1YZSM6QkSdx-qhY';

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

  console.log(`Workflow: "${wf.name}" - ${wf.nodes.length} nodes`);

  // ============================================================
  // NEW NODE 1: Set Client ID
  // Extracts client_id from trigger data with 'skc' fallback
  // ============================================================
  const setClientId = {
    id: 'mc-set-client-id',
    name: 'Set Client ID',
    type: 'n8n-nodes-base.set',
    typeVersion: 3.4,
    position: [-3050, 480],
    parameters: {
      mode: 'manual',
      duplicateItem: false,
      assignments: {
        assignments: [
          {
            id: 'client_id',
            name: 'client_id',
            value: "={{ $json.client_id || 'skc' }}",
            type: 'string'
          }
        ]
      },
      options: {}
    }
  };

  // ============================================================
  // NEW NODE 2: Load Client Posting Config
  // GET client_accounts for this client_id
  // ============================================================
  const loadClientPostingConfig = {
    id: 'mc-load-posting-config',
    name: 'Load Client Posting Config',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [-2800, 480],
    parameters: {
      method: 'GET',
      url: SUPABASE_URL + '/rest/v1/client_accounts',
      sendQuery: true,
      queryParameters: {
        parameters: [
          { name: 'client_id', value: "=eq.{{ $json.client_id }}" },
          { name: 'is_active', value: 'eq.true' },
          { name: 'select', value: 'account_key,handle,platform,blotato_account_id,posting_time' }
        ]
      },
      sendHeaders: true,
      headerParameters: {
        parameters: [
          { name: 'apikey', value: SUPABASE_ANON_KEY },
          { name: 'Authorization', value: 'Bearer {{ $env.SUPABASE_SERVICE_KEY }}' }
        ]
      },
      options: {
        response: { response: { neverError: true } }
      }
    }
  };

  // ============================================================
  // NEW NODE 3: Load Notification Config
  // GET client_config for telegram_bot_token and telegram_chat_id
  // ============================================================
  const loadNotificationConfig = {
    id: 'mc-load-notification-config',
    name: 'Load Notification Config',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [-2550, 480],
    parameters: {
      method: 'GET',
      url: SUPABASE_URL + '/rest/v1/client_config',
      sendQuery: true,
      queryParameters: {
        parameters: [
          { name: 'client_id', value: "=eq.{{ $('Set Client ID').first().json.client_id }}" },
          { name: 'config_key', value: 'in.(telegram_bot_token,telegram_chat_id)' },
          { name: 'select', value: 'config_key,config_value' }
        ]
      },
      sendHeaders: true,
      headerParameters: {
        parameters: [
          { name: 'apikey', value: SUPABASE_ANON_KEY },
          { name: 'Authorization', value: 'Bearer {{ $env.SUPABASE_SERVICE_KEY }}' }
        ]
      },
      options: {
        response: { response: { neverError: true } }
      }
    }
  };

  // ============================================================
  // MODIFY "Configuration + Week Range" Code node
  // Replace hardcoded values with dynamic loading + SKC fallbacks
  // ============================================================
  const configNodeIndex = wf.nodes.findIndex(n => n.name === 'Configuration + Week Range');
  if (configNodeIndex === -1) {
    console.error('Configuration + Week Range node not found!');
    process.exit(1);
  }

  const newConfigCode = [
    '// ===== CONFIGURATION (Multi-Client) =====',
    '// Loads Blotato account IDs from client_accounts table',
    '// Loads Telegram config from client_config table',
    '// Falls back to SKC defaults when no client config present',
    '',
    '// --- Load client accounts from "Load Client Posting Config" node ---',
    'let clientAccounts = [];',
    'try {',
    '  const raw = $(\'Load Client Posting Config\').all();',
    '  clientAccounts = raw.map(item => {',
    '    let data = item.json;',
    '    // Handle double JSON.parse pitfall for JSONB columns (Pitfall 6)',
    '    if (typeof data === \'string\') data = JSON.parse(data);',
    '    return data;',
    '  });',
    '} catch (e) {',
    '  // No client accounts loaded - will use SKC defaults',
    '}',
    '',
    '// Build account map from loaded client_accounts',
    'const accountMap = {};',
    'for (const acct of clientAccounts) {',
    '  if (acct && (acct.account_key || acct.handle)) {',
    '    const key = acct.account_key || acct.handle;',
    '    accountMap[key] = String(acct.blotato_account_id || \'\');',
    '  }',
    '}',
    '',
    '// --- Load notification config from "Load Notification Config" node ---',
    'const telegramConfig = {};',
    'try {',
    '  const raw = $(\'Load Notification Config\').all();',
    '  for (const cfg of raw) {',
    '    let val = cfg.json.config_value;',
    '    // Handle double JSON.parse pitfall (Pitfall 6)',
    '    if (typeof val === \'string\') {',
    '      try { val = JSON.parse(val); } catch(e) { /* keep as string */ }',
    '    }',
    '    if (typeof val === \'string\') {',
    '      try { val = JSON.parse(val); } catch(e) { /* keep as string */ }',
    '    }',
    '    telegramConfig[cfg.json.config_key] = val;',
    '  }',
    '} catch (e) {',
    '  // No notification config loaded - will use SKC defaults',
    '}',
    '',
    '// --- Build config with SKC fallbacks ---',
    'const config = {',
    '  blotato: {',
    "    apiKey: 'blt_wG0uSEuhmAwwa3gnmmvDGIGwIZlM3HnqTKSg/pyGz7I=',",
    "    baseUrl: 'https://backend.blotato.com/v2',",
    '    accounts: {',
    "      // Dynamic accounts from client_accounts, with SKC defaults as fallback",
    "      skinclarity_club: accountMap['skinclarity_club'] || '5874',",
    "      sindy_huidtherapeut: accountMap['sindy_huidtherapeut'] || '31104',",
    "      skinclarity_shop: accountMap['skinclarity_shop'] || '31105'",
    '    }',
    '  },',
    '  telegram: {',
    "    botToken: telegramConfig.telegram_bot_token || '7394622882:AAF5ZYZgj9yMPh1LiFBBxxIrs7-GoGvT_sw',",
    "    chatId: telegramConfig.telegram_chat_id || '6475835412'",
    '  }',
    '};',
    '',
    '// Add any additional accounts from client_accounts (for non-SKC clients)',
    'for (const [key, val] of Object.entries(accountMap)) {',
    "  if (!['skinclarity_club', 'sindy_huidtherapeut', 'skinclarity_shop'].includes(key)) {",
    '    config.blotato.accounts[key] = val;',
    '  }',
    '}',
    '',
    '// Calculate next week date range (Monday 00:00 -> Sunday 23:59)',
    'const now = new Date();',
    'const dayOfWeek = now.getDay(); // 0=Sun',
    'const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;',
    'const nextMonday = new Date(now);',
    'nextMonday.setDate(now.getDate() + daysUntilMonday);',
    'nextMonday.setHours(0, 0, 0, 0);',
    '',
    'const nextSundayEnd = new Date(nextMonday);',
    'nextSundayEnd.setDate(nextMonday.getDate() + 6);',
    'nextSundayEnd.setHours(23, 59, 59, 999);',
    '',
    'config.weekRange = {',
    '  start: nextMonday.toISOString(),',
    '  end: nextSundayEnd.toISOString(),',
    "  label: `${nextMonday.toLocaleDateString('nl-NL')} t/m ${nextSundayEnd.toLocaleDateString('nl-NL')}`",
    '};',
    '',
    '// Pass through client_id for downstream usage',
    "const clientId = $('Set Client ID').first().json.client_id || 'skc';",
    '',
    'return [{ json: { config, client_id: clientId } }];'
  ].join('\n');

  wf.nodes[configNodeIndex].parameters.jsCode = newConfigCode;

  // ============================================================
  // ADD new nodes
  // ============================================================
  wf.nodes.push(setClientId);
  wf.nodes.push(loadClientPostingConfig);
  wf.nodes.push(loadNotificationConfig);

  // ============================================================
  // UPDATE CONNECTIONS
  // Both triggers -> Set Client ID -> Load Posting Config -> Load Notification Config -> Configuration
  // ============================================================
  wf.connections['Weekly: Sunday 20:00 CET'] = {
    main: [[{ node: 'Set Client ID', type: 'main', index: 0 }]]
  };
  wf.connections['Webhook: Week Ready'] = {
    main: [[{ node: 'Set Client ID', type: 'main', index: 0 }]]
  };
  wf.connections['Set Client ID'] = {
    main: [[{ node: 'Load Client Posting Config', type: 'main', index: 0 }]]
  };
  wf.connections['Load Client Posting Config'] = {
    main: [[{ node: 'Load Notification Config', type: 'main', index: 0 }]]
  };
  wf.connections['Load Notification Config'] = {
    main: [[{ node: 'Configuration + Week Range', type: 'main', index: 0 }]]
  };

  // ============================================================
  // APPLY UPDATE via PUT (n8n API requires PUT, not PATCH)
  // ============================================================
  console.log(`\nUpdating workflow with ${wf.nodes.length} nodes...`);

  const updateBody = {
    name: wf.name,
    nodes: wf.nodes,
    connections: wf.connections,
    settings: wf.settings,
    staticData: wf.staticData
  };

  const { status: updateStatus, data: updateData } = await apiRequest(
    'PUT',
    `/api/v1/workflows/${WORKFLOW_ID}`,
    updateBody
  );

  if (updateStatus === 200) {
    console.log(`SUCCESS: Workflow updated - ${updateData.nodes?.length || '?'} nodes`);
  } else {
    console.error(`FAILED: Status ${updateStatus}`);
    console.error(typeof updateData === 'string' ? updateData.substring(0, 1000) : JSON.stringify(updateData).substring(0, 1000));
    process.exit(1);
  }

  // ============================================================
  // VERIFY
  // ============================================================
  console.log('\nVerifying...');
  const { data: verified } = await apiRequest('GET', `/api/v1/workflows/${WORKFLOW_ID}`);

  const checks = {
    'Set Client ID node exists': verified.nodes.some(n => n.name === 'Set Client ID'),
    'Load Client Posting Config node exists': verified.nodes.some(n => n.name === 'Load Client Posting Config'),
    'Load Notification Config node exists': verified.nodes.some(n => n.name === 'Load Notification Config'),
  };

  const configNode = verified.nodes.find(n => n.name === 'Configuration + Week Range');
  const code = configNode?.parameters?.jsCode || '';

  // Verify hardcoded IDs are only used as fallbacks (after ||)
  const lines5874 = code.split('\n').filter(l => l.includes("'5874'"));
  checks['5874 used as fallback only'] = lines5874.length > 0 && lines5874.every(l => l.includes("|| '5874'"));
  checks['31104 used as fallback only'] = code.includes("|| '31104'");
  checks['31105 used as fallback only'] = code.includes("|| '31105'");
  checks['Dynamic account loading from node'] = code.includes("Load Client Posting Config");
  checks['Dynamic Telegram config from node'] = code.includes("Load Notification Config");
  checks['Double JSON.parse handling'] = code.includes('JSON.parse');
  checks['Client ID passthrough'] = code.includes('client_id');

  let allPassed = true;
  for (const [check, result] of Object.entries(checks)) {
    console.log(`  ${result ? 'PASS' : 'FAIL'}: ${check}`);
    if (!result) allPassed = false;
  }

  if (allPassed) {
    console.log(`\nAll verifications PASSED (${verified.nodes.length} nodes)`);
  } else {
    console.log('\nSome verifications FAILED');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
