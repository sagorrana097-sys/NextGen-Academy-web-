const fs = require('fs');
const path = require('path');

function walk(dir, results = []) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      walk(full, results);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('type="file"') || content.includes("type='file'") || content.includes('type=`file`')) {
        results.push(full);
      }
    }
  });
  return results;
}

const frontendSrc = path.resolve(__dirname, '../../frontend/src');
const files = walk(frontendSrc);
console.log(`Found ${files.length} files with file inputs:`);
files.forEach((f, idx) => {
  const rel = path.relative(frontendSrc, f);
  console.log(`${idx + 1}. ${rel}`);
});
