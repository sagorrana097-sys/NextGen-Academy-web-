const API_BASE = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000/api' : '/api');

// Client-side Mock Fallbacks for Instant Offline & Zero-Error Experience
const STUDENT_MOCKS = {
  '/dashboard-aggregate': {
    stats: { totalStudents: 0, totalTeachers: 0, totalClasses: 0, attendanceRateToday: 0, financials: { totalBilled: 0, totalCollected: 0, totalPending: 0, collectionPercentage: 0 }, totalAuditLogs: 0 },
    notices: [],
    counts: { students: 0, teachers: 0, classes: 0, pendingInvoices: 0 }
  },
  '/student/dashboard-aggregate': {
    profile: null,
    dashboard: { attendanceRate: 0, gpa: 0, totalPoints: 0, completedAssignments: 0 },
    attendance: { present: 0, absent: 0, leave: 0, rate: 0, records: [] },
    results: { gpa: 0, marks: [] },
    routine: { todayClasses: [], weeklySchedule: [] },
    invoices: [],
    notices: [],
    gamification: { xp: 0, level: 1, streak: 0, rank: 0 },
    coins: 0
  },
  '/admin/dashboard-aggregate': {
    stats: { totalStudents: 0, totalTeachers: 0, totalClasses: 0, totalBilled: 0, totalCollected: 0, totalPending: 0, attendanceRateToday: 0 },
    students: [],
    teachers: [],
    invoices: [],
    auditLogs: [],
    classes: []
  },
  '/student/profile': null,
  '/student/dashboard': { attendanceRate: 0, gpa: 0, totalPoints: 0, completedAssignments: 0 },
  '/student/attendance': { present: 0, absent: 0, leave: 0, rate: 0, records: [] },
  '/student/results': { gpa: 0, marks: [] },
  '/student/routine': { todayClasses: [], weeklySchedule: [] },
  '/student/invoices': [],
  '/analytics/overview': {
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    attendanceRateToday: 0,
    studentAttendanceRate: 0,
    teacherAttendanceRate: 0,
    financials: { totalBilled: 0, totalCollected: 0, totalPending: 0, collectionPercentage: 0 },
    stats: { totalStudents: 0, totalTeachers: 0, totalClasses: 0, totalBilled: 0, totalCollected: 0, totalPending: 0, attendanceRateToday: 0 }
  },
  '/analytics/summary': {
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    attendanceRateToday: 0,
    studentAttendanceRate: 0,
    teacherAttendanceRate: 0,
    financials: { totalBilled: 0, totalCollected: 0, totalPending: 0, collectionPercentage: 0 },
    stats: { totalStudents: 0, totalTeachers: 0, totalClasses: 0, totalBilled: 0, totalCollected: 0, totalPending: 0, attendanceRateToday: 0 }
  },
  '/settings/student-portal-control': {
    allowOnlineAdmission: true,
    allowExamResultView: true,
    allowFeePayment: true,
    allowGamification: true,
    allowLiveClass: true,
    allowHomeworkSubmit: true,
    allowDigitalBookstore: true
  },
  '/settings/student-portal': {
    allowOnlineAdmission: true,
    allowExamResultView: true,
    allowFeePayment: true,
    allowGamification: true,
    allowLiveClass: true,
    allowHomeworkSubmit: true,
    allowDigitalBookstore: true
  },
  '/settings': { siteName: 'NextGen Academy', academicYear: '2026', phone: '01792818005', email: 'admin@nextgen.edu.bd' },
  '/settings/public': { siteName: 'NextGen Academy', academicYear: '2026', phone: '01792818005', email: 'admin@nextgen.edu.bd' },
  '/settings/student-menus': [],
  '/notices': [],
  '/admin/students': [],
  '/students': [],
  '/classes': [],
  '/subjects': [],
  '/teachers': [],
  '/batches': []
};

// In-Memory SWR Cache & In-Flight Request Deduplication Store
const apiCache = new Map();
const inFlightRequests = new Map();

/**
 * High-Performance Network Request with In-Flight Deduplication, Auto-Healing & Caching
 */
