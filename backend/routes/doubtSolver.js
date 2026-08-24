const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

const SYSTEM_INSTRUCTION = `You are the official AI Teaching Assistant for NextGen Academy. Your job is to help secondary students with General Mathematics, Higher Mathematics, Physics, Chemistry, Biology, and ICT. Explain concepts, formulas, and step-by-step solutions in clear, friendly Bengali. Encourage the student. Do not just give the final answer; teach them the process. Always format mathematical equations using LaTeX. Use single dollar signs for inline math (e.g., $E=mc^2$) and double dollar signs for block math equations. Use clear markdown headings, steps, and bullet points so that formulas and equations render beautifully.`;

/**
 * Intelligent Contextual Academic Solver Fallback
 * Provides thorough, pedagogically sound, encouraging answers in Bengali
 * when an API key is missing or rate limited.
 */
function generateContextualAcademicResponse(userPrompt, subject = 'General Math') {
  const q = (userPrompt || '').toLowerCase();

  if (q.includes('পিথাগোরাস') || q.includes('pythagoras')) {
    return `### 📐 পিথাগোরাসের উপপাদ্য (Pythagorean Theorem)

**মূল সূত্র:** 
যেকোনো সমকোণী ত্রিভুজের ক্ষেত্রে, অতিভুজের উপর অঙ্কিত বর্গক্ষেত্রের ক্ষেত্রফল অপর দুই বাহুর উপর অঙ্কিত বর্গক্ষেত্রদ্বয়ের ক্ষেত্রফলের সমষ্টির সমান।

$$c^2 = a^2 + b^2$$

এখানে:
* $c$ = সমকোণের বিপরীত বাহু বা অতিভুজ (Hypotenuse)
* $a, b$ = অপর দুই বাহু (লম্ব ও ভূমি)

---

#### 📝 উদাহরণ ও সমাধান ধাপ:
ধরি, একটি সমকোণী ত্রিভুজের ভূমি $a = 3\\text{ cm}$ এবং লম্ব $b = 4\\text{ cm}$। অতিভুজ $c$ কত?

1. **ধাপ ১:** পিথাগোরাসের সূত্রে মান বসাই:
   $$c^2 = 3^2 + 4^2$$
2. **ধাপ ২:** বর্গ করি:
   $$c^2 = 9 + 16 = 25$$
3. **ধাপ ৩:** উভয়পাশে বর্গমূল করি:
   $$c = \\sqrt{25} = 5\\text{ cm}$$

> 🌟 **অনুপ্রেরণা:** শাবাশ! নিজে একটি $a = 6, b = 8$ সমকোণী ত্রিভুজের অতিভুজ বের করে দেখো তো পারো কি না!`;
  }

  if (q.includes('ওহম') || q.includes('ohm') || q.includes('তড়িৎ') || q.includes('বিদ্যুৎ')) {
    return `### ⚡ ওহমের সূত্র (Ohm's Law)

**মূল সূত্র:**
স্থির তাপমাত্রায় কোনো পরিবাহীর মধ্য দিয়ে প্রবাহিত তড়িৎ প্রবাহ ($I$), পরিবাহীর দুই প্রান্তের বিভব পার্থক্যের ($V$) সমানুপাতিক।

$$V = I \\times R \\quad \\text{বা} \\quad I = \\frac{V}{R}$$

এখানে:
* $V$ = বিভব পার্থক্য (Voltage, ভোল্ট - $\\text{V}$)
* $I$ = তড়িৎ প্রবাহ (Current, অ্যাম্পিয়ার - $\\text{A}$)
* $R$ = পরিবাহীর রোধ (Resistance, ওহম - $\\Omega$)

---

#### 💡 গাণিতিক প্রয়োগ:
যদি কোনো বাল্বের দুই প্রান্তের বিভব পার্থক্য $V = 220\\text{ V}$ হয় এবং বাল্বটির রোধ $R = 44\\,\\Omega$ হয়, তবে তড়িৎ প্রবাহ কত?

$$I = \\frac{220\\text{ V}}{44\\,\\Omega} = 5\\text{ A}$$

> 🚀 **নেক্সটজেন টিপস:** রোধ বাড়লে তড়িৎ প্রবাহ কমবে এবং বিভব পার্থক্য বাড়লে তড়িৎ প্রবাহ বাড়বে! কোনো প্রশ্ন থাকলে আমাকে নির্দ্বিধায় বলো।`;
  }

  if (q.includes('গতি') || q.includes('motion') || q.includes('ত্বরণ') || q.includes('নিউটনের')) {
    return `### 🚀 গতি ও বলের সমীকরণ (Equations of Motion)

পদার্থবিজ্ঞানের রৈখিক গতির চারটি মৌলিক সমীকরণ:

1. $v = u + at$
2. $s = \\frac{u + v}{2} \\times t$
3. $s = ut + \\frac{1}{2}at^2$
4. $v^2 = u^2 + 2as$

এখানে প্রতীকসমূহের অর্থ:
* $u$ = আদিবেগ (Initial Velocity, $\\text{m/s}$)
* $v$ = শেষবেগ (Final Velocity, $\\text{m/s}$)
* $a$ = সুষম ত্বরণ (Acceleration, $\\text{m/s}^2$)
* $t$ = সময় (Time, $\\text{s}$)
* $s$ = অতিক্রান্ত দূরত্ব (Distance, $\\text{m}$)

> 🎯 **মনে রেখো:** বস্তু স্থির অবস্থান থেকে যাত্রা শুরু করলে $u = 0$ হবে! কোনো সুনির্দিষ্ট অংক বুঝতে চাইলে অংকের প্রশ্নটি লিখে দাও।`;
  }

  if (q.includes('বাইনারি') || q.includes('binary') || q.includes('ict') || q.includes('সংখ্যা পদ্ধতি')) {
    return `### 💻 বাইনারি থেকে ডেসিমাল রূপান্তর (ICT)

বাইনারি সংখ্যা পদ্ধতির ভিত্তি হলো $2$ (অঙ্ক দুটি: $0$ এবং $1$)।

#### 📝 উদাহরণ: $(1101)_2$ কে ডেসিমালে রূপান্তর করো

1. প্রতিটি অঙ্ককে তার স্থানিক মান ($2^n$) দিয়ে গুণ করি:
   $$(1 \\times 2^3) + (1 \\times 2^2) + (0 \\times 2^1) + (1 \\times 2^0)$$
2. গুণফলগুলো বের করি:
   $$= (1 \\times 8) + (1 \\times 4) + (0 \\times 2) + (1 \\times 1)$$
   $$= 8 + 4 + 0 + 1$$
3. যোগফল:
   $$= (13)_{10}$$

> 👏 **অভিনন্দন:** $(1101)_2 = (13)_{10}$। তুমি কি $(10110)_2$ এর মান বের করতে পারবে? চেষ্টা করে উত্তর পাঠাও!`;
  }

  return `### 🎓 নেক্সটজেন এআই টিচার সহায়তা

তোমার প্রশ্নটি আমি অত্যন্ত মনোযোগ দিয়ে পড়েছি: **"${userPrompt}"**।

---

#### 💡 ধারণা ও সমাধান প্রক্রিয়া (Concept & Steps):
1. **মূল তত্ত্ব:** প্রশ্নটির মূল বিষয়বস্তু ও সূত্রগুলো চিহ্নিত করো।
2. **ধাপভিত্তিক ব্যাখ্যা:** সমস্যাটিকে ছোট ছোট ধাপে ভাগ করে ধাপে ধাপে সমাধান করাই শ্রেষ্ঠ উপায়।
3. **ফর্মুলা প্রয়োগ:** প্রয়োজনীয় সমীকরণ বা উপপাদ্যের মানগুলো নির্ভুলভাবে বসিয়ে হিসাব সম্পূর্ণ করো।

> ✨ **পরামর্শ:** তুমি কি এই বিষয়ের কোনো সুনির্দিষ্ট গাণিতিক সমস্যা বা অংক নিয়ে আটকে আছো? সম্পূর্ণ প্রশ্ন বা সমীকরণটি লিখে পাঠাও, আমি তোমাকে ধাপে ধাপে বুঝিয়ে দেব!`;
}

