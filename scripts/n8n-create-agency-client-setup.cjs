#!/usr/bin/env node
/**
 * Create Agency Client Setup V1.0 workflow
 * Phase 03 Plan 03 Task 2
 *
 * Creates a webhook-triggered workflow that:
 *   1. Receives POST { client_id, agency_id, trigger_first_run }
 *   2. Loads client_config, client_accounts, client_pillars from Supabase
 *   3. Validates config completeness (brand_voice, target_audience, content_style + accounts + pillars)
 *   4. If valid + trigger_first_run: triggers R&P Orchestrator
 *   5. Returns validation result via webhook response
 */

const https = require('https');

const API_URL = 'https://skinclarityclub.app.n8n.cloud';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3OTFhOGMwYy04MjQ5LTQzMjItYjM4Ny02MGVkZmE2NzA5NDciLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZDBlNGIyMGQtYjM0MC00NGRmLWFmODMtZWFlZjA0NTUwNjQ5IiwiaWF0IjoxNzcwODgzMDEwfQ.MFUA5Ot0TvCJvSiASmcUnilrjhhiE3fThox4vZoUl48';

const SUPABASE_URL = 'https://nurdldgqxseunotmygzn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51cmRsZGdxeHNldW5vdG15Z3puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxNTQzNDksImV4cCI6MjA1MTczMDM0OX0.wr5YpHe-9HxNfWBkuQl6a3L0VJKp1YZSM6QkSdx-qhY';