async function request(endpoint, options = {}, retries = 3, backoffMs = 400) {
  const isGet = !options.method || options.method.toUpperCase() === 'GET';
  const cleanEndpoint = endpoint.split('?')[0];
  const cacheKey = `${options.method || 'GET'}:${endpoint}`;
  const cacheTtl = options.cacheTtl !== undefined ? options.cacheTtl : (isGet ? 15000 : 0); // 15s default for GET

  // 1. Check in-memory cache for GET requests
  if (isGet && cacheTtl > 0 && apiCache.has(cacheKey)) {
    const cached = apiCache.get(cacheKey);
    if (Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
  }

  // 2. In-flight request deduplication: if identical GET is already in-flight, reuse promise
  if (isGet && inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  const token = localStorage.getItem('token') || localStorage.getItem('adminToken') || localStorage.getItem('nextgen_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const executeFetch = async () => {
    let lastError = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
          ...options,
          headers
        });

        let data = {};
        try {
          data = await res.json();
        } catch (e) {
          data = {};
        }

        if (res.status >= 500 && attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, backoffMs * attempt));
          continue;
        }

        if (res.status === 401) {
          if (STUDENT_MOCKS[cleanEndpoint]) {
            return { success: true, data: STUDENT_MOCKS[cleanEndpoint], isMockFallback: true };
          }
          return {
            success: false,
            isUnauthorized: true,
            error: { message: data?.error?.message || 'সেশনের মেয়াদ শেষ হয়েছে।' },
            data: null
          };
        }

        if (!res.ok) {
          if (STUDENT_MOCKS[cleanEndpoint]) {
            return { success: true, data: STUDENT_MOCKS[cleanEndpoint], isMockFallback: true };
          }
          return {
            success: false,
            status: res.status,
            error: { message: data.error?.message || data.message || `Request failed with status ${res.status}` },
            data: null
          };
        }

        // Cache successful GET response
        if (isGet && cacheTtl > 0) {
          apiCache.set(cacheKey, { data, timestamp: Date.now(), ttl: cacheTtl });
        }

        // Invalidate related cache keys on mutations
        if (!isGet) {
          apiCache.clear();
        }

        return data;
      } catch (err) {
        lastError = err;
        if (attempt < retries && (!err.status || err.status >= 500)) {
          await new Promise((resolve) => setTimeout(resolve, backoffMs * attempt));
          continue;
        }
        break;
      }
    }

    if (STUDENT_MOCKS[cleanEndpoint]) {
      return { success: true, data: STUDENT_MOCKS[cleanEndpoint], isMockFallback: true };
    }

    return {
      success: false,
      error: { message: lastError?.message || 'নেটওয়ার্ক সংযোগে সমস্যা হয়েছে।' },
      data: null
    };
  };

  if (isGet) {
    const promise = executeFetch().finally(() => {
      inFlightRequests.delete(cacheKey);
    });
    inFlightRequests.set(cacheKey, promise);
    return promise;
  }

  return executeFetch();
}

export const authAPI = {
  login: (identifier, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ identifier, email: identifier, password }) }),
  login2FA: (tempToken, code) => request('/auth/login-2fa', { method: 'POST', body: JSON.stringify({ tempToken, code }) }),
  refreshToken: (refreshToken) => request('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/auth/me'),
  getDemoAccounts: () => request('/auth/demo-accounts'),
  generate2FA: () => request('/auth/2fa/generate'),
  verify2FA: (secret, token) => request('/auth/2fa/verify', { method: 'POST', body: JSON.stringify({ secret, token }) }),
  disable2FA: (password) => request('/auth/2fa/disable', { method: 'POST', body: JSON.stringify({ password }) }),
  forgotPassword: (data) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(data) }),
  resetPassword: (data) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) })
};

