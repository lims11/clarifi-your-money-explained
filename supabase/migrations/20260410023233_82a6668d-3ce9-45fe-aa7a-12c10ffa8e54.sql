
-- Credit scores table
CREATE TABLE IF NOT EXISTS public.credit_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  score integer NOT NULL DEFAULT 720,
  provider text DEFAULT 'Experian',
  rating text DEFAULT 'Good',
  last_updated date DEFAULT CURRENT_DATE,
  previous_score integer DEFAULT 710,
  factors jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.credit_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credit scores" ON public.credit_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own credit scores" ON public.credit_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own credit scores" ON public.credit_scores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own credit scores" ON public.credit_scores FOR DELETE USING (auth.uid() = user_id);

-- Net worth history table
CREATE TABLE IF NOT EXISTS public.net_worth_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  date date NOT NULL,
  net_worth numeric(12,2) NOT NULL,
  assets numeric(12,2),
  liabilities numeric(12,2),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.net_worth_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own net worth history" ON public.net_worth_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own net worth history" ON public.net_worth_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own net worth history" ON public.net_worth_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own net worth history" ON public.net_worth_history FOR DELETE USING (auth.uid() = user_id);
