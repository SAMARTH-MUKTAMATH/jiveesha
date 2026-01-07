const fs = require('fs');
const path = require('path');

const migrationPath = path.join(__dirname, 'prisma', 'migrations', '20260108000000_init_postgres', 'migration.sql');

// Read the file
let content = fs.readFileSync(migrationPath, 'utf8');

// Remove BOM if present
if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
}

// Write back without BOM
fs.writeFileSync(migrationPath, content, 'utf8');

console.log('BOM removed successfully from migration.sql');