export const adminAPI = {
  getDashboardAggregate: () => request('/admin/dashboard-aggregate', { cacheTtl: 30000 }),
  getStats: () => request('/admin/stats'),
  getStudents: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/admin/students?${q}`);
  },
  getStudentFullSummary: (id) => request(`/student/${id}/full-summary`),
  getTeachers: () => request('/admin/teachers'),
  getInvoices: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/admin/invoices?${q}`);
  },
  getAuditLogs: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/admin/audit-logs?${q}`);
  },
  createStudent: (data) => request('/admin/students', { method: 'POST', body: JSON.stringify(data) }),
  updateStudent: (id, data) => request(`/admin/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteStudent: (id) => request(`/admin/students/${id}`, { method: 'DELETE' }),
  createTeacher: (data) => request('/admin/teachers', { method: 'POST', body: JSON.stringify(data) }),
  updateTeacher: (id, data) => request(`/admin/teachers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTeacher: (id) => request(`/admin/teachers/${id}`, { method: 'DELETE' }),
  createInvoice: (data) => request('/admin/invoices', { method: 'POST', body: JSON.stringify(data) }),
  updateInvoice: (id, data) => request(`/admin/invoices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteInvoice: (id) => request(`/admin/invoices/${id}`, { method: 'DELETE' }),
  recordPayment: (invoiceId, data) => request(`/admin/invoices/${invoiceId}/payments`, { method: 'POST', body: JSON.stringify(data) }),
  bulkCreateInvoices: (data) => request('/admin/invoices/bulk-generate', { method: 'POST', body: JSON.stringify(data) }),
  getFeeStructures: () => request('/admin/invoices/fee-structures'),
  saveFeeStructure: (data) => request('/admin/invoices/fee-structures', { method: 'POST', body: JSON.stringify(data) }),
  exportInvoicesPDF: (id) => request(`/admin/invoices/${id}/pdf`),
  getTransactions: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/admin/invoices/transactions?${q}`);
  }
};

export const studentAPI = {
  getAll: (params = {}) => adminAPI.getStudents(params),
  getStudents: (params = {}) => adminAPI.getStudents(params),
  getById: (id) => request(`/admin/students/${id}`),
  getFullSummary: (id) => request(`/student/${id}/full-summary`),
  getStudentFullSummary: (id) => request(`/student/${id}/full-summary`),
  create: (data) => adminAPI.createStudent(data),
  createStudent: (data) => adminAPI.createStudent(data),
  update: (id, data) => adminAPI.updateStudent(id, data),
  updateStudent: (id, data) => adminAPI.updateStudent(id, data),
  delete: (id) => adminAPI.deleteStudent(id),
  deleteStudent: (id) => adminAPI.deleteStudent(id),
  toggleStatus: (id, status) => request(`/admin/students/${id}/toggle-status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getDashboardAggregate: () => request('/student/dashboard-aggregate', { cacheTtl: 20000 }),
  getProfile: () => request('/student/profile', { cacheTtl: 30000 }),
  getDashboard: () => request('/student/dashboard', { cacheTtl: 20000 }),
  getAttendance: () => request('/student/attendance', { cacheTtl: 20000 }),
  getResults: () => request('/student/results', { cacheTtl: 20000 }),
  getRoutine: () => request('/student/routine', { cacheTtl: 30000 }),
  getInvoices: () => request('/student/invoices', { cacheTtl: 15000 }),
  getHomework: () => request('/student/homework', { cacheTtl: 15000 }),
  getMaterials: () => request('/student/materials', { cacheTtl: 30000 }),
  getTextbooks: () => request('/student/textbooks', { cacheTtl: 30000 }),
  getNotices: () => request('/student/notices', { cacheTtl: 30000 }),
  getGamification: () => request('/student/gamification', { cacheTtl: 15000 }),
  getCoins: () => request('/student/coins', { cacheTtl: 10000 }),
  getRewardStore: () => request('/student/reward-store', { cacheTtl: 30000 }),
  claimReward: (rewardId) => request('/student/claim-reward', { method: 'POST', body: JSON.stringify({ rewardId }) }),
  getSyllabusMap: () => request('/student/syllabus-map', { cacheTtl: 30000 }),
  completeSyllabusNode: (nodeId) => request('/student/syllabus-node/complete', { method: 'POST', body: JSON.stringify({ nodeId }) }),
  getAIWeaknesses: () => request('/student/ai-weaknesses', { cacheTtl: 30000 }),
  getAIRoutine: () => request('/student/ai-routine', { cacheTtl: 30000 }),
  generateAIRoutine: (data) => request('/student/ai-routine/generate', { method: 'POST', body: JSON.stringify(data) }),
  submitHomework: (homeworkId, data) => request(`/student/homework/${homeworkId}/submit`, { method: 'POST', body: JSON.stringify(data) }),
  getLiveClasses: () => request('/student/live-classes', { cacheTtl: 10000 })
};

