/**
 * Runs every SQL file under src/apps/<app>/plugins/**\/sql/ against a Postgres connection
 * defined in the app's .env (DATABASE_CONFIG_POSTGRES_<CONNECTION_ID>).
 *
 * Usage: yarn migrate:db [app] [connectionId]
 * Default: yarn migrate:db catalyst-cerebrum cerebrum_tutorial_pet
 */
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const app = process.argv[2] || 'catalyst-cerebrum';
const connectionId = process.argv[3] || 'cerebrum_tutorial_pet';
const appDir = path.join(__dirname, '..', 'src', 'apps', app);
const envKey = `DATABASE_CONFIG_POSTGRES_${connectionId.toUpperCase()}`;

function findSqlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return findSqlFiles(full);
    return entry.name.endsWith('.sql') && path.basename(dir) === 'sql' ? [full] : [];
  });
}

function readConfig() {
  let raw = process.env[envKey];
  if (!raw) {
    const envFile = path.join(appDir, '.env');
    if (!fs.existsSync(envFile)) throw new Error(`Missing ${envFile}`);
    const line = fs.readFileSync(envFile, 'utf8').split(/\r?\n/).find((l) => l.startsWith(`${envKey}=`));
    if (!line) throw new Error(`${envKey} not found in ${envFile}`);
    raw = line.slice(line.indexOf('=') + 1);
  }
  return JSON.parse(raw);
}

async function main() {
  const files = findSqlFiles(path.join(appDir, 'plugins')).sort();
  if (!files.length) throw new Error(`No sql/*.sql files found under ${appDir}${path.sep}plugins`);

  const c = readConfig();
  const client = new Client({ host: c.host, port: c.port, user: c.username, password: c.password, database: c.database });
  await client.connect();
  try {
    for (const file of files) {
      await client.query(fs.readFileSync(file, 'utf8'));
      console.log(`OK  ${path.relative(path.join(__dirname, '..'), file)}`);
    }
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(`FAILED: ${e.message}`);
  process.exit(1);
});
