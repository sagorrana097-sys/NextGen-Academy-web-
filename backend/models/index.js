const { Model } = require('../config/db');

// Instantiate Models
const User = new Model('users');
const Student = new Model('students');
const Teacher = new Model('teachers');
const GuardianStudentMapping = new Model('guardian_student_mappings');
const Class = new Model('classes');
const Section = new Model('sections');
const Subject = new Model('subjects');
const TeacherClassAssignment = new Model('teacher_class_assignments');
const Attendance = new Model('attendance');
const ExamTerm = new Model('exam_terms');
const Mark = new Model('marks');
const Invoice = new Model('invoices');
const Payment = new Model('payments');
const Notice = new Model('notices');
const AuditLog = new Model('audit_logs');
const Routine = new Model('routines');
const Homework = new Model('homeworks');
const HomeworkStatus = new Model('homework_statuses');
const StudyMaterial = new Model('study_materials');
const SMSLog = new Model('sms_logs');
const Textbook = new Model('textbooks');
const TeacherAttendance = new Model('teacher_attendances');
const Exam = new Model('exams');
const ExamSubmission = new Model('exam_submissions');
const LiveClass = new Model('live_classes');
const LiveClassComment = new Model('live_class_comments');
const Batch = new Model('batches');
const BatchTransferLog = new Model('batch_transfer_logs');
const PaymentMethod = new Model('payment_methods');
const Achiever = new Model('achievers');
const SystemError = new Model('system_errors');
const SyllabusTracking = new Model('syllabus_tracking');
const HelpdeskTicket = new Model('helpdesk_tickets');
const GrammarLesson = new Model('grammar_lessons');
const GrammarChapter = new Model('grammar_chapters');
const GrammarTopic = new Model('grammar_topics');
const GrammarRule = new Model('grammar_rules');
const GrammarQuestion = new Model('grammar_questions');
const GrammarBoardQuestion = new Model('grammar_board_questions');
const GrammarModelTest = new Model('grammar_model_tests');
const GrammarProgress = new Model('grammar_user_progress');
const GrammarBookmark = new Model('grammar_user_bookmarks');
const ReferralProfile = new Model('referral_profiles');
const PromoSetting = new Model('promo_settings');
const PageAnnouncement = new Model('page_announcements');
const QuestionRepository = new Model('question_repositories');
const QuestionBank = new Model('question_bank');
const QuestionSuggestionFamily = new Model('question_suggestion_families');



// Relational Associations

// Student & User
Student.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasOne(Student, { foreignKey: 'userId', as: 'student' });

// Student & Class & Section
Student.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
Class.hasMany(Student, { foreignKey: 'classId', as: 'students' });

Student.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });
Section.hasMany(Student, { foreignKey: 'sectionId', as: 'students' });

Section.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
Class.hasMany(Section, { foreignKey: 'classId', as: 'sections' });

// Teacher & User
Teacher.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasOne(Teacher, { foreignKey: 'userId', as: 'teacher' });

// Teacher Assignments
TeacherClassAssignment.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'teacher' });
Teacher.hasMany(TeacherClassAssignment, { foreignKey: 'teacherId', as: 'assignments' });

TeacherClassAssignment.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
TeacherClassAssignment.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });
TeacherClassAssignment.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });

// Guardian-Student Mappings (Parents)
GuardianStudentMapping.belongsTo(User, { foreignKey: 'parentUserId', as: 'parent' });
User.hasMany(GuardianStudentMapping, { foreignKey: 'parentUserId', as: 'guardianMappings' });

GuardianStudentMapping.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
Student.hasMany(GuardianStudentMapping, { foreignKey: 'studentId', as: 'guardians' });

// Attendance
Attendance.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
Student.hasMany(Attendance, { foreignKey: 'studentId', as: 'attendanceRecords' });

Attendance.belongsTo(User, { foreignKey: 'recordedByUserId', as: 'recordedBy' });

// Subjects
Subject.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
Class.hasMany(Subject, { foreignKey: 'classId', as: 'subjects' });

// Marks
Mark.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
Student.hasMany(Mark, { foreignKey: 'studentId', as: 'marks' });

Mark.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });
Mark.belongsTo(ExamTerm, { foreignKey: 'examTermId', as: 'examTerm' });
Mark.belongsTo(User, { foreignKey: 'submittedByUserId', as: 'submittedBy' });

// Invoices & Payments
Invoice.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
Student.hasMany(Invoice, { foreignKey: 'studentId', as: 'invoices' });

Payment.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice' });
Invoice.hasMany(Payment, { foreignKey: 'invoiceId', as: 'payments' });

Payment.belongsTo(User, { foreignKey: 'paidByUserId', as: 'paidBy' });

// Notices
Notice.belongsTo(User, { foreignKey: 'authorUserId', as: 'author' });

// Audit Logs
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Routines
Routine.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
Routine.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });
Routine.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });
Routine.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'teacher' });

// Homework Associations
Homework.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
Homework.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });
Homework.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });
Homework.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'teacher' });

HomeworkStatus.belongsTo(Homework, { foreignKey: 'homeworkId', as: 'homework' });
Homework.hasMany(HomeworkStatus, { foreignKey: 'homeworkId', as: 'statuses' });

HomeworkStatus.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
Student.hasMany(HomeworkStatus, { foreignKey: 'studentId', as: 'homeworkStatuses' });

// Study Material Associations
StudyMaterial.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
Class.hasMany(StudyMaterial, { foreignKey: 'classId', as: 'studyMaterials' });

StudyMaterial.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });
Subject.hasMany(StudyMaterial, { foreignKey: 'subjectId', as: 'studyMaterials' });

