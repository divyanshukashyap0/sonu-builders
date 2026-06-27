const ts = require('typescript');
const fs = require('fs');

const fileName = 'pages/admin/staff/BulkImport.tsx';
const content = fs.readFileSync(fileName, 'utf8');

const sourceFile = ts.createSourceFile(
    fileName,
    content,
    ts.ScriptTarget.Latest,
    true
);

const diagnostics = sourceFile.parseDiagnostics || [];
if (diagnostics.length > 0) {
    diagnostics.forEach(diag => {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(diag.start);
        console.log(`Parse Error at line ${line + 1}, col ${character + 1}: ${diag.messageText}`);
    });
} else {
    console.log("No syntax parse errors in AST!");
}
