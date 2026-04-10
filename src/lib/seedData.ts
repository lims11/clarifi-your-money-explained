import { supabase } from '@/integrations/supabase/client';

export async function seedSampleData(userId: string) {
  // Create sample accounts
  const { data: accounts } = await supabase.from('accounts').insert([
    { user_id: userId, name: 'Barclays Current', type: 'current', balance: 2847.50, currency: 'GBP', institution: 'Barclays', colour: '#00AEEF', icon: 'bank' },
    { user_id: userId, name: 'Marcus Savings', type: 'savings', balance: 8200.00, currency: 'GBP', institution: 'Goldman Sachs', colour: '#1A1A1A', icon: 'piggy-bank' },
    { user_id: userId, name: 'Amex Credit Card', type: 'credit_card', balance: -1340.00, currency: 'GBP', institution: 'American Express', colour: '#007BC1', icon: 'credit-card' },
  ]).select();

  if (!accounts || accounts.length === 0) return;
  const currentId = accounts[0].id;

  // Create sample transactions
  const today = new Date();
  const makeDate = (daysAgo: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  };

  await supabase.from('transactions').insert([
    { user_id: userId, account_id: currentId, amount: -87.40, type: 'expense', category: 'Food & Drink', subcategory: 'Groceries', payee: "Sainsbury's", date: makeDate(2), is_recurring: false },
    { user_id: userId, account_id: currentId, amount: -65.00, type: 'expense', category: 'Transport', subcategory: 'Fuel', payee: 'Shell Petrol', date: makeDate(3), is_recurring: false },
    { user_id: userId, account_id: currentId, amount: 3200.00, type: 'income', category: 'Income', payee: 'Employer Salary', date: makeDate(9), is_recurring: true },
    { user_id: userId, account_id: currentId, amount: -17.99, type: 'expense', category: 'Entertainment', subcategory: 'Subscriptions', payee: 'Netflix', date: makeDate(5), is_recurring: true },
    { user_id: userId, account_id: currentId, amount: -4.80, type: 'expense', category: 'Food & Drink', subcategory: 'Coffee', payee: 'Caffè Nero', date: makeDate(4), is_recurring: false },
    { user_id: userId, account_id: currentId, amount: -34.99, type: 'expense', category: 'Shopping', payee: 'Amazon', date: makeDate(6), is_recurring: false },
    { user_id: userId, account_id: currentId, amount: -187.00, type: 'expense', category: 'Bills', subcategory: 'Council Tax', payee: 'Council Tax DD', date: makeDate(7), is_recurring: true },
    { user_id: userId, account_id: currentId, amount: -89.00, type: 'expense', category: 'Shopping', subcategory: 'Clothing', payee: 'Zara', date: makeDate(8), is_recurring: false },
    { user_id: userId, account_id: currentId, amount: -28.50, type: 'expense', category: 'Food & Drink', subcategory: 'Takeaway', payee: 'Uber Eats', date: makeDate(4), is_recurring: false },
    { user_id: userId, account_id: currentId, amount: -142.00, type: 'expense', category: 'Bills', subcategory: 'Energy', payee: 'EDF Energy', date: makeDate(9), is_recurring: true },
  ]);

  // Create sample budgets
  await supabase.from('budgets').insert([
    { user_id: userId, name: 'Groceries', category: 'Food & Drink', amount: 400, period: 'monthly', colour: '#1D9E75' },
    { user_id: userId, name: 'Eating out', category: 'Food & Drink', amount: 200, period: 'monthly', colour: '#D85A30' },
    { user_id: userId, name: 'Transport', category: 'Transport', amount: 150, period: 'monthly', colour: '#EF9F27' },
  ]);

  // Create sample goal
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
  await supabase.from('goals').insert([
    { user_id: userId, name: 'Emergency Fund', target_amount: 10000, current_amount: 8200, target_date: sixMonthsFromNow.toISOString().split('T')[0], colour: '#1D9E75', icon: 'shield' },
  ]);

  // Create scheduled transactions
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  await supabase.from('scheduled_transactions').insert([
    { user_id: userId, account_id: currentId, name: 'Rent', amount: -1200, type: 'expense', category: 'Bills', frequency: 'monthly', next_date: makeDate(-18), payee: 'Landlord' },
    { user_id: userId, account_id: currentId, name: 'Salary', amount: 3200, type: 'income', category: 'Income', frequency: 'monthly', next_date: nextMonth.toISOString().split('T')[0], payee: 'Employer' },
    { user_id: userId, account_id: currentId, name: 'Netflix', amount: -17.99, type: 'expense', category: 'Entertainment', frequency: 'monthly', next_date: makeDate(-25), payee: 'Netflix' },
  ]);

  // Create pulse alerts
  await supabase.from('pulse_alerts').insert([
    { user_id: userId, title: 'Your takeaway spending is up 40% from last month', body: "You spent £28.50 on takeaways this month compared to £20.30 last month. Watch this trend.", type: 'warning' },
    { user_id: userId, title: "You're £1,800 away from your Emergency Fund", body: "At your current saving rate of £600/month, you'll hit your £10,000 target in about 3 months.", type: 'insight' },
    { user_id: userId, title: 'Pay your Amex in full to save ~£268/year', body: 'Your Amex balance is £1,340. Paying it off monthly avoids compound interest charges.', type: 'tip' },
  ]);
}
