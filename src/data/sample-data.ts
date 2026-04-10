// Sample data for the app before real Supabase integration

export const sampleAccounts = [
  { id: '1', name: 'Barclays Current', type: 'current', balance: 2847.50, currency: 'GBP', institution: 'Barclays', colour: '#7F77DD', icon: 'bank', is_active: true },
  { id: '2', name: 'Marcus Savings', type: 'savings', balance: 8200.00, currency: 'GBP', institution: 'Goldman Sachs', colour: '#1D9E75', icon: 'piggy-bank', is_active: true },
  { id: '3', name: 'Amex Credit Card', type: 'credit_card', balance: -1340.00, currency: 'GBP', institution: 'American Express', colour: '#D85A30', icon: 'credit-card', is_active: true },
];

export const sampleTransactions = [
  { id: '1', account_id: '1', amount: -87.40, type: 'expense', category: 'Groceries', payee: "Sainsbury's", date: '2026-04-08', is_recurring: false },
  { id: '2', account_id: '1', amount: -65.00, type: 'expense', category: 'Transport', subcategory: 'Fuel', payee: 'Shell Petrol', date: '2026-04-07', is_recurring: false },
  { id: '3', account_id: '1', amount: 3200.00, type: 'income', category: 'Income', payee: 'Employer Salary', date: '2026-04-01', is_recurring: true },
  { id: '4', account_id: '1', amount: -17.99, type: 'expense', category: 'Entertainment', subcategory: 'Subscriptions', payee: 'Netflix', date: '2026-04-05', is_recurring: true },
  { id: '5', account_id: '1', amount: -4.80, type: 'expense', category: 'Food & Drink', subcategory: 'Coffee', payee: 'Caffè Nero', date: '2026-04-06', is_recurring: false },
  { id: '6', account_id: '1', amount: -34.99, type: 'expense', category: 'Shopping', payee: 'Amazon', date: '2026-04-04', is_recurring: false },
  { id: '7', account_id: '1', amount: -187.00, type: 'expense', category: 'Bills', subcategory: 'Council Tax', payee: 'Council Tax DD', date: '2026-04-03', is_recurring: true },
  { id: '8', account_id: '1', amount: -89.00, type: 'expense', category: 'Clothing', payee: 'Zara', date: '2026-04-02', is_recurring: false },
  { id: '9', account_id: '1', amount: -28.50, type: 'expense', category: 'Food & Drink', subcategory: 'Takeaway', payee: 'Uber Eats', date: '2026-04-06', is_recurring: false },
  { id: '10', account_id: '1', amount: -142.00, type: 'expense', category: 'Bills', subcategory: 'Energy', payee: 'EDF Energy', date: '2026-04-01', is_recurring: true },
];

export const sampleBudgets = [
  { id: '1', name: 'Groceries', category: 'Groceries', amount: 400, period: 'monthly', colour: '#1D9E75', spent: 87.40 },
  { id: '2', name: 'Eating out', category: 'Food & Drink', amount: 200, period: 'monthly', colour: '#D85A30', spent: 28.50 },
  { id: '3', name: 'Transport', category: 'Transport', amount: 150, period: 'monthly', colour: '#EF9F27', spent: 65.00 },
];

export const sampleGoals = [
  { id: '1', name: 'Emergency Fund', target_amount: 10000, current_amount: 8200, target_date: '2026-10-10', colour: '#1D9E75', icon: 'shield' },
];

export const samplePulseAlerts = [
  { id: '1', title: 'Your takeaway spending is up 40% from last month', body: 'You spent £28.50 on takeaways this month compared to £20.30 last month. Watch this trend.', type: 'warning', is_read: false, created_at: '2026-04-09T14:30:00Z' },
  { id: '2', title: "You're £1,800 away from your Emergency Fund", body: "At your current saving rate of £600/month, you'll hit your £10,000 target in about 3 months.", type: 'insight', is_read: false, created_at: '2026-04-09T10:00:00Z' },
  { id: '3', title: 'Pay your Amex in full to save ~£268/year', body: 'Your Amex balance is £1,340. Paying it off monthly avoids compound interest charges.', type: 'tip', is_read: true, created_at: '2026-04-08T18:00:00Z' },
];

export const sampleScheduled = [
  { id: '1', name: 'Rent', amount: -1200, type: 'expense', category: 'Bills', frequency: 'monthly', next_date: '2026-04-28', payee: 'Landlord' },
  { id: '2', name: 'Salary', amount: 3200, type: 'income', category: 'Income', frequency: 'monthly', next_date: '2026-05-01', payee: 'Employer' },
  { id: '3', name: 'Netflix', amount: -17.99, type: 'expense', category: 'Entertainment', frequency: 'monthly', next_date: '2026-05-05', payee: 'Netflix' },
];

export const netWorthHistory = [
  { month: 'Nov', value: 8200 },
  { month: 'Dec', value: 8600 },
  { month: 'Jan', value: 9100 },
  { month: 'Feb', value: 9300 },
  { month: 'Mar', value: 9500 },
  { month: 'Apr', value: 9707.50 },
];
