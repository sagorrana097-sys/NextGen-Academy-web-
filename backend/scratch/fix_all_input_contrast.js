const fs = require('fs');
const path = require('path');

const frontendSrc = path.resolve(__dirname, '../../frontend/src');

// High contrast input classes
const HIGH_CONTRAST_INPUT = 'w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm';
const HIGH_CONTRAST_COMPACT = 'w-full bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm';

// 1. Refactor TeacherDashboard.jsx Exam Modal and forms
function updateTeacherDashboard() {
  const file = path.join(frontendSrc, 'pages/TeacherDashboard.jsx');
  let content = fs.readFileSync(file, 'utf8');

  // Exam Modal fields
  content = content.replace(
    /value=\{examForm\.titleBn\}\s+onChange=\{[^\}]+\}\s+placeholder="[^\"]+"\s+className="[^\"]+"/g,
    `value={examForm.titleBn}\n                    onChange={(e) => setExamForm({ ...examForm, titleBn: e.target.value })}\n                    placeholder="যেমন: বিজ্ঞান ১ম সাময়িক কুইজ"\n                    className="${HIGH_CONTRAST_INPUT}"`
  );

  content = content.replace(
    /value=\{examForm\.titleEn\}\s+onChange=\{[^\}]+\}\s+placeholder="[^\"]+"\s+className="[^\"]+"/g,
    `value={examForm.titleEn}\n                    onChange={(e) => setExamForm({ ...examForm, titleEn: e.target.value })}\n                    placeholder="e.g. Science 1st Term Quiz"\n                    className="${HIGH_CONTRAST_INPUT}"`
  );

  content = content.replace(
    /value=\{examForm\.subjectId\}\s+onChange=\{[^\}]+\}\s+className="[^\"]+"/g,
    `value={examForm.subjectId}\n                    onChange={(e) => setExamForm({ ...examForm, subjectId: e.target.value })}\n                    className="${HIGH_CONTRAST_INPUT}"`
  );

  content = content.replace(
    /value=\{examForm\.type\}\s+onChange=\{[^\}]+\}\s+className="[^\"]+"/g,
    `value={examForm.type}\n                    onChange={(e) => setExamForm({ ...examForm, type: e.target.value })}\n                    className="${HIGH_CONTRAST_INPUT}"`
  );

  content = content.replace(
    /value=\{examForm\.examDate\}\s+onChange=\{[^\}]+\}\s+className="[^\"]+"/g,
    `value={examForm.examDate}\n                    onChange={(e) => setExamForm({ ...examForm, examDate: e.target.value })}\n                    className="${HIGH_CONTRAST_COMPACT}"`
  );

  content = content.replace(
    /value=\{examForm\.startTime\}\s+onChange=\{[^\}]+\}\s+placeholder="[^\"]+"\s+className="[^\"]+"/g,
    `value={examForm.startTime}\n                    onChange={(e) => setExamForm({ ...examForm, startTime: e.target.value })}\n                    placeholder="11:00 AM"\n                    className="${HIGH_CONTRAST_COMPACT}"`
  );

  content = content.replace(
    /value=\{examForm\.durationMinutes\}\s+onChange=\{[^\}]+\}\s+className="[^\"]+"/g,
    `value={examForm.durationMinutes}\n                    onChange={(e) => setExamForm({ ...examForm, durationMinutes: Number(e.target.value) })}\n                    className="${HIGH_CONTRAST_COMPACT}"`
  );

  content = content.replace(
    /value=\{examForm\.totalMarks\}\s+onChange=\{[^\}]+\}\s+className="[^\"]+"/g,
    `value={examForm.totalMarks}\n                    onChange={(e) => setExamForm({ ...examForm, totalMarks: Number(e.target.value) })}\n                    className="${HIGH_CONTRAST_COMPACT}"`
  );

  content = content.replace(
    /value=\{examForm\.passMarks\}\s+onChange=\{[^\}]+\}\s+className="[^\"]+"/g,
    `value={examForm.passMarks}\n                    onChange={(e) => setExamForm({ ...examForm, passMarks: Number(e.target.value) })}\n                    className="${HIGH_CONTRAST_COMPACT}"`
  );

  content = content.replace(
    /value=\{examForm\.instructions\}\s+onChange=\{[^\}]+\}\s+placeholder="[^\"]+"\s+className="[^\"]+"/g,
    `value={examForm.instructions}\n                  onChange={(e) => setExamForm({ ...examForm, instructions: e.target.value })}\n                  placeholder="পরীক্ষার্থীদের জন্য বিশেষ নির্দেশনা..."\n                  className="${HIGH_CONTRAST_INPUT}"`
  );

  content = content.replace(
    /value=\{q\.questionBn\}\s+onChange=\{[^\}]+\}\s+placeholder="[^\"]+"\s+className="[^\"]+"/g,
    `value={q.questionBn}\n                          onChange={(e) => handleMCQQuestionChange(qIdx, 'questionBn', e.target.value)}\n                          placeholder="প্রশ্নের বিবরণ লিখুন..."\n                          className="${HIGH_CONTRAST_INPUT}"`
  );

  content = content.replace(
    /value=\{opt\}\s+onChange=\{[^\}]+\}\s+placeholder=\{`[^\`]+`\}\s+className="[^\"]+"/g,
    `value={opt}\n                                onChange={(e) => handleMCQOptionChange(qIdx, optIdx, e.target.value)}\n                                placeholder={\`অপশন \${optIdx + 1} (\${['ক', 'খ', 'গ', 'ঘ'][optIdx] || optIdx + 1})\`}\n                                className="flex-1 bg-white border border-slate-300 text-slate-900 font-semibold placeholder:text-slate-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm text-xs"`
  );

  content = content.replace(
    /value=\{q\.explanation\s*\|\|\s*''\}\s+onChange=\{[^\}]+\}\s+placeholder="[^\"]+"\s+className="[^\"]+"/g,
    `value={q.explanation || ''}\n                          onChange={(e) => handleMCQQuestionChange(qIdx, 'explanation', e.target.value)}\n                          placeholder="সঠিক উত্তরের ব্যাখ্যা (ঐচ্ছিক)..."\n                          className="${HIGH_CONTRAST_INPUT}"`
  );

  content = content.replace(
    /value=\{examForm\.questionFileUrl\s*\|\|\s*''\}\s+onChange=\{[^\}]+\}\s+placeholder="[^\"]+"\s+className="[^\"]+"/g,
    `value={examForm.questionFileUrl || ''}\n                      onChange={(e) => setExamForm({ ...examForm, questionFileUrl: e.target.value })}\n                      placeholder="https://nextgen.edu.bd/downloads/exams/sample-question.pdf"\n                      className="${HIGH_CONTRAST_INPUT}"`
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log('✅ Updated TeacherDashboard.jsx Exam Modal inputs');
}

updateTeacherDashboard();