StudyMaterial.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'teacher' });
Teacher.hasMany(StudyMaterial, { foreignKey: 'teacherId', as: 'studyMaterials' });

// Textbook Associations
Textbook.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
Class.hasMany(Textbook, { foreignKey: 'classId', as: 'textbooks' });

Textbook.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });
Subject.hasMany(Textbook, { foreignKey: 'subjectId', as: 'textbooks' });

// Teacher Attendance Associations
TeacherAttendance.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'teacher' });
Teacher.hasMany(TeacherAttendance, { foreignKey: 'teacherId', as: 'attendances' });

// Exam & Submission Associations
Exam.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
Class.hasMany(Exam, { foreignKey: 'classId', as: 'exams' });

Exam.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });
Subject.hasMany(Exam, { foreignKey: 'subjectId', as: 'exams' });

Exam.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'teacher' });
Teacher.hasMany(Exam, { foreignKey: 'teacherId', as: 'exams' });

Exam.hasMany(ExamSubmission, { foreignKey: 'examId', as: 'submissions' });
ExamSubmission.belongsTo(Exam, { foreignKey: 'examId', as: 'exam' });

ExamSubmission.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
Student.hasMany(ExamSubmission, { foreignKey: 'studentId', as: 'examSubmissions' });

// Live Class Associations
LiveClass.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
Class.hasMany(LiveClass, { foreignKey: 'classId', as: 'liveClasses' });

LiveClass.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });
Section.hasMany(LiveClass, { foreignKey: 'sectionId', as: 'liveClasses' });

LiveClass.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });
Subject.hasMany(LiveClass, { foreignKey: 'subjectId', as: 'liveClasses' });

LiveClass.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'teacher' });
Teacher.hasMany(LiveClass, { foreignKey: 'teacherId', as: 'liveClasses' });

// Live Class Comment Associations
LiveClassComment.belongsTo(LiveClass, { foreignKey: 'liveClassId', as: 'liveClass' });
LiveClass.hasMany(LiveClassComment, { foreignKey: 'liveClassId', as: 'comments' });

LiveClassComment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(LiveClassComment, { foreignKey: 'userId', as: 'liveClassComments' });

// Batch Associations
Batch.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
Class.hasMany(Batch, { foreignKey: 'classId', as: 'batches' });

Batch.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });
Section.hasMany(Batch, { foreignKey: 'sectionId', as: 'batches' });

Batch.belongsTo(Teacher, { foreignKey: 'mentorTeacherId', as: 'mentorTeacher' });
Teacher.hasMany(Batch, { foreignKey: 'mentorTeacherId', as: 'mentoredBatches' });

Student.belongsTo(Batch, { foreignKey: 'batchId', as: 'batch' });
Batch.hasMany(Student, { foreignKey: 'batchId', as: 'students' });

Routine.belongsTo(Batch, { foreignKey: 'batchId', as: 'batch' });
Batch.hasMany(Routine, { foreignKey: 'batchId', as: 'routines' });

BatchTransferLog.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });
BatchTransferLog.belongsTo(Batch, { foreignKey: 'fromBatchId', as: 'fromBatch' });
BatchTransferLog.belongsTo(Batch, { foreignKey: 'toBatchId', as: 'toBatch' });

HelpdeskTicket.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(HelpdeskTicket, { foreignKey: 'userId', as: 'helpdeskTickets' });

PageAnnouncement.belongsTo(User, { foreignKey: 'createdById', as: 'author' });
User.hasMany(PageAnnouncement, { foreignKey: 'createdById', as: 'announcements' });

// Question Bank & Suggestion Families
QuestionBank.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
Class.hasMany(QuestionBank, { foreignKey: 'classId', as: 'questions' });

QuestionBank.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });
Subject.hasMany(QuestionBank, { foreignKey: 'subjectId', as: 'questions' });

QuestionBank.belongsTo(StudyMaterial, { foreignKey: 'sourceMaterialId', as: 'sourceMaterial' });
StudyMaterial.hasMany(QuestionBank, { foreignKey: 'sourceMaterialId', as: 'extractedQuestions' });

QuestionBank.belongsTo(User, { foreignKey: 'createdById', as: 'creator' });

QuestionBank.belongsTo(QuestionSuggestionFamily, { foreignKey: 'familyId', as: 'suggestionFamily' });
QuestionSuggestionFamily.hasMany(QuestionBank, { foreignKey: 'familyId', as: 'questions' });

QuestionSuggestionFamily.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
QuestionSuggestionFamily.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });

const MenuSetting = new Model('menu_settings');

module.exports = {
  User,
  Student,
  Teacher,
  GuardianStudentMapping,
  Class,
  Section,
  Subject,
  TeacherClassAssignment,
  Attendance,
  ExamTerm,
  Mark,
  Invoice,
  Payment,
  Notice,
  AuditLog,
  Routine,
  Homework,
  HomeworkStatus,
  StudyMaterial,
  SMSLog,
  Textbook,
  TeacherAttendance,
  Exam,
  ExamSubmission,
  LiveClass,
  LiveClassComment,
  Batch,
  BatchTransferLog,
  PaymentMethod,
  Achiever,
  SystemError,
  SyllabusTracking,
  HelpdeskTicket,
  MenuSetting,
  GrammarLesson,
  GrammarChapter,
  GrammarTopic,
  GrammarRule,
  GrammarQuestion,
  GrammarBoardQuestion,
  GrammarModelTest,
  GrammarProgress,
  GrammarBookmark,
  ReferralProfile,
  PromoSetting,
  PageAnnouncement,
  QuestionRepository,
  QuestionBank,
  QuestionSuggestionFamily
};




