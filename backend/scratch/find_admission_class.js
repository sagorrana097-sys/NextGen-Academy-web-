const fs = require('fs');
const path = require('path');

function searchAllFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const fullPath = path.join(dir, f.name);
    if (f.isDirectory()) {
      searchAllFiles(fullPath);
    } else if (f.name.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('ভর্তি শ্রেণি') || content.includes('ভর্তি শ্রেণী') || content.includes('Admission Class')) {
        console.log('Match found in:', fullPath);
      }
    }
  }
}

searchAllFiles('C:\\Users\\my\\.gemini\\antigravity\\scratch\\nextgen-parent-portal\\frontend\\src');
