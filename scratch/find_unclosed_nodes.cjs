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

const endPos = content.length;

function walk(node, depth = 0) {
    // If a block/node is deemed to end at the end of the file,
    // and its children also end there, we can look for the narrowest (deepest) node that ends at the end of the file
    // but whose syntax indicates it wasn't closed.
    const start = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
    const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd());
    
    // Check if the node goes to the very end of the file (or close to it)
    const isAtEnd = node.getEnd() >= endPos - 20;

    if (isAtEnd) {
        console.log(`${'  '.repeat(depth)}Node: ${ts.SyntaxKind[node.kind]} at line ${start.line + 1}, col ${start.character + 1} -> ends at line ${end.line + 1}, col ${end.character + 1}`);
    }

    ts.forEachChild(node, child => walk(child, depth + 1));
}

walk(sourceFile);
