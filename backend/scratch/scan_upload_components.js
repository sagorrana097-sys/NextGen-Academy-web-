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
      if (content.includes('accept=') || content.includes('FileReader') || content.includes('upload') || content.includes('UniversalFileUploader') || content.includes('DualFileUploadInput')) {
        results.push({ file: full, hasAccept: content.includes('accept='), hasFileReader: content.includes('FileReader'), hasUploader: content.includes('UniversalFileUploader') || content.includes('DualFileUploadInput') });
      }
    }
  });
  return results;
}

const frontendSrc = path.resolve(__dirname, '../../frontend/src');
const files = walk(frontendSrc);
console.log(`Found ${files.length} upload-related files:`);
files.forEach((f, idx) => {
  const rel = path.relative(frontendSrc, f.file);
  console.log(`${idx + 1}. ${rel} | accept=${f.hasAccept} | FileReader=${f.hasFileReader} | hasUploader=${f.hasUploader}`);
});
