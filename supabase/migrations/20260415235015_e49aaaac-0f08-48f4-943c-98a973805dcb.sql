
-- Statement uploads tracking
CREATE TABLE IF NOT EXISTS public.statement_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  filename text NOT NULL,
  bank_id text NOT NULL,
  file_format text NOT NULL,
  transactions_found integer DEFAULT 0,
  transactions_imported integer DEFAULT 0,
  period_start date,
  period_end date,
  status text DEFAULT 'pending',
  error_message text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.statement_uploads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own uploads" ON public.statement_uploads FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Subscriptions (manual entry)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  service_name text NOT NULL,
  amount numeric(10,2) NOT NULL,
  billing_day integer,
  billing_frequency text DEFAULT 'monthly',
  account_id uuid REFERENCES public.accounts(id) ON DELETE SET NULL,
  usage_status text DEFAULT 'unknown',
  last_survey_date date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own subscriptions" ON public.subscriptions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Subscription usage surveys
CREATE TABLE IF NOT EXISTS public.subscription_surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subscription_id uuid REFERENCES public.subscriptions(id) ON DELETE CASCADE NOT NULL,
  usage_level text NOT NULL,
  survey_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.subscription_surveys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own surveys" ON public.subscription_surveys FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Goal contributions log
CREATE TABLE IF NOT EXISTS public.goal_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  goal_id uuid REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
  amount numeric(10,2) NOT NULL,
  source_account_id uuid REFERENCES public.accounts(id) ON DELETE SET NULL,
  contribution_date date DEFAULT CURRENT_DATE,
  note text,
  is_recurring boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.goal_contributions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own contributions" ON public.goal_contributions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Reminder preferences
CREATE TABLE IF NOT EXISTS public.reminder_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  frequency text NOT NULL,
  channels jsonb DEFAULT '["in_app"]',
  payday_date integer,
  is_active boolean DEFAULT true,
  last_sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.reminder_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own reminders" ON public.reminder_preferences FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Budget manual overrides
CREATE TABLE IF NOT EXISTS public.budget_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  budget_id uuid REFERENCES public.budgets(id) ON DELETE CASCADE NOT NULL,
  override_date date DEFAULT CURRENT_DATE,
  original_amount numeric(10,2),
  overridden_amount numeric(10,2),
  reason text,
  override_type text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.budget_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own overrides" ON public.budget_overrides FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Report exports tracking
CREATE TABLE IF NOT EXISTS public.report_exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  report_type text NOT NULL,
  period_start date,
  period_end date,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.report_exports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own reports" ON public.report_exports FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
