require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const { User } = require('./models');
const seedDatabase = require('./seeders/seed');
const { sanitizeInput, corsOptions, generalLimiter } = require('./middleware/security');

// Import Route Handlers
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const teacherRoutes = require('./routes/teacher');
const parentRoutes = require('./routes/parent');
const studentRoutes = require('./routes/student');
const paymentRoutes = require('./routes/payment');
const noticeRoutes = require('./routes/notices');
const homeworkRoutes = require('./routes/homework');
const curriculumRoutes = require('./routes/curriculum');
const materialsRoutes = require('./routes/materials');
const textbooksRoutes = require('./routes/textbooks');
const teacherAttendanceRoutes = require('./routes/teacherAttendance');
const examsRoutes = require('./routes/exams');
const liveClassRoutes = require('./routes/liveClasses');
const analyticsRoutes = require('./routes/analytics');
const teachersDirectoryRoutes = require('./routes/teachersDirectory');
const batchesRoutes = require('./routes/batches');
const routinesRoutes = require('./routes/routines');
const resultsRoutes = require('./routes/results');
const accountsRoutes = require('./routes/accounts');
const settingsRoutes = require('./routes/settings');
const admissionsRoutes = require('./routes/admissions');
const backupRoutes = require('./routes/backup');
const smsRoutes = require('./routes/sms');
const paymentMethodsRoutes = require('./routes/paymentMethods');
const resourcesRoutes = require('./routes/resources');
const achieversRoutes = require('./routes/achievers');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(sanitizeInput);
app.use('/api', generalLimiter);

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'NextGen Academy Parent Portal API',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/admin/accounts', accountsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin/settings', settingsRoutes);
app.use('/api/admissions', admissionsRoutes);
app.use('/api/admin/admissions', admissionsRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/admin/backup', backupRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/admin/sms', smsRoutes);
app.use('/api/teachers', teachersDirectoryRoutes);
app.use('/api/teacher-directory', teachersDirectoryRoutes);
app.use('/api/batches', batchesRoutes);
app.use('/api/admin/batches', batchesRoutes);
app.use('/api/courses', batchesRoutes);
app.use('/api/admin/courses', batchesRoutes);
app.use('/api/routines', routinesRoutes);
app.use('/api/admin/routines', routinesRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/admin/results', resultsRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/payments', paymentMethodsRoutes);
app.use('/api/admin/payments/methods', paymentMethodsRoutes);
app.use('/api/admin/payments', paymentMethodsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/homework', homeworkRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/textbooks', textbooksRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/admin/resources', resourcesRoutes);
app.use('/api/achievers', achieversRoutes);
app.use('/api/admin/achievers', achieversRoutes);
app.use('/api/teacher-attendance', teacherAttendanceRoutes);
app.use('/api/exams', examsRoutes);
app.use('/api/live-classes', liveClassRoutes);
app.use('/api/curriculum', curriculumRoutes);
app.use('/api', curriculumRoutes);

// Catch 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `API Route ${req.originalUrl} not found`
    }
  });
});

// Global Error Handler
app.use(errorHandler);

// Bootstrap Server & Auto-Seed Database if empty
async function startServer() {
  try {
    const existingUsers = await User.count();
    if (existingUsers === 0) {
      console.log('⚡ Empty database detected. Seeding initial records...');
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`🚀 NextGen Academy Backend running on http://localhost:${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
