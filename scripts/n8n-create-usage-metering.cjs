#!/usr/bin/env node
/**
 * Create Usage Metering V1.0 sub-workflow and wire into R&P Orchestrator
 * Phase 03 Plan 03 Task 1
 *
 * Part A: Creates "Usage Metering V1.0" sub-workflow with:
 *   - Execute Workflow Trigger (accepts client_id, metric_type, quantity, metadata)
 *   - Log Usage Metric HTTP Request (POST to Supabase usage_metrics)
 *   - Return Success Set node
 *
 * Part B: Wires metering into R&P Orchestrator V1.0 (SDftDejLt1CSDHjB):
 *   - Adds "Log Execution Metric" Execute Sub-Workflow node after Completion Summary
 *   - Adds "Log Content Items Metric" Execute Sub-Workflow node after execution metric
 */

const https = require('https');

const API_URL = 'https://skinclarityclub.app.n8n.cloud';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3OTFhOGMwYy04MjQ5LTQzMjItYjM4Ny02MGVkZmE2NzA5NDciLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZDBlNGIyMGQtYjM0MC00NGRmLWFmODMtZWFlZjA0NTUwNjQ5IiwiaWF0IjoxNzcwODgzMDEwfQ.MFUA5Ot0TvCJvSiASmcUnilrjhhiE3fThox4vZoUl48';
const ORCHESTRATOR_ID = 'SDftDejLt1CSDHjB';