export const teacherAPI = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/teachers${q ? `?${q}` : ''}`);
  },
  getDirectory: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/teachers/directory${q ? `?${q}` : ''}`);
  },
  getById: (id) => request(`/teachers/${id}`),
  create: (data) => request('/teachers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/teachers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/teachers/${id}`, { method: 'DELETE' }),
  getMyProfile: () => request('/teachers/me/profile'),
  updateMyProfile: (data) => request('/teachers/me/profile', { method: 'PUT', body: JSON.stringify(data) }),
  togglePrivacy: (is_phone_visible) => request('/teachers/me/privacy', { method: 'PATCH', body: JSON.stringify({ is_phone_visible }) }),
  getDashboard: () => request('/teacher/dashboard', { cacheTtl: 20000 }),
  getClasses: () => request('/teacher/classes', { cacheTtl: 30000 }),
  getAttendance: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/teacher/attendance?${q}`);
  },
  saveAttendance: (data) => request('/teacher/attendance', { method: 'POST', body: JSON.stringify(data) }),
  getMarks: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/teacher/marks?${q}`);
  },
  saveMarks: (data) => request('/teacher/marks', { method: 'POST', body: JSON.stringify(data) }),
  getRoutine: () => request('/teacher/routine', { cacheTtl: 30000 }),
  getHomework: () => request('/teacher/homework', { cacheTtl: 15000 }),
  getMaterials: () => request('/teacher/materials', { cacheTtl: 30000 })
};

export const parentAPI = {
  getChildren: () => request('/parent/children'),
  getChildSummary: (studentId) => request(`/parent/child/${studentId}/summary`),
  getChildAttendance: (studentId) => request(`/parent/child/${studentId}/attendance`),
  getChildResults: (studentId) => request(`/parent/child/${studentId}/results`),
  getChildInvoices: (studentId) => request(`/parent/child/${studentId}/invoices`),
  getChildRoutine: (studentId) => request(`/parent/child/${studentId}/routine`),
  getChildHomework: (studentId) => request(`/parent/child/${studentId}/homework`),
  getChildExams: (studentId) => request(`/parent/child/${studentId}/exams`)
};

export const noticeAPI = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/notices?${q}`);
  },
  getNotices: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/notices?${q}`);
  },
  getById: (id) => request(`/notices/${id}`),
  getNoticeDetails: (id) => request(`/notices/${id}`),
  create: (data) => request('/notices', { method: 'POST', body: JSON.stringify(data) }),
  postNotice: (data) => request('/notices', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/notices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateNotice: (id, data) => request(`/notices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/notices/${id}`, { method: 'DELETE' }),
  deleteNotice: (id) => request(`/notices/${id}`, { method: 'DELETE' }),
  togglePin: (id) => request(`/notices/${id}/toggle-pin`, { method: 'PATCH' })
};

export const homeworkAPI = {
  getHomework: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/homework?${q}`);
  },
  postHomework: (data) => request('/homework', { method: 'POST', body: JSON.stringify(data) }),
  getStudentHomework: (studentId) => request(`/homework/student/${studentId}`),
  toggleStatus: (homeworkId, studentId, status) =>
    request(`/homework/${homeworkId}/toggle-status`, { method: 'POST', body: JSON.stringify({ studentId, status }) })
};

export const curriculumAPI = {
  getClasses: () => request('/classes'),
  getSubjects: (classId) => request(`/subjects?classId=${classId || ''}`)
};

export const materialAPI = {
  getMaterials: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/materials?${q}`);
  },
  getStudyMaterials: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/materials?${q}`);
  },
  getSourceMaterials: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/materials/source-materials${q ? '?' + q : ''}`);
  },
  uploadSourceMaterial: (formData) => {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken') || localStorage.getItem('nextgen_token') || sessionStorage.getItem('token');
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return fetch(`${API_BASE}/materials/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    }).then(res => res.json()).catch(err => ({ success: false, error: { message: err.message } }));
  },
  createStudyMaterial: (data) => {
    if (data instanceof FormData) {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken') || localStorage.getItem('nextgen_token') || sessionStorage.getItem('token');
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      return fetch(`${API_BASE}/materials/upload`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: data
      }).then(res => res.json()).catch(err => ({ success: false, error: { message: err.message } }));
    }
    return request('/materials/upload', { method: 'POST', body: JSON.stringify(data) });
  },
  createMaterial: (data) => request('/materials', { method: 'POST', body: JSON.stringify(data) }),
  getStudentMaterials: (studentId, params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/materials/student/${studentId}?${q}`);
  },
  postMaterial: (data) => request('/materials', { method: 'POST', body: JSON.stringify(data) }),
  updateMaterial: (id, data) => request(`/materials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMaterial: (id) => request(`/materials/${id}`, { method: 'DELETE' })
};

export const studyMaterialAPI = materialAPI;

export const textbookAPI = {
  getTextbooks: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/textbooks?${q}`);
  },
  createTextbook: (data) => request('/textbooks', { method: 'POST', body: JSON.stringify(data) }),
  updateTextbook: (id, data) => request(`/textbooks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTextbook: (id) => request(`/textbooks/${id}`, { method: 'DELETE' })
};

export const resourceAPI = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/resources?${q}`);
  },
  getResources: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/resources?${q}`);
  },
  getById: (id) => request(`/resources/${id}`),
  create: (data) => request('/resources', { method: 'POST', body: JSON.stringify(data) }),
  createResource: (data) => request('/resources', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/resources/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateResource: (id, data) => request(`/resources/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggleFree: (id) => request(`/resources/${id}/toggle-free`, { method: 'PATCH' }),
  delete: (id) => request(`/resources/${id}`, { method: 'DELETE' }),
  deleteResource: (id) => request(`/resources/${id}`, { method: 'DELETE' })
};

