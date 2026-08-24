const fs = require('fs');
const path = require('path');

function searchInDir(dir, queryRegex) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const fullPath = path.join(dir, f.name);
    if (f.isDirectory()) {
      searchInDir(fullPath, queryRegex);
    } else if (f.name.endsWith('.jsx') || f.name.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const matches = content.match(queryRegex);
      if (matches) {
        console.log(`Found in: ${fullPath} (${matches.length} matches)`);
        const lines = content.split('\n');
        lines.forEach((l, idx) => {
          if (queryRegex.test(l)) {
            console.log(`  Line ${idx + 1}: ${l.trim().slice(0, 120)}`);
          }
        });
      }
    }
  }
}

console.log('Searching for class category / dropdown patterns...');
searchInDir('C:\\Users\\my\\.gemini\\antigravity\\scratch\\nextgen-parent-portal\\frontend\\src', /প্রি-প্রাইমারি|Secondary|ভর্তি শ্রেণি|onBlur|selectedClass/i);
