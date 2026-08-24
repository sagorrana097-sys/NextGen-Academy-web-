const fs = require('fs');
const path = require('path');

const filePath = 'C:\\Users\\my\\.gemini\\antigravity\\scratch\\nextgen-parent-portal\\frontend\\src\\pages\\AdminDashboard.jsx';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, index) => {
  if (line.includes('ভর্তি শ্রেণি') || line.includes('showClassDropdown') || line.includes('dropdownOpen') || line.includes('openClassDropdown') || line.includes('isClassDropdownOpen')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});
