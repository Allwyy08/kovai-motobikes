const { generateUUID } = require('../src/lib/uuid');

// Simulate non-secure context where crypto.randomUUID is undefined
const originalRandomUUID = global.crypto.randomUUID;
delete global.crypto.randomUUID;

console.log('Testing generateUUID without crypto.randomUUID:');
for (let i = 0; i < 5; i++) {
  const uuid = generateUUID();
  console.log(`UUID ${i+1}:`, uuid);
  // Verify format 8-4-4-4-12
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(uuid)) {
    console.error('INVALID UUID FORMAT:', uuid);
    process.exit(1);
  }
}
console.log('ALL UUIDs ARE VALID RFC4122 v4 FORMAT!');
