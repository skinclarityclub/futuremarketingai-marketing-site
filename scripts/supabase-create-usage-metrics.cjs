#!/usr/bin/env node
/**
 * Create usage_metrics table in Supabase
 * Phase 03 Plan 01 Task 1: Foundational usage metering storage
 *
 * APPLIED: 2026-03-20 via Supabase Management API
 *
 * Schema:
 *   - id BIGSERIAL PRIMARY KEY
 *   - client_id TEXT NOT NULL REFERENCES clients(id)
 *   - metric_type TEXT NOT NULL (e.g. 'execution', 'content_item', 'voice_minute', 'render')
 *   - quantity INTEGER NOT NULL DEFAULT 1
 *   - metadata JSONB (workflow name, run_id, items generated, etc.)
 *   - recorded_at TIMESTAMPTZ DEFAULT now()
 *
 * Indexes:
 *   - idx_usage_metrics_client_date (client_id, recorded_at)
 *   - idx_usage_metrics_client_type (client_id, metric_type)
 *
 * RLS Policies:
 *   - "Service role full access" — n8n writes via service_role
 *   - "Authenticated read metrics" — dashboard reads for authenticated users
 *
 * Note: Plan originally referenced clients.agency_id for RLS scoping, but clients
 * table has no agency_id column. Simplified to authenticated read for now;
 * agency-level scoping can be added when agency_id column exists.
 */

const https = require('https');

const SUPABASE_URL = 'https://nurdldgqxseunotmygzn.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const MIGRATION_SQL = `
-- Phase 03 Plan 01: Create usage_metrics table for per-client usage metering
CREATE TABLE IF NOT EXISTS usage_metrics (
  id BIGSERIAL PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id),
  metric_type TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  metadata JSONB,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_usage_metrics_client_date ON usage_metrics(client_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_usage_metrics_client_type ON usage_metrics(client_id, metric_type);

ALTER TABLE usage_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON usage_metrics
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Authenticated read metrics" ON usage_metrics
  FOR SELECT USING (auth.role() = 'authenticated');
`;

async function verify() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'nurdldgqxseunotmygzn.supabase.co',
      path: '/rest/v1/usage_metrics?limit=0',
      method: 'GET',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      }
    };
    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        resolve({ status: res.statusCode });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log('=== usage_metrics Migration ===\n');
  console.log('Migration SQL:');
  console.log(MIGRATION_SQL);

  if (!SUPABASE_SERVICE_KEY) {
    console.log('Note: Set SUPABASE_SERVICE_ROLE_KEY env var for verification.');
    console.log('Migration was already applied via Management API on 2026-03-20.');
    return;
  }

  console.log('\nVerifying table exists via REST API...');
  const result = await verify();
  if (result.status === 200) {
    console.log('PASSED: usage_metrics table accessible');
  } else {
    console.log(`FAILED: status ${result.status}`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
