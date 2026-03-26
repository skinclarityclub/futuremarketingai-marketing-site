const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '..', 'messages');

const en = JSON.parse(fs.readFileSync(path.join(messagesDir, 'en.json'), 'utf8'));
const nl = JSON.parse(fs.readFileSync(path.join(messagesDir, 'nl.json'), 'utf8'));
const es = JSON.parse(fs.readFileSync(path.join(messagesDir, 'es.json'), 'utf8'));

function flattenKeys(obj, prefix = '') {
  let keys = [];
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(flattenKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function getNestedValue(obj, keyPath) {
  const parts = keyPath.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    current = current[part];
  }
  return current;
}

const enKeys = flattenKeys(en);
const nlKeys = flattenKeys(nl);
const esKeys = flattenKeys(es);

const enKeySet = new Set(enKeys);
const nlKeySet = new Set(nlKeys);
const esKeySet = new Set(esKeys);

// Missing in NL (present in EN but not in NL)
const missingInNl = enKeys.filter(k => !nlKeySet.has(k));
// Missing in ES (present in EN but not in ES)
const missingInEs = enKeys.filter(k => !esKeySet.has(k));
// Extra in NL (present in NL but not in EN)
const extraInNl = nlKeys.filter(k => !enKeySet.has(k));
// Extra in ES (present in ES but not in EN)
const extraInEs = esKeys.filter(k => !enKeySet.has(k));

console.log(`\n=== TRANSLATION KEY AUDIT ===`);
console.log(`EN keys: ${enKeys.length}`);
console.log(`NL keys: ${nlKeys.length}`);
console.log(`ES keys: ${esKeys.length}`);

console.log(`\n--- MISSING IN NL (${missingInNl.length} keys) ---`);
if (missingInNl.length === 0) {
  console.log('None! NL has all EN keys.');
} else {
  missingInNl.forEach(k => console.log(`  ${k}`));
}

console.log(`\n--- MISSING IN ES (${missingInEs.length} keys) ---`);
if (missingInEs.length === 0) {
  console.log('None! ES has all EN keys.');
} else {
  missingInEs.forEach(k => console.log(`  ${k}`));
}

console.log(`\n--- EXTRA IN NL (not in EN) (${extraInNl.length} keys) ---`);
if (extraInNl.length === 0) {
  console.log('None.');
} else {
  extraInNl.forEach(k => console.log(`  ${k}`));
}

console.log(`\n--- EXTRA IN ES (not in EN) (${extraInEs.length} keys) ---`);
if (extraInEs.length === 0) {
  console.log('None.');
} else {
  extraInEs.forEach(k => console.log(`  ${k}`));
}

console.log('\n=== END OF AUDIT ===\n');