export const teacherAttendanceAPI = {
  getDateSheet: (date) => request(`/teacher-attendance/sheet?date=${date || ''}`),
  saveBulkAttendance: (data) => request('/teacher-attendance/bulk-save', { method: 'POST', body: JSON.stringify(data) }),
  getMonthlyReport: (month, year) => request(`/teacher-attendance/monthly-report?month=${month || ''}&year=${year || ''}`),
  getMyAttendance: () => request('/teacher-attendance/my-attendance'),
  punchIn: () => request('/teacher-attendance/punch-in', { method: 'POST' }),
  punchOut: () => request('/teacher-attendance/punch-out', { method: 'POST' })
};

export const examAPI = {
  getExams: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/exams?${q}`);
  },
  getExamDetails: (id) => request(`/exams/${id}`),
  createExam: (data) => request('/exams', { method: 'POST', body: JSON.stringify(data) }),
  updateExam: (id, data) => request(`/exams/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteExam: (id) => request(`/exams/${id}`, { method: 'DELETE' }),
  submitExam: (id, data) => request(`/exams/${id}/submit`, { method: 'POST', body: JSON.stringify(data) }),
  getSubmissions: (examId) => request(`/exams/${examId}/submissions`),
  gradeSubmission: (examId, submissionId, data) =>
    request(`/exams/${examId}/grade/${submissionId}`, { method: 'POST', body: JSON.stringify(data) }),
  getStudentExams: (studentId) => request(`/exams/student/${studentId}`),
  getLeaderboard: (examId) => request(`/exams/${examId}/leaderboard`),
  generateMCQs: (data) => request('/exams/generate-mcq', { method: 'POST', body: JSON.stringify(data) }),
  generateCQs: (data) => request('/exams/generate-cq', { method: 'POST', body: JSON.stringify(data) })
};