const SUPABASE_URL = 'https://nurdldgqxseunotmygzn.supabase.co';

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
  // ============================================================
  // PART A: Create Usage Metering V1.0 sub-workflow
  // ============================================================
  console.log('=== PART A: Creating Usage Metering V1.0 sub-workflow ===');

  const meteringNodes = [
    {
      id: 'um-trigger',
      name: 'Execute Workflow Trigger',
      type: 'n8n-nodes-base.executeWorkflowTrigger',
      typeVersion: 1,  // Must be v1, not v1.1, for n8n Cloud compatibility
      position: [260, 300],
      parameters: {}
    },
    {
      id: 'um-log-metric',
      name: 'Log Usage Metric',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: [520, 300],
      parameters: {
        method: 'POST',
        url: `${SUPABASE_URL}/rest/v1/usage_metrics`,
        sendHeaders: true,
        headerParameters: {
          parameters: [
            { name: 'apikey', value: '={{ $env.SUPABASE_ANON_KEY }}' },
            { name: 'Authorization', value: '={{ "Bearer " + $env.SUPABASE_SERVICE_ROLE_KEY }}' },
            { name: 'Content-Type', value: 'application/json' },
            { name: 'Prefer', value: 'return=minimal' }
          ]
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={{ JSON.stringify({
  client_id: $json.client_id,
  metric_type: $json.metric_type,
  quantity: $json.quantity || 1,
  metadata: $json.metadata || {}
}) }}`,
        options: {
          response: { response: { neverError: true } }
        }
      }
    },
    {
      id: 'um-return',
      name: 'Return Success',
      type: 'n8n-nodes-base.set',
      typeVersion: 3.4,
      position: [780, 300],
      parameters: {
        mode: 'manual',
        duplicateItem: false,
        assignments: {
          assignments: [
            {
              id: 'success',
              name: 'success',
              value: true,
              type: 'boolean'
            },
            {
              id: 'metric_type',
              name: 'metric_type',
              value: '={{ $json.metric_type || $("Execute Workflow Trigger").first().json.metric_type }}',
              type: 'string'
            }
          ]
        },
        options: {}
      }
    }
  ];

  const meteringConnections = {
    'Execute Workflow Trigger': {
      main: [[{ node: 'Log Usage Metric', type: 'main', index: 0 }]]
    },
    'Log Usage Metric': {
      main: [[{ node: 'Return Success', type: 'main', index: 0 }]]
    }
  };

  const createPayload = {
    name: 'Usage Metering V1.0',
    nodes: meteringNodes,
    connections: meteringConnections,
    settings: {
      executionOrder: 'v1'
    },
    staticData: null
  };

  const createResult = await apiRequest('POST', '/api/v1/workflows', createPayload);

  if (createResult.status !== 200 && createResult.status !== 201) {
    console.error('Failed to create Usage Metering workflow:', createResult.status, JSON.stringify(createResult.data).substring(0, 500));
    process.exit(1);
  }

  const meteringWorkflowId = createResult.data.id;
  console.log(`Created Usage Metering V1.0 — ID: ${meteringWorkflowId}`);
  console.log(`Nodes: ${createResult.data.nodes?.length}`);

  // Activate the workflow
  const activateResult = await apiRequest('PATCH', `/api/v1/workflows/${meteringWorkflowId}`, { active: true });
  if (activateResult.status === 200) {
    console.log(`Activated: ${activateResult.data.active}`);
  } else {
    console.log(`Activation response: ${activateResult.status} — sub-workflows may not need activation`);
  }

  // ============================================================
  // PART B: Wire metering into R&P Orchestrator
  // ============================================================
  console.log('\n=== PART B: Wiring metering into R&P Orchestrator ===');

  const { status: orchStatus, data: orchWf } = await apiRequest('GET', `/api/v1/workflows/${ORCHESTRATOR_ID}`);
  if (orchStatus !== 200) {
    console.error('Failed to fetch R&P Orchestrator:', orchStatus);
    process.exit(1);
  }

  console.log(`R&P Orchestrator: "${orchWf.name}" — ${orchWf.nodes.length} nodes`);

  // Find the Completion Summary node
  const nodesByName = {};
  for (const n of orchWf.nodes) {
    nodesByName[n.name] = n;
  }

  // Print all node names for reference
  console.log('Existing nodes:');
  for (const n of orchWf.nodes) {
    console.log(`  - "${n.name}" (${n.type})`);
  }

  // Find the completion summary node (or final node in pipeline)
  const completionNode = nodesByName['Completion Summary'] || nodesByName['CB Supabase Final'] || null;
  const completionNodeName = completionNode ? completionNode.name : null;

  if (!completionNodeName) {
    console.error('Could not find Completion Summary or CB Supabase Final node');
    console.log('Available nodes:', Object.keys(nodesByName).join(', '));
    process.exit(1);
  }

  console.log(`Found completion node: "${completionNodeName}"`);

  // Determine position for new metering nodes (after completion node)
  const completionPos = completionNode.position;
  const meteringExecPos = [completionPos[0] + 300, completionPos[1]];
  const meteringContentPos = [completionPos[0] + 600, completionPos[1]];

  // Create new metering call nodes
  const logExecutionMetric = {
    id: 'um-log-exec',
    name: 'Log Execution Metric',
    type: 'n8n-nodes-base.executeWorkflow',
    typeVersion: 1,
    position: meteringExecPos,
    parameters: {
      workflowId: { __rl: true, value: meteringWorkflowId, mode: 'id' },
      inputData: {
        mappingMode: 'defineBelow',
        value: {
          client_id: '={{ $json.client_id }}',
          metric_type: 'execution',
          quantity: 1,
          metadata: `={{ JSON.stringify({ workflow: "r_and_p_pipeline", run_id: $json.run_id || "", items_generated: $json.items_count || 0 }) }}`
        }
      },
      options: {}
    }
  };

  const logContentMetric = {
    id: 'um-log-content',
    name: 'Log Content Items Metric',
    type: 'n8n-nodes-base.executeWorkflow',
    typeVersion: 1,
    position: meteringContentPos,
    parameters: {
      workflowId: { __rl: true, value: meteringWorkflowId, mode: 'id' },
      inputData: {
        mappingMode: 'defineBelow',
        value: {
          client_id: '={{ $json.client_id }}',
          metric_type: 'content_item',
          quantity: '={{ $json.items_count || 0 }}',
          metadata: `={{ JSON.stringify({ workflow: "r_and_p_pipeline", run_id: $json.run_id || "" }) }}`
        }
      },
      options: {}
    }
  };

  // Add new nodes to the workflow
  const updatedNodes = [...orchWf.nodes, logExecutionMetric, logContentMetric];

  // Update connections: Completion Summary -> Log Execution Metric -> Log Content Items Metric -> Loop back
  const updatedConnections = { ...orchWf.connections };

  // Find what the completion node currently connects to
  const existingCompletionOutputs = updatedConnections[completionNodeName]?.main?.[0] || [];

  // Completion Summary -> Log Execution Metric (add to existing connections)
  updatedConnections[completionNodeName] = {
    main: [[
      ...existingCompletionOutputs,
      { node: 'Log Execution Metric', type: 'main', index: 0 }
    ]]
  };

  // Log Execution Metric -> Log Content Items Metric
  updatedConnections['Log Execution Metric'] = {
    main: [[{ node: 'Log Content Items Metric', type: 'main', index: 0 }]]
  };

  // Log Content Items Metric -> nothing (or loop back if needed)
  // The loop-back to SplitInBatches should remain from existing connections
  updatedConnections['Log Content Items Metric'] = {
    main: [[]]
  };

  const updatePayload = {
    name: orchWf.name,
    nodes: updatedNodes,
    connections: updatedConnections,
    settings: orchWf.settings || {},
    staticData: orchWf.staticData || null
  };

  console.log(`Updating Orchestrator with ${updatedNodes.length} nodes...`);
  const updateResult = await apiRequest('PUT', `/api/v1/workflows/${ORCHESTRATOR_ID}`, updatePayload);

  if (updateResult.status === 200) {
    console.log('SUCCESS: R&P Orchestrator updated');
    console.log(`Nodes: ${updateResult.data.nodes?.length}`);

    // Verify metering nodes exist
    const nodeNames = updateResult.data.nodes?.map(n => n.name) || [];
    const required = ['Log Execution Metric', 'Log Content Items Metric'];
    for (const name of required) {
      console.log(`  ${nodeNames.includes(name) ? 'OK' : 'MISSING'}: ${name}`);
    }

    // Print the metering workflow ID for reference
    console.log(`\nUsage Metering V1.0 workflow ID: ${meteringWorkflowId}`);
  } else {
    console.error('FAILED:', updateResult.status, JSON.stringify(updateResult.data).substring(0, 500));
    process.exit(1);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
