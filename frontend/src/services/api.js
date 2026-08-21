const API_BASE = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('nextgen_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err);
    throw err;
  }
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
  disable2FA: (password) => request('/auth/2fa/disable', { method: 'POST', body: JSON.stringify({ password }) })
};

export const adminAPI = {
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
  createStudent: (studentData) => request('/admin/students', { method: 'POST', body: JSON.stringify(studentData) }),
  createTeacher: (teacherData) => request('/admin/teachers', { method: 'POST', body: JSON.stringify(teacherData) }),
  updateTeacher: (id, teacherData) => request(`/admin/teachers/${id}`, { method: 'PUT', body: JSON.stringify(teacherData) }),
  deleteTeacher: (id) => request(`/admin/teachers/${id}`, { method: 'DELETE' }),
  publishNotice: (noticeData) => request('/admin/notices', { method: 'POST', body: JSON.stringify(noticeData) }),
  createInvoice: (invoiceData) => request('/admin/invoices', { method: 'POST', body: JSON.stringify(invoiceData) }),
  deleteInvoice: (id) => request(`/admin/invoices/${id}`, { method: 'DELETE' }),
  getProfile: () => request('/admin/profile'),
  updateProfile: (data) => request('/admin/profile', { method: 'PUT', body: JSON.stringify(data) }),
  getAdminUsers: () => request('/admin/users'),
  createAdminUser: (data) => request('/admin/users', { method: 'POST', body: JSON.stringify(data) }),
  updateAdminUser: (id, data) => request(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAdminUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' })
};

export const analyticsAPI = {
  getSummary: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/analytics/summary?${q}`);
  }
};

export const teacherAPI = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/teachers?${q}`);
  },
  getById: (id) => request(`/teachers/${id}`),
  create: (data) => request('/teachers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/teachers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/teachers/${id}`, { method: 'DELETE' }),
  getDirectory: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/teachers?${q}`);
  },
  getMyProfile: () => request('/teachers/me/profile'),
  updateMyProfile: (data) => request('/teachers/me/profile', { method: 'PUT', body: JSON.stringify(data) }),
  togglePrivacy: (is_phone_visible) => request('/teachers/me/privacy', { method: 'PATCH', body: JSON.stringify({ is_phone_visible }) }),
  getClasses: () => request('/teacher/classes'),
  getStudents: (classId, sectionId) => request(`/teacher/students?classId=${classId || ''}&sectionId=${sectionId || ''}`),
  getAttendance: (date, classId, sectionId) => request(`/teacher/attendance?date=${date || ''}&classId=${classId || ''}&sectionId=${sectionId || ''}`),
  saveAttendance: (date, records, autoSendAbsentSms = false) => request('/teacher/attendance', { method: 'POST', body: JSON.stringify({ date, records, autoSendAbsentSms }) }),
  sendAbsentSMS: (payload) => request('/teacher/attendance/send-absent-sms', { method: 'POST', body: JSON.stringify(payload) }),
  getMarks: (classId, subjectId, examTermId) => request(`/teacher/marks?classId=${classId || ''}&subjectId=${subjectId || ''}&examTermId=${examTermId || ''}`),
  saveMarks: (markData) => request('/teacher/marks', { method: 'POST', body: JSON.stringify(markData) })
};

export const parentAPI = {
  getChildren: () => request('/parent/children'),
  getChildSummary: (studentId) => request(`/parent/children/${studentId}/summary`),
  getChildAttendance: (studentId) => request(`/parent/children/${studentId}/attendance`),
  getChildResults: (studentId, termId) => request(`/parent/children/${studentId}/results?termId=${termId || ''}`),
  getChildRoutine: (studentId) => request(`/parent/children/${studentId}/routine`),
  getChildInvoices: (studentId) => request(`/parent/children/${studentId}/invoices`),
  getTeachers: (params = {}) => teacherAPI.getDirectory(params)
};

export const studentAPI = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/students?${q}`);
  },
  getById: (id) => request(`/students/${id}`),
  create: (data) => request('/students', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/students/${id}`, { method: 'DELETE' }),
  toggleStatus: (id, isActive) => request(`/students/${id}/status`, { method: 'PATCH', body: JSON.stringify({ isActive }) }),
  getProfile: () => request('/student/profile'),
  getDashboard: () => request('/student/dashboard'),
  getFullSummary: (id) => request(id ? `/student/${id}/full-summary` : '/student/full-summary'),
  getAttendance: () => request('/student/attendance'),
  getResults: () => request('/student/results'),
  getRoutine: () => request('/student/routine'),
  getInvoices: () => request('/student/invoices'),
  getTeachers: (params = {}) => teacherAPI.getDirectory(params)
};

export const paymentAPI = {
  getMethods: () => request('/payments/methods'),
  getAdminMethods: () => request('/admin/payments/methods'),
  createMethod: (data) => request('/admin/payments/methods', { method: 'POST', body: JSON.stringify(data) }),
  updateMethod: (id, data) => request(`/admin/payments/methods/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMethod: (id) => request(`/admin/payments/methods/${id}`, { method: 'DELETE' }),
  toggleMethodStatus: (id, isActive) => request(`/admin/payments/methods/${id}`, { method: 'PUT', body: JSON.stringify({ isActive }) }),
  simulatePayment: (payload) => request('/payments/simulate', { method: 'POST', body: JSON.stringify(payload) }),
  collectOfflineCash: (data) => request('/accounts/offline-cash', { method: 'POST', body: JSON.stringify(data) }),
  getReceipt: (invoiceId) => request(`/accounts/receipt/${invoiceId}`)
};

