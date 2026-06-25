const { Client } = require('pg');

async function testConnection(connectionString, name) {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log(`[${name}] SUCCESS!`);
    await client.end();
  } catch (err) {
    console.error(`[${name}] FAILED: ${err.message}`);
  }
}

async function main() {
  const password = 'd3vm4k11devmkmk'; // using what was in the .env
  const poolerUrl = `postgresql://postgres.twpouurnafutioosilyz:${password}@aws-1-us-east-1.pooler.supabase.com:5432/postgres`;
  const directUrl = `postgresql://postgres:${password}@db.twpouurnafutioosilyz.supabase.co:5432/postgres`;

  console.log('Testing Pooler URL (from .env)...');
  await testConnection(poolerUrl, 'Pooler URL');

  console.log('Testing Direct URL...');
  await testConnection(directUrl, 'Direct URL');
}

main();
