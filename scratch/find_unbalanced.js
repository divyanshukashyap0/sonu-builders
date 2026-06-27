const fs = require('fs');
const content = fs.readFileSync('pages/admin/staff/BulkImport.tsx', 'utf8');

const stack = [];
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '{' || char === '(' || char === '[') {
            stack.push({ char, line: i + 1, col: j + 1 });
        } else if (char === '}' || char === ')' || char === ']') {
            if (stack.length === 0) {
                console.log(`Unmatched closing ${char} at line ${i + 1}, col ${j + 1}`);
            } else {
                const last = stack.pop();
                const expected = { '}': '{', ')': '(', ']': '[' }[char];
                if (last.char !== expected) {
                    console.log(`Mismatch: found ${char} at line ${i + 1}, col ${j + 1}, expected closing for ${last.char} from line ${last.line}, col ${last.col}`);
                }
            }
        }
    }
}

if (stack.length > 0) {
    console.log(`Unclosed items left on stack: ${stack.length}`);
    for (let k = Math.max(0, stack.length - 10); k < stack.length; k++) {
        console.log(`Unclosed ${stack[k].char} at line ${stack[k].line}, col ${stack[k].col}`);
    }
} else {
    console.log('All brackets/braces balanced (simple character check)!');
}
