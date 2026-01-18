const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
const db = new Database(dbPath, { readonly: true });

console.log('=== SQLite Tables ===');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables.map(t => t.name));

console.log('\n=== Lead table ===');
try {
    const leads = db.prepare('SELECT * FROM Lead').all();
    console.log('Leads count:', leads.length);
    console.log('Leads data:', JSON.stringify(leads, null, 2));
} catch (e) {
    console.log('Error reading Lead:', e.message);
}

console.log('\n=== LandingContent table ===');
try {
    const content = db.prepare('SELECT * FROM LandingContent').all();
    console.log('Content count:', content.length);
    console.log('Content data:', JSON.stringify(content, null, 2));
} catch (e) {
    console.log('Error reading LandingContent:', e.message);
}

console.log('\n=== Admin table ===');
try {
    const admins = db.prepare('SELECT * FROM Admin').all();
    console.log('Admins count:', admins.length);
    console.log('Admins data:', JSON.stringify(admins, null, 2));
} catch (e) {
    console.log('Error reading Admin:', e.message);
}

db.close();
