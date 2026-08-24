const fs = require('fs');
const path = require('path');

const frontendSrc = path.resolve(__dirname, '../../frontend/src');

const HIGH_CONTRAST_BASE = 'w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm';

function refactorFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Replace labels that have muted text like text-slate-600 or text-slate-700 in form labels
  content = content.replace(/className="block text-xs font-bold text-slate-[567]00 mb-1"/g, 'className="block text-xs font-bold text-slate-900 mb-1"');
  content = content.replace(/className="block font-bold text-slate-[567]00 mb-1"/g, 'className="block font-bold text-slate-900 mb-1"');
  content = content.replace(/className="block font-semibold text-slate-[567]00 mb-1"/g, 'className="block font-bold text-slate-900 mb-1"');

  // 2. Replace input styles where text color is muted or border is light
  content = content.replace(
    /className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"/g,
    `className="${HIGH_CONTRAST_BASE}"`
  );
  content = content.replace(
    /className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"/g,
    `className="${HIGH_CONTRAST_BASE} text-xs"`
  );
  content = content.replace(
    /className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"/g,
    `className="${HIGH_CONTRAST_BASE} text-xs"`
  );
  content = content.replace(
    /className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2\.5 focus:ring-2 focus:ring-indigo-500"/g,
    `className="${HIGH_CONTRAST_BASE} text-xs"`
  );
  content = content.replace(
    /className="w-full text-xs font-medium rounded-xl border border-slate-300 p-2\.5"/g,
    `className="${HIGH_CONTRAST_BASE} text-xs"`
  );
  content = content.replace(
    /className="w-full text-xs font-bold rounded-xl border border-slate-300 p-2\.5 bg-slate-50"/g,
    `className="${HIGH_CONTRAST_BASE} text-xs"`
  );

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
      if (refactorFile(full)) {
        count++;
      }
    }
  });
  return count;
}

const total = walk(frontendSrc);
console.log(`\n🎉 High contrast applied across ${total} files!`);
