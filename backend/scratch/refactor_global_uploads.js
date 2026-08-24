const fs = require('fs');
const path = require('path');

const frontendSrc = path.resolve(__dirname, '../../frontend/src');

const GLOBAL_ACCEPT_STR = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.txt,.csv,.zip,image/*,audio/*,video/*';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace restrictive accept attributes
  // accept="image/*", accept=".pdf,.txt", accept=".pdf,.doc,.docx,.jpg,.jpeg,.png", etc.
  content = content.replace(/accept=["'](image\/\*|\.pdf,\.txt|\.pdf,\.doc[a-zA-Z0-9.,*\/_-]*)["']/g, `accept="${GLOBAL_ACCEPT_STR}"`);
  content = content.replace(/accept=\{['"](image\/\*|\.pdf,\.txt|\.pdf,\.doc[a-zA-Z0-9.,*\/_-]*)['"]\}/g, `accept="${GLOBAL_ACCEPT_STR}"`);

  // Replace maxMb props like maxMb={10}, maxMb={15}, maxMb={20}, maxMb={50} with maxMb={100}
  content = content.replace(/maxMb=\{[0-9]+\}/g, `maxMb={100}`);

  // Replace max file size checks like 8 * 1024 * 1024, 10 * 1024 * 1024, 15 * 1024 * 1024, 50 * 1024 * 1024
  content = content.replace(/[0-9]+\s*\*\s*1024\s*\*\s*1024/g, `100 * 1024 * 1024`);

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${path.relative(frontendSrc, filePath)}`);
    return true;
  }
  return false;
}

function walk(dir) {
  let count = 0;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      count += walk(full);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      if (processFile(full)) {
        count++;
      }
    }
  });
  return count;
}

const updatedCount = walk(frontendSrc);
console.log(`\n🎉 Total files refactored: ${updatedCount}`);