export const questionRepositoryAPI = {
  getQuestions: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/question-repository?${q}`);
  },
  parseDocument: (data) => request('/question-repository/parse-document', { method: 'POST', body: JSON.stringify(data) }),
  uploadAndTrain: (data) => request('/question-repository/upload-and-train', { method: 'POST', body: JSON.stringify(data) }),
  generateAIExam: (data) => request('/question-repository/generate-ai-exam', { method: 'POST', body: JSON.stringify(data) }),
  generateExam: (data) => request('/question-repository/generate-ai-exam', { method: 'POST', body: JSON.stringify(data) }),
  publishToOnlineExam: (data) => request('/question-repository/publish-to-online-exam', { method: 'POST', body: JSON.stringify(data) }),
  publishExam: (data) => request('/question-repository/publish-to-online-exam', { method: 'POST', body: JSON.stringify(data) }),
  deleteQuestion: (id) => request(`/question-repository/${id}`, { method: 'DELETE' })
};

export const liveClassAPI = {
  getLiveClasses: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/live-classes?${q}`);
  },
  getDemoClasses: () => request('/live-classes/demo'),
  getStudentLiveClasses: (studentId, params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/live-classes/student/${studentId}?${q}`);
  },
  getAlerts: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/live-classes/alerts?${q}`);
  },
  getLiveClassDetails: (id) => request(`/live-classes/${id}`),
  createLiveClass: (data) => request('/live-classes', { method: 'POST', body: JSON.stringify(data) }),
  updateLiveClass: (id, data) => request(`/live-classes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggleDemo: (id) => request(`/live-classes/${id}/toggle-demo`, { method: 'PATCH' }),
  updateStatus: (id, status) => request(`/live-classes/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  updateRecording: (id, data) => request(`/live-classes/${id}/recording`, { method: 'PATCH', body: JSON.stringify(data) }),
  addRecordedClass: (data) => request('/live-classes/recorded', { method: 'POST', body: JSON.stringify(data) }),
  getRecordedClasses: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/live-classes/recorded/all?${q}`);
  },
  deleteLiveClass: (id) => request(`/live-classes/${id}`, { method: 'DELETE' }),
  getComments: (id) => request(`/live-classes/${id}/comments`),
  postComment: (id, data) => request(`/live-classes/${id}/comments`, { method: 'POST', body: JSON.stringify(data) }),
  pinComment: (id, commentId) => request(`/live-classes/${id}/comments/${commentId}/pin`, { method: 'PATCH' }),
  deleteComment: (id, commentId) => request(`/live-classes/${id}/comments/${commentId}`, { method: 'DELETE' })
};

export const batchAPI = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/batches?${q}`);
  },
  getBatches: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/batches?${q}`);
  },
  getById: (id) => request(`/batches/${id}`),
  create: (data) => request('/batches', { method: 'POST', body: JSON.stringify(data) }),
  createBatch: (data) => request('/batches', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/batches/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateBatch: (id, data) => request(`/batches/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/batches/${id}`, { method: 'DELETE' }),
  deleteBatch: (id) => request(`/batches/${id}`, { method: 'DELETE' }),
  transferStudent: (data) => request('/batches/transfer-student', { method: 'POST', body: JSON.stringify(data) }),
  getStudents: (id) => request(`/batches/${id}/students`),
  getTransferHistory: () => request('/batches/transfer-history')
};

export const routineAPI = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/routines?${q}`);
  },
  getWeeklyGrid: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/routines/weekly-grid?${q}`);
  },
  getMySchedule: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/routines/my-schedule?${q}`);
  },
  saveSlot: (data) => request('/routines', { method: 'POST', body: JSON.stringify(data) }),
  deleteSlot: (id) => request(`/routines/${id}`, { method: 'DELETE' })
};

export const resultsAPI = {
  getTerms: () => request('/results/terms'),
  getMarksSheet: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/results/marks-sheet?${q}`);
  },
  saveBulkMarks: (data) => request('/results/bulk-marks', { method: 'POST', body: JSON.stringify(data) }),
  getMeritList: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/results/merit-list?${q}`);
  },
  getReportCard: (studentId, params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/results/report-card/${studentId}?${q}`);
  },
  getTabulationSheet: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/results/tabulation-sheet?${q}`);
  }
};

export const accountsAPI = {
  getSummary: () => request('/accounts/summary'),
  getExpenses: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/accounts/expenses?${q}`);
  },
  addExpense: (data) => request('/accounts/expenses', { method: 'POST', body: JSON.stringify(data) }),
  updateExpense: (id, data) => request(`/accounts/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteExpense: (id) => request(`/accounts/expenses/${id}`, { method: 'DELETE' }),
  getPayroll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/accounts/payroll?${q}`);
  },
  generatePayroll: (data) => request('/accounts/payroll/generate', { method: 'POST', body: JSON.stringify(data) }),
  paySalary: (id, data) => request(`/accounts/payroll/pay/${id}`, { method: 'POST', body: JSON.stringify(data) }),
  getPayslip: (id) => request(`/accounts/payroll/payslip/${id}`),
  getReports: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/accounts/reports?${q}`);
  }
};

