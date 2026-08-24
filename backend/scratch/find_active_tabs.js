const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\my\\.gemini\\antigravity\\scratch\\nextgen-parent-portal\\frontend\\src\\pages\\AdminDashboard.jsx', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('activeTab ===')) {
    console.log(`Line ${i + 1}: ${l.trim()}`);
  }
});