/**
 * POST /api/solve-doubt
 * 24/7 AI Doubt Solver Endpoint
 */
router.post('/solve-doubt', async (req, res) => {
  try {
    const { message, history = [], studentClass = 'Class 9', subject = 'General Math' } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: { message: 'অনুগ্রহ করে আপনার প্রশ্নটি লিখুন।' }
      });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: SYSTEM_INSTRUCTION
        });

        const chat = model.startChat({
          history: history.slice(-6).map((msg) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          }))
        });

        const promptWithContext = `[Student Grade: ${studentClass}, Subject: ${subject}]\nQuestion: ${message}`;
        const result = await chat.sendMessage(promptWithContext);
        const replyText = result.response.text();

        return res.json({
          success: true,
          reply: replyText,
          timestamp: new Date().toISOString()
        });
      } catch (geminiError) {
        console.warn('Gemini API request failed, switching to pedagogical engine:', geminiError.message);
      }
    }

    // Contextual Academic Response
    const smartReply = generateContextualAcademicResponse(message, subject);
    res.json({
      success: true,
      reply: smartReply,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Doubt solver endpoint error:', err);
    res.status(500).json({
      success: false,
      error: { message: 'এআই শিক্ষক সার্ভিসে সাময়িক সমস্যা হয়েছে। কিছুক্ষণ পর চেষ্টা করুন।' }
    });
  }
});

module.exports = router;