// R&P Orchestrator webhook URL (production path)
const RP_ORCHESTRATOR_WEBHOOK = 'https://skinclarityclub.app.n8n.cloud/webhook/rp-orchestrator';

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
  console.log('Creating Agency Client Setup V1.0 workflow...');

  const supabaseHeaders = [
    { name: 'apikey', value: SUPABASE_ANON_KEY },
    { name: 'Authorization', value: `Bearer ${SUPABASE_ANON_KEY}` },
    { name: 'Content-Type', value: 'application/json' }
  ];

  const nodes = [
    // 1. Webhook trigger
    {
      id: 'acs-webhook',
      name: 'Webhook',
      type: 'n8n-nodes-base.webhook',
      typeVersion: 2,
      position: [200, 300],
      webhookId: 'agency-client-setup',
      parameters: {
        path: 'agency-client-setup',
        httpMethod: 'POST',
        responseMode: 'responseNode',
        options: {}
      }
    },

    // 2. Load Client Config
    {
      id: 'acs-load-config',
      name: 'Load Client Config',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: [460, 300],
      parameters: {
        method: 'GET',
        url: `${SUPABASE_URL}/rest/v1/client_config`,
        sendQuery: true,
        queryParameters: {
          parameters: [
            { name: 'client_id', value: '={{ "eq." + $json.body.client_id }}' },
            { name: 'select', value: 'config_key,config_value' }
          ]
        },
        sendHeaders: true,
        headerParameters: { parameters: supabaseHeaders },
        options: { response: { response: { responseFormat: 'json' } } }
      }
    },

    // 3. Load Client Accounts
    {
      id: 'acs-load-accounts',
      name: 'Load Client Accounts',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: [460, 500],
      parameters: {
        method: 'GET',
        url: `${SUPABASE_URL}/rest/v1/client_accounts`,
        sendQuery: true,
        queryParameters: {
          parameters: [
            { name: 'client_id', value: '={{ "eq." + $json.body.client_id }}' },
            { name: 'select', value: 'id,platform,handle' }
          ]
        },
        sendHeaders: true,
        headerParameters: { parameters: supabaseHeaders },
        options: { response: { response: { responseFormat: 'json' } } }
      }
    },

    // 4. Load Client Pillars
    {
      id: 'acs-load-pillars',
      name: 'Load Client Pillars',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: [460, 700],
      parameters: {
        method: 'GET',
        url: `${SUPABASE_URL}/rest/v1/client_pillars`,
        sendQuery: true,
        queryParameters: {
          parameters: [
            { name: 'client_id', value: '={{ "eq." + $json.body.client_id }}' },
            { name: 'select', value: 'id,pillar_key,name' }
          ]
        },
        sendHeaders: true,
        headerParameters: { parameters: supabaseHeaders },
        options: { response: { response: { responseFormat: 'json' } } }
      }
    },

    // 5. Validate Config Completeness
    {
      id: 'acs-validate',
      name: 'Validate Config Completeness',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [780, 500],
      parameters: {
        jsCode: `const config = $('Load Client Config').all().map(i => i.json);
const accounts = $('Load Client Accounts').all().map(i => i.json);
const pillars = $('Load Client Pillars').all().map(i => i.json);

// Flatten arrays if responses are nested
const configItems = Array.isArray(config[0]) ? config[0] : config;
const accountItems = Array.isArray(accounts[0]) ? accounts[0] : accounts;
const pillarItems = Array.isArray(pillars[0]) ? pillars[0] : pillars;

const required = ['brand_voice', 'target_audience', 'content_style'];
const configKeys = configItems.map(c => c.config_key);
const missingConfig = required.filter(r => !configKeys.includes(r));

const issues = [];
if (missingConfig.length > 0) issues.push('Missing config: ' + missingConfig.join(', '));
if (accountItems.length === 0) issues.push('No social accounts configured');
if (pillarItems.length === 0) issues.push('No content pillars defined');

return [{
  json: {
    client_id: $('Webhook').first().json.body.client_id,
    is_valid: issues.length === 0,
    issues,
    config_count: configItems.length,
    accounts_count: accountItems.length,
    pillars_count: pillarItems.length,
    trigger_first_run: $('Webhook').first().json.body.trigger_first_run
  }
}];`
      }
    },

    // 6. Config Valid? IF node
    {
      id: 'acs-if-valid',
      name: 'Config Valid?',
      type: 'n8n-nodes-base.if',
      typeVersion: 2,
      position: [1060, 500],
      parameters: {
        conditions: {
          options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' },
          conditions: [{
            id: 'is-valid',
            leftValue: '={{ $json.is_valid }}',
            rightValue: true,
            operator: { type: 'boolean', operation: 'true' }
          }],
          combinator: 'and'
        },
        options: {}
      }
    },

    // 7. Should Trigger First Run? IF node (on true branch)
    {
      id: 'acs-if-trigger',
      name: 'Should Trigger First Run?',
      type: 'n8n-nodes-base.if',
      typeVersion: 2,
      position: [1340, 400],
      parameters: {
        conditions: {
          options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' },
          conditions: [{
            id: 'trigger-run',
            leftValue: '={{ $json.trigger_first_run }}',
            rightValue: true,
            operator: { type: 'boolean', operation: 'true' }
          }],
          combinator: 'and'
        },
        options: {}
      }
    },

    // 8. Trigger First R&P Run (HTTP POST to Orchestrator webhook)
    {
      id: 'acs-trigger-rp',
      name: 'Trigger First R&P Run',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: [1620, 300],
      parameters: {
        method: 'POST',
        url: RP_ORCHESTRATOR_WEBHOOK,
        sendBody: true,
        specifyBody: 'json',
        jsonBody: '={{ JSON.stringify({ client_id: $json.client_id }) }}',
        options: {
          response: { response: { neverError: true } }
        }
      }
    },

    // 9. Return Validation Result (on false/invalid branch)
    {
      id: 'acs-respond-invalid',
      name: 'Return Validation Result',
      type: 'n8n-nodes-base.respondToWebhook',
      typeVersion: 1.1,
      position: [1340, 700],
      parameters: {
        respondWith: 'json',
        responseBody: '={{ JSON.stringify({ success: false, client_id: $json.client_id, issues: $json.issues }) }}',
        options: {
          responseCode: 422
        }
      }
    },

    // 10. Return Setup Success (on valid branches - after trigger or skip)
    {
      id: 'acs-respond-success',
      name: 'Return Setup Success',
      type: 'n8n-nodes-base.respondToWebhook',
      typeVersion: 1.1,
      position: [1900, 400],
      parameters: {
        respondWith: 'json',
        responseBody: '={{ JSON.stringify({ success: true, client_id: $json.client_id, first_run_triggered: $json.trigger_first_run || false }) }}',
        options: {
          responseCode: 200
        }
      }
    }
  ];

  const connections = {
    // Webhook -> Load Config, Load Accounts, Load Pillars (parallel)
    'Webhook': {
      main: [[
        { node: 'Load Client Config', type: 'main', index: 0 },
        { node: 'Load Client Accounts', type: 'main', index: 0 },
        { node: 'Load Client Pillars', type: 'main', index: 0 }
      ]]
    },
    // All three loads -> Validate Config Completeness
    'Load Client Config': {
      main: [[{ node: 'Validate Config Completeness', type: 'main', index: 0 }]]
    },
    'Load Client Accounts': {
      main: [[{ node: 'Validate Config Completeness', type: 'main', index: 0 }]]
    },
    'Load Client Pillars': {
      main: [[{ node: 'Validate Config Completeness', type: 'main', index: 0 }]]
    },
    // Validate -> Config Valid? IF
    'Validate Config Completeness': {
      main: [[{ node: 'Config Valid?', type: 'main', index: 0 }]]
    },
    // Config Valid? true -> Should Trigger First Run?
    // Config Valid? false -> Return Validation Result
    'Config Valid?': {
      main: [
        [{ node: 'Should Trigger First Run?', type: 'main', index: 0 }],
        [{ node: 'Return Validation Result', type: 'main', index: 0 }]
      ]
    },
    // Should Trigger? true -> Trigger First R&P Run
    // Should Trigger? false -> Return Setup Success
    'Should Trigger First Run?': {
      main: [
        [{ node: 'Trigger First R&P Run', type: 'main', index: 0 }],
        [{ node: 'Return Setup Success', type: 'main', index: 0 }]
      ]
    },
    // Trigger First R&P Run -> Return Setup Success
    'Trigger First R&P Run': {
      main: [[{ node: 'Return Setup Success', type: 'main', index: 0 }]]
    }
  };

  const createPayload = {
    name: 'Agency Client Setup V1.0',
    nodes: nodes,
    connections: connections,
    settings: { executionOrder: 'v1' },
    staticData: null
  };

  const createResult = await apiRequest('POST', '/api/v1/workflows', createPayload);

  if (createResult.status !== 200 && createResult.status !== 201) {
    console.error('Failed to create workflow:', createResult.status, JSON.stringify(createResult.data).substring(0, 500));
    process.exit(1);
  }

  const workflowId = createResult.data.id;
  console.log(`Created Agency Client Setup V1.0 — ID: ${workflowId}`);
  console.log(`Nodes: ${createResult.data.nodes?.length}`);

  // Activate the workflow
  const activateResult = await apiRequest('POST', `/api/v1/workflows/${workflowId}/activate`, {});
  if (activateResult.status === 200) {
    console.log(`Activated: ${activateResult.data.active}`);

    // Get webhook URL
    const webhookPath = activateResult.data.nodes?.find(n => n.type === 'n8n-nodes-base.webhook')?.parameters?.path;
    if (webhookPath) {
      console.log(`\nWebhook URL (production): https://skinclarityclub.app.n8n.cloud/webhook/${webhookPath}`);
      console.log(`Webhook URL (test): https://skinclarityclub.app.n8n.cloud/webhook-test/${webhookPath}`);
    }
  } else {
    console.error('Activation failed:', activateResult.status, JSON.stringify(activateResult.data).substring(0, 500));
    process.exit(1);
  }

  // Verify nodes
  const nodeNames = createResult.data.nodes?.map(n => n.name) || [];
  const required = [
    'Webhook', 'Load Client Config', 'Load Client Accounts', 'Load Client Pillars',
    'Validate Config Completeness', 'Config Valid?', 'Should Trigger First Run?',
    'Trigger First R&P Run', 'Return Validation Result', 'Return Setup Success'
  ];
  console.log('\nNode verification:');
  for (const name of required) {
    console.log(`  ${nodeNames.includes(name) ? 'OK' : 'MISSING'}: ${name}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
