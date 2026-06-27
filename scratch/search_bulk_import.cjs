const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pages', 'admin', 'staff', 'BulkImport.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log('Searching for unresolved mapping commit:');
lines.forEach((line, index) => {
    if (line.includes('unresolvedMappings') || line.includes('auto-created') || line.includes('Create New Employee') || line.includes('autoCreated')) {
        console.log(`${index + 1}: ${line.trim()}`);
    }
});