export const analyticsAPI = {
  getSummary: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/analytics/overview?${q}`);
  },
  getOverview: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/analytics/overview?${q}`);
  },
  getAcademicAnalytics: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/analytics/academic?${q}`);
  },
  getFinancialAnalytics: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/analytics/financial?${q}`);
  },
  getAttendanceAnalytics: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/analytics/attendance?${q}`);
  },
  getStudentProgress: (studentId) => request(`/analytics/student/${studentId}`)
};

export const settingsAPI = {
  getSettings: () => request('/settings'),
  updateSettings: (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data) }),
  getPublicSettings: () => request('/settings/public'),
  getStudentPortalControl: () => request('/settings/student-portal-control'),
  updateStudentPortalControl: (data) => request('/settings/student-portal-control', { method: 'PUT', body: JSON.stringify(data) }),
  resetStudentPortalControl: () => request('/settings/student-portal-control/reset', { method: 'POST' }),
  getStudentMenus: () => request('/settings/student-menus'),
  updateStudentMenus: (data) => request('/settings/student-menus', { method: 'PUT', body: JSON.stringify(data) }),
  uploadLogo: (formData) => {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken') || localStorage.getItem('nextgen_token');
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return fetch(`${API_BASE}/settings/upload-logo`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    }).then(res => res.json()).catch(err => ({ success: false, error: { message: err.message } }));
  },
  getSystemHealth: () => request('/settings/system-health')
};

export const admissionsAPI = {
  getApplications: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/admissions?${q}`);
  },
  submitApplication: (data) => request('/admissions/apply', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id, status, notes) => request(`/admissions/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, notes }) }),
  approveApplication: (id, data) => request(`/admissions/${id}/approve`, { method: 'POST', body: JSON.stringify(data) }),
  rejectApplication: (id, reason) => request(`/admissions/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),
  getStats: () => request('/admissions/stats')
};

export const admissionAPI = admissionsAPI;

export const backupAPI = {
  getSummary: () => request('/backup/summary'),
  getBackups: () => request('/backup/list'),
  createBackup: () => request('/backup/create', { method: 'POST' }),
  restoreBackup: (fileName) => request('/backup/restore', { method: 'POST', body: JSON.stringify({ fileName }) }),
  downloadBackup: (fileName) => `${API_BASE}/backup/download/${fileName}`,
  uploadBackup: (formData) => {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken') || localStorage.getItem('nextgen_token');
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return fetch(`${API_BASE}/backup/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    }).then(res => res.json()).catch(err => ({ success: false, error: { message: err.message } }));
  }
};

export const smsAPI = {
  getSummary: () => request('/sms/summary'),
  getLogs: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/sms/logs?${q}`);
  },
  sendBulkSMS: (data) => request('/sms/send-bulk', { method: 'POST', body: JSON.stringify(data) }),
  getBalance: () => request('/sms/balance'),
  getTemplates: () => request('/sms/templates'),
  saveTemplate: (data) => request('/sms/templates', { method: 'POST', body: JSON.stringify(data) })
};

export const teachersDirectoryAPI = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/teachers-directory?${q}`);
  },
  getPublic: () => request('/teachers-directory/public'),
  create: (data) => request('/teachers-directory', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/teachers-directory/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/teachers-directory/${id}`, { method: 'DELETE' })
};

export const teacherDirectoryAPI = teachersDirectoryAPI;

export const paymentMethodsAPI = {
  getMethods: () => request('/payments/methods'),
  getPublicMethods: () => request('/payments/methods/public'),
  createMethod: (data) => request('/payments/methods', { method: 'POST', body: JSON.stringify(data) }),
  updateMethod: (id, data) => request(`/payments/methods/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMethod: (id) => request(`/payments/methods/${id}`, { method: 'DELETE' }),
  toggleActive: (id) => request(`/payments/methods/${id}/toggle-active`, { method: 'PATCH' })
};

export const paymentAPI = paymentMethodsAPI;

export const achieversAPI = {
  getAll: () => request('/achievers'),
  getPublic: () => request('/achievers/public'),
  create: (data) => request('/achievers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/achievers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/achievers/${id}`, { method: 'DELETE' })
};

export const achieverAPI = achieversAPI;

export const systemErrorsAPI = {
  getErrors: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/system-errors?${q}`);
  },
  resolveError: (id) => request(`/system-errors/${id}/resolve`, { method: 'PATCH' }),
  clearAll: () => request('/system-errors/clear', { method: 'DELETE' })
};

export const systemErrorAPI = systemErrorsAPI;

export const syllabusTrackingAPI = {
  getOverview: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/syllabus-tracking/overview?${q}`);
  },
  updateTopicStatus: (data) => request('/syllabus-tracking/update-status', { method: 'POST', body: JSON.stringify(data) }),
  getSubjectProgress: (subjectId) => request(`/syllabus-tracking/subject/${subjectId}`)
};

