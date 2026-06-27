const fs = require('fs');
const content = fs.readFileSync('pages/admin/staff/BulkImport.tsx', 'utf8');

const stack = [];
let i = 0;
let lineNum = 1;
let colNum = 1;

function getNextChar() {
    if (i >= content.length) return null;
    const char = content[i];
    if (char === '\n') {
        lineNum++;
        colNum = 1;
    } else {
        colNum++;
    }
    i++;
    return char;
}

function peekNextChar() {
    if (i >= content.length) return null;
    return content[i];
}

while (i < content.length) {
    const curLine = lineNum;
    const curCol = colNum;
    const char = getNextChar();
    if (!char) break;

    // Ignore single-line comments
    if (char === '/' && peekNextChar() === '/') {
        getNextChar(); // consume '/'
        while (i < content.length) {
            const next = getNextChar();
            if (next === '\n') break;
        }
        continue;
    }

    // Ignore multi-line comments
    if (char === '/' && peekNextChar() === '*') {
        getNextChar(); // consume '*'
        while (i < content.length) {
            const next = getNextChar();
            if (next === '*' && peekNextChar() === '/') {
                getNextChar(); // consume '/'
                break;
            }
        }
        continue;
    }

    // Ignore single-quoted strings
    if (char === "'") {
        while (i < content.length) {
            const next = getNextChar();
            if (next === '\\') {
                getNextChar(); // skip escaped char
            } else if (next === "'") {
                break;
            }
        }
        continue;
    }

    // Ignore double-quoted strings
    if (char === '"') {
        while (i < content.length) {
            const next = getNextChar();
            if (next === '\\') {
                getNextChar(); // skip escaped char
            } else if (next === '"') {
                break;
            }
        }
        continue;
    }

    // Ignore template literals
    if (char === '`') {
        while (i < content.length) {
            const next = getNextChar();
            if (next === '\\') {
                getNextChar();
            } else if (next === '`') {
                break;
            } else if (next === '$' && peekNextChar() === '{') {
                getNextChar(); // consume '{'
                stack.push({ char: '${', line: lineNum, col: colNum - 2 });
            }
        }
        continue;
    }

    // Process brackets
    if (char === '{' || char === '(' || char === '[') {
        stack.push({ char, line: curLine, col: curCol });
    } else if (char === '}' || char === ')' || char === ']') {
        if (stack.length === 0) {
            console.log(`Unmatched closing ${char} at line ${curLine}, col ${curCol}`);
        } else {
            const last = stack.pop();
            const expected = { '}': '{', ')': '(', ']': '[' }[char];
            // if last is '${', it expects '}'
            if (char === '}' && last.char === '${') {
                // matched template literal insertion
            } else if (last.char !== expected) {
                console.log(`Mismatch: found ${char} at line ${curLine}, col ${curCol}, expected closing for ${last.char} from line ${last.line}, col ${last.col}`);
            }
        }
    }
}

if (stack.length > 0) {
    console.log(`Unclosed items left on stack: ${stack.length}`);
    for (let k = 0; k < stack.length; k++) {
        console.log(`Unclosed ${stack[k].char} at line ${stack[k].line}, col ${stack[k].col}`);
    }
} else {
    console.log('All brackets/braces balanced!');
}