export const noticeAPI = {
  getNotices: (params = {}) => {
    const q = typeof params === 'string' ? `role=${params}` : new URLSearchParams(params).toString();
    return request(`/notices?${q}`);
  },
  getNotice: (id) => request(`/notices/${id}`),
  createNotice: (data) => request('/notices', { method: 'POST', body: JSON.stringify(data) }),
  updateNotice: (id, data) => request(`/notices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteNotice: (id) => request(`/notices/${id}`, { method: 'DELETE' }),
  togglePin: (id, isPinned) => request(`/notices/${id}/pin`, { method: 'PATCH', body: JSON.stringify({ isPinned }) })
};

export const courseAPI = {
  getCourses: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/courses?${q}`);
  },
  getCourse: (id) => request(`/courses/${id}`),
  createCourse: (data) => request('/courses', { method: 'POST', body: JSON.stringify(data) }),
  updateCourse: (id, data) => request(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCourse: (id) => request(`/courses/${id}`, { method: 'DELETE' })
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
  getStudentMaterials: (studentId, params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/materials/student/${studentId}?${q}`);
  },
  postMaterial: (data) => request('/materials', { method: 'POST', body: JSON.stringify(data) }),
  updateMaterial: (id, data) => request(`/materials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMaterial: (id) => request(`/materials/${id}`, { method: 'DELETE' })
};

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
  getSalaryStructures: () => request('/accounts/salary-structures'),
  updateSalaryStructure: (teacherId, data) => request(`/accounts/salary-structures/${teacherId}`, { method: 'PUT', body: JSON.stringify(data) }),
  getCashbook: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/accounts/cashbook?${q}`);
  },
  collectOfflineCash: (data) => request('/accounts/offline-cash', { method: 'POST', body: JSON.stringify(data) }),
  getReceipt: (invoiceId) => request(`/accounts/receipt/${invoiceId}`)
};

export const settingsAPI = {
  getSettings: () => request('/settings'),
  updateSettings: (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data) }),
  getProfile: () => request('/settings/profile'),
  updateProfile: (data) => request('/settings/profile', { method: 'PUT', body: JSON.stringify(data) }),
  getRoles: () => request('/settings/roles'),
  createRole: (data) => request('/settings/roles', { method: 'POST', body: JSON.stringify(data) }),
  updateRole: (id, data) => request(`/settings/roles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRole: (id) => request(`/settings/roles/${id}`, { method: 'DELETE' }),
  getStaff: () => request('/settings/staff'),
  addStaff: (data) => request('/settings/staff', { method: 'POST', body: JSON.stringify(data) }),
  updateStaff: (id, data) => request(`/settings/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteStaff: (id) => request(`/settings/staff/${id}`, { method: 'DELETE' }),
  resetStaffPassword: (id, data) => request(`/settings/staff/reset-password/${id}`, { method: 'POST', body: JSON.stringify(data) }),
  getPermissionsMatrix: () => request('/settings/permissions-matrix')
};

export const admissionAPI = {
  apply: (data) => request('/admissions/apply', { method: 'POST', body: JSON.stringify(data) }),
  track: (query) => request(`/admissions/track/${encodeURIComponent(query)}`),
  getApplications: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/admissions/applications?${q}`);
  },
  getApplication: (id) => request(`/admissions/applications/${id}`),
  approve: (id, data) => request(`/admissions/applications/${id}/approve`, { method: 'POST', body: JSON.stringify(data) }),
  reject: (id, data) => request(`/admissions/applications/${id}/reject`, { method: 'POST', body: JSON.stringify(data) }),
  getStats: () => request('/admissions/stats')
};

export const backupAPI = {
  getSummary: () => request('/backup/summary'),
  getCategoryExportUrl: (category) => `${API_URL}/backup/export/${category}`,
  getJsonDumpUrl: () => `${API_URL}/backup/dump/json`,
  getSqlDumpUrl: () => `${API_URL}/backup/dump/sql`
};

export const smsAPI = {
  getSummary: () => request('/sms/summary'),
  previewSMS: (data) => request('/sms/preview', { method: 'POST', body: JSON.stringify(data) }),
  sendBulkSMS: (data) => request('/sms/send-bulk', { method: 'POST', body: JSON.stringify(data) }),
  getLogs: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/sms/logs?${q}`);
  },
  getTemplates: () => request('/sms/templates'),
  saveTemplate: (data) => request('/sms/templates', { method: 'POST', body: JSON.stringify(data) })
};

export const achieverAPI = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/achievers?${q}`);
  },
  create: (data) => request('/achievers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/achievers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/achievers/${id}`, { method: 'DELETE' })
};