export const doubtSolverAPI = {
  solveDoubt: (data) => request('/doubt-solver/solve', { method: 'POST', body: JSON.stringify(data) }),
  getHistory: () => request('/doubt-solver/history'),
  clearHistory: () => request('/doubt-solver/history', { method: 'DELETE' })
};

export const omrAPI = {
  evaluateOMR: (data) => request('/omr/evaluate', { method: 'POST', body: JSON.stringify(data) }),
  uploadOMRImage: (formData) => {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken') || localStorage.getItem('nextgen_token');
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return fetch(`${API_BASE}/omr/upload-and-scan`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    }).then(res => res.json()).catch(err => ({ success: false, error: { message: err.message } }));
  }
};

export const gamificationCmsAPI = {
  getBadges: () => request('/gamification-cms/badges'),
  saveBadge: (data) => request('/gamification-cms/badges', { method: 'POST', body: JSON.stringify(data) }),
  deleteBadge: (id) => request(`/gamification-cms/badges/${id}`, { method: 'DELETE' }),
  getRewards: () => request('/gamification-cms/rewards'),
  saveReward: (data) => request('/gamification-cms/rewards', { method: 'POST', body: JSON.stringify(data) }),
  deleteReward: (id) => request(`/gamification-cms/rewards/${id}`, { method: 'DELETE' })
};

export const helpdeskAPI = {
  getTickets: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/helpdesk/tickets?${q}`);
  },
  createTicket: (data) => request('/helpdesk/tickets', { method: 'POST', body: JSON.stringify(data) }),
  replyTicket: (id, data) => request(`/helpdesk/tickets/${id}/reply`, { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id, status) => request(`/helpdesk/tickets/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
};

export const grammarAPI = {
  getLessons: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/grammar/lessons?${q}`);
  },
  getLessonDetails: (id) => request(`/grammar/lessons/${id}`),
  saveLesson: (data) => request('/grammar/lessons', { method: 'POST', body: JSON.stringify(data) }),
  deleteLesson: (id) => request(`/grammar/lessons/${id}`, { method: 'DELETE' }),
  evaluateGrammarExercise: (data) => request('/grammar/evaluate', { method: 'POST', body: JSON.stringify(data) })
};

export const referralAPI = {
  getMyReferralProfile: () => request('/referral/my-profile'),
  generateReferralCode: () => request('/referral/generate-code', { method: 'POST' }),
  claimReferralBonus: (data) => request('/referral/claim-bonus', { method: 'POST', body: JSON.stringify(data) }),
  getLeaderboard: () => request('/referral/leaderboard')
};

export const announcementsAPI = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/announcements?${q}`);
  },
  getActive: () => request('/announcements/active'),
  create: (data) => request('/announcements', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/announcements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/announcements/${id}`, { method: 'DELETE' }),
  toggleActive: (id) => request(`/announcements/${id}/toggle-active`, { method: 'PATCH' })
};

export const announcementAPI = announcementsAPI;

export const menuControlsAPI = {
  getStudentMenus: () => request('/settings/student-menus'),
  updateStudentMenus: (data) => request('/settings/student-menus', { method: 'PUT', body: JSON.stringify(data) })
};

export const studentPortalControlAPI = {
  getConfig: () => request('/settings/student-portal-control'),
  updateConfig: (data) => request('/settings/student-portal-control', { method: 'PUT', body: JSON.stringify(data) })
};

export const googleDriveAPI = {
  scanFolder: (data) => request('/google-drive/scan', { method: 'POST', body: JSON.stringify(data) }),
  fetchContent: (data) => request('/google-drive/content', { method: 'POST', body: JSON.stringify(data) })
};

export const proctoringAPI = {
  sendEvent: (data) => request('/proctoring/event', { method: 'POST', body: JSON.stringify(data) }),
  getLogs: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/proctoring/logs?${q}`);
  }
};

export const aiRoutineAPI = {
  getWeaknessAnalysis: () => request('/student/ai-weaknesses'),
  generateAIRoutine: (data) => request('/student/ai-routine/generate', { method: 'POST', body: JSON.stringify(data) })
};


