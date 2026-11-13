-- ===========================================================================
-- NextGen Academy — Enterprise PostgreSQL / Supabase Migration Schema
-- Idempotent, High-Performance, ACID Compliant
-- ===========================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. Core Authentication & Identity
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'STUDENT',
    avatar_url TEXT,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 3. Academic Structure
CREATE TABLE IF NOT EXISTS classes (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_bn VARCHAR(100) NOT NULL,
    numeric_value INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sections (
    id BIGSERIAL PRIMARY KEY,
    class_id BIGINT REFERENCES classes(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    name_bn VARCHAR(100) NOT NULL,
    capacity INT DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subjects (
    id BIGSERIAL PRIMARY KEY,
    class_id BIGINT REFERENCES classes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    is_optional BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS batches (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    class_id BIGINT REFERENCES classes(id) ON DELETE CASCADE,
    start_time TIME,
    end_time TIME,
    days TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. User Profiles & Relationships
CREATE TABLE IF NOT EXISTS students (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    class_id BIGINT REFERENCES classes(id),
    section_id BIGINT REFERENCES sections(id),
    batch_id BIGINT REFERENCES batches(id),
    roll_no VARCHAR(50),
    student_id_number VARCHAR(100) UNIQUE,
    blood_group VARCHAR(10),
    dob DATE,
    address TEXT,
    guardian_phone VARCHAR(50),
    guardian_name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teachers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    designation VARCHAR(100),
    qualification TEXT,
    joining_date DATE,
    salary NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS guardian_student_mappings (
    id BIGSERIAL PRIMARY KEY,
    parent_user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    relation VARCHAR(50) DEFAULT 'GUARDIAN',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_parent_student UNIQUE(parent_user_id, student_id)
);

-- 5. Study Materials & Media
CREATE TABLE IF NOT EXISTS study_materials (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    title_bn VARCHAR(255),
    category VARCHAR(50) DEFAULT 'GENERAL',
    class_id BIGINT REFERENCES classes(id),
    subject_id BIGINT REFERENCES subjects(id),
    chapter VARCHAR(255),
    topic VARCHAR(255),
    board VARCHAR(100),
    exam_year VARCHAR(50),
    file_name VARCHAR(255),
    file_size VARCHAR(50),
    file_url TEXT,
    google_drive_file_id VARCHAR(255),
    storage_provider VARCHAR(50) DEFAULT 'GOOGLE_DRIVE',
    file_hash VARCHAR(100),
    extracted_text TEXT,
    extracted_html TEXT,
    uploaded_by_user_id BIGINT REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Question Repository & Multi-Board Suggestion Families
CREATE TABLE IF NOT EXISTS question_suggestion_families (
    id BIGSERIAL PRIMARY KEY,
    family_code VARCHAR(100) UNIQUE NOT NULL,
    base_question_text TEXT NOT NULL,
    subject_id BIGINT REFERENCES subjects(id),
    class_id BIGINT REFERENCES classes(id),
    chapter VARCHAR(255),
    topic VARCHAR(255),
    repeated_count INT DEFAULT 1,
    distinct_board_year_count INT DEFAULT 1,
    board_year_sources JSONB DEFAULT '[]'::jsonb,
    primary_question_id BIGINT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_qsf_distinct_count ON question_suggestion_families(distinct_board_year_count DESC, repeated_count DESC);
CREATE INDEX IF NOT EXISTS idx_qsf_sources_gin ON question_suggestion_families USING GIN(board_year_sources);

CREATE TABLE IF NOT EXISTS question_banks (
    id BIGSERIAL PRIMARY KEY,
    question_type VARCHAR(50) NOT NULL, -- 'MCQ', 'CQ', 'SQ'
    question_number INT,
    question_text TEXT NOT NULL,
    stem TEXT,
    sub_questions JSONB,
    diagram_url TEXT,
    diagram_caption TEXT,
    diagram_urls JSONB DEFAULT '[]'::jsonb,
    options JSONB DEFAULT '[]'::jsonb,
    answer VARCHAR(50),
    answer_text TEXT,
    explanation TEXT,
    class_id BIGINT REFERENCES classes(id),
    subject_id BIGINT REFERENCES subjects(id),
    board VARCHAR(100),
    year VARCHAR(50),
    chapter VARCHAR(255),
    topic VARCHAR(255),
    difficulty VARCHAR(50) DEFAULT 'MEDIUM',
    marks INT DEFAULT 1,
    source_material_id BIGINT REFERENCES study_materials(id) ON DELETE SET NULL,
    source_file_name VARCHAR(255),
    google_drive_file_id VARCHAR(255),
    file_url TEXT,
    family_id BIGINT REFERENCES question_suggestion_families(id) ON DELETE SET NULL,
    duplicate_group_id VARCHAR(100),
    duplicate_status VARCHAR(50) DEFAULT 'UNIQUE',
    similarity_score NUMERIC(5, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'APPROVED',
    parser_notes TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_qb_class_subject ON question_banks(class_id, subject_id);
CREATE INDEX IF NOT EXISTS idx_qb_question_type ON question_banks(question_type);
CREATE INDEX IF NOT EXISTS idx_qb_board_year ON question_banks(board, year);
CREATE INDEX IF NOT EXISTS idx_qb_family_id ON question_banks(family_id);

-- 7. Grammar Engine (Bangla & English 100% Curated)
CREATE TABLE IF NOT EXISTS grammar_chapters (
    id BIGSERIAL PRIMARY KEY,
    chapter_no INT NOT NULL,
    title_bn VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    book_type VARCHAR(50) NOT NULL, -- 'BANGLA' or 'ENGLISH'
    class_level VARCHAR(50) DEFAULT 'CLASS_9_10',
    total_topics INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_book_chapter UNIQUE(book_type, chapter_no)
);

CREATE TABLE IF NOT EXISTS grammar_topics (
    id BIGSERIAL PRIMARY KEY,
    chapter_id BIGINT REFERENCES grammar_chapters(id) ON DELETE CASCADE,
    title_bn VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    overview_bn TEXT,
    rules_json JSONB DEFAULT '[]'::jsonb,
    examples_json JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS grammar_questions (
    id BIGSERIAL PRIMARY KEY,
    chapter_id BIGINT REFERENCES grammar_chapters(id) ON DELETE CASCADE,
    topic_id BIGINT REFERENCES grammar_topics(id) ON DELETE SET NULL,
    question_bn TEXT NOT NULL,
    question_en TEXT,
    options JSONB NOT NULL,
    answer VARCHAR(50) NOT NULL,
    explanation TEXT,
    difficulty VARCHAR(50) DEFAULT 'MEDIUM',
    marks INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS grammar_board_questions (
    id BIGSERIAL PRIMARY KEY,
    chapter_id BIGINT REFERENCES grammar_chapters(id) ON DELETE CASCADE,
    board VARCHAR(100) NOT NULL,
    exam_year VARCHAR(50) NOT NULL,
    question_bn TEXT NOT NULL,
    options JSONB,
    answer VARCHAR(50),
    explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS grammar_model_tests (
    id BIGSERIAL PRIMARY KEY,
    title_bn VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    book_type VARCHAR(50) NOT NULL,
    duration_minutes INT DEFAULT 25,
    total_marks INT DEFAULT 25,
    question_ids JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Financials & Billing
CREATE TABLE IF NOT EXISTS invoices (
    id BIGSERIAL PRIMARY KEY,
    invoice_no VARCHAR(100) UNIQUE NOT NULL,
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    title_bn VARCHAR(255),
    title_en VARCHAR(255),
    month VARCHAR(100),
    year INT DEFAULT 2026,
    base_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(12, 2) DEFAULT 0.00,
    amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'UNPAID', -- 'PAID', 'UNPAID', 'PARTIAL'
    payment_method VARCHAR(50),
    paid_date DATE,
    transaction_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    invoice_id BIGINT REFERENCES invoices(id) ON DELETE CASCADE,
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'SUCCESS',
    receipt_no VARCHAR(100),
    sender_phone VARCHAR(50),
    verified_by_user_id BIGINT REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. Communications, Logs & Auditing
CREATE TABLE IF NOT EXISTS sms_logs (
    id BIGSERIAL PRIMARY KEY,
    message_id VARCHAR(100) UNIQUE,
    recipient_phone VARCHAR(50) NOT NULL,
    student_name VARCHAR(255),
    student_id BIGINT,
    message_text TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'NOTICE',
    gateway_trx_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'DELIVERED',
    sent_by_user_id BIGINT REFERENCES users(id),
    sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100),
    entity_id VARCHAR(100),
    details JSONB,
    ip_address VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS helpdesk_tickets (
    id BIGSERIAL PRIMARY KEY,
    ticket_number VARCHAR(100) UNIQUE NOT NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(100),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'OPEN',
    priority VARCHAR(50) DEFAULT 'NORMAL',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
