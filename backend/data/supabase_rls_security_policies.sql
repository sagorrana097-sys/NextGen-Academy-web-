-- ==============================================================================
-- NEXTGEN ACADEMY — BANK-GRADE ROW LEVEL SECURITY (RLS) POLICIES
-- Target Environment: PostgreSQL / Supabase
-- Institution: NextGen Academy (মো: আলমগীর হোসেন সাগর | ০১৭৯২৮১৮০০৫)
-- Address: পশ্চিম জয়দেবপুর, বাস-স্ট্যান্ড, গাজীপুর
-- ==============================================================================

-- 1. ENABLE ROW LEVEL SECURITY ON ALL CORE TABLES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardian_student_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.helpdesk_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_settings ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 2. HELPER FUNCTIONS FOR JWT ROLES & PERMISSIONS
-- ==============================================================================

-- Helper: Check if current user is an Admin or Super Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    coalesce(auth.jwt() ->> 'role', '') IN ('ADMIN', 'SUPER_ADMIN')
    OR coalesce((auth.jwt() -> 'user_metadata' ->> 'role'), '') IN ('ADMIN', 'SUPER_ADMIN')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper: Get student_id associated with current auth user
CREATE OR REPLACE FUNCTION public.get_auth_student_id()
RETURNS BIGINT AS $$
DECLARE
  st_id BIGINT;
BEGIN
  SELECT id INTO st_id FROM public.students WHERE user_id = auth.uid() LIMIT 1;
  RETURN st_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 3. USERS TABLE POLICIES
-- ==============================================================================
CREATE POLICY "Admins have full access to users"
  ON public.users
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Users can view and update their own profile"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can update their own personal info"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = (SELECT role FROM public.users WHERE id = auth.uid()));

-- ==============================================================================
-- 4. INVOICES & PAYMENTS POLICIES (FINANCIAL SECURITY)
-- ==============================================================================
-- Invoices:
CREATE POLICY "Admins full CRUD on invoices"
  ON public.invoices
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Students can view only their own invoices"
  ON public.invoices
  FOR SELECT
  TO authenticated
  USING (
    student_id = public.get_auth_student_id()
    OR public.is_admin()
  );

CREATE POLICY "Parents can view only their children invoices"
  ON public.invoices
  FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT student_id FROM public.guardian_student_mappings WHERE parent_user_id = auth.uid()
    )
    OR public.is_admin()
  );

-- Payments:
CREATE POLICY "Admins full CRUD on payments"
  ON public.payments
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Users can view payments made by them or for their student"
  ON public.payments
  FOR SELECT
  TO authenticated
  USING (
    paid_by_user_id = auth.uid()
    OR invoice_id IN (
      SELECT id FROM public.invoices WHERE student_id = public.get_auth_student_id()
    )
    OR public.is_admin()
  );

CREATE POLICY "Students and Parents can insert payment records on checkout"
  ON public.payments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    paid_by_user_id = auth.uid()
    AND (
      invoice_id IN (
        SELECT id FROM public.invoices WHERE student_id = public.get_auth_student_id()
      )
      OR invoice_id IN (
        SELECT id FROM public.invoices WHERE student_id IN (
          SELECT student_id FROM public.guardian_student_mappings WHERE parent_user_id = auth.uid()
        )
      )
      OR public.is_admin()
    )
  );

-- ==============================================================================
-- 5. GLOBAL FINANCE & ACCOUNTS LEDGER (STRICT ADMIN ONLY)
-- ==============================================================================
-- Students and Parents are completely RESTRICTED from seeing Expenses, Payroll, or Global Ledger!
CREATE POLICY "Strict Admin Only on Expenses"
  ON public.expenses
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Strict Admin Only on Payroll"
  ON public.payroll
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Strict Admin Only on Accounts Ledger"
  ON public.accounts_ledger
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 6. MARKS & ACADEMIC EXAM RESULTS POLICIES
-- ==============================================================================
CREATE POLICY "Admins and Teachers full CRUD on marks"
  ON public.marks
  FOR ALL
  TO authenticated
  USING (
    public.is_admin()
    OR coalesce(auth.jwt() ->> 'role', '') = 'TEACHER'
  );

CREATE POLICY "Students view only their own marks"
  ON public.marks
  FOR SELECT
  TO authenticated
  USING (
    student_id = public.get_auth_student_id()
    OR public.is_admin()
  );

CREATE POLICY "Parents view only their children marks"
  ON public.marks
  FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT student_id FROM public.guardian_student_mappings WHERE parent_user_id = auth.uid()
    )
    OR public.is_admin()
  );

-- ==============================================================================
-- 7. HELPDESK & TICKETS POLICIES
-- ==============================================================================
CREATE POLICY "Admins full CRUD on helpdesk tickets"
  ON public.helpdesk_tickets
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Users can create and view their own tickets"
  ON public.helpdesk_tickets
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can insert their own ticket"
  ON public.helpdesk_tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ==============================================================================
-- 8. AUDIT LOGS (APPEND-ONLY FOR SECURITY)
-- ==============================================================================
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "System and users can insert audit logs"
  ON public.audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
