// Rich sample data for demo mode

const today = new Date();
const makeDate = (daysAgo: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};
const makeFutureDate = (daysAhead: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
};
const makeTimestamp = (daysAgo: number, hours = 12) => {
  const d = new Date(today);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hours, 0, 0, 0);
  return d.toISOString();
};

export const sampleAccounts = [
  { id: 'acc-1', user_id: 'demo', name: 'Barclays Current', type: 'current', balance: 2847.50, currency: 'GBP', institution: 'Barclays', colour: '#00AEEF', icon: 'bank', is_active: true, created_at: makeTimestamp(90), updated_at: makeTimestamp(0) },
  { id: 'acc-2', user_id: 'demo', name: 'Monzo Spending', type: 'current', balance: 412.30, currency: 'GBP', institution: 'Monzo', colour: '#FF3464', icon: 'bank', is_active: true, created_at: makeTimestamp(90), updated_at: makeTimestamp(0) },
  { id: 'acc-3', user_id: 'demo', name: 'Marcus Savings', type: 'savings', balance: 8200.00, currency: 'GBP', institution: 'Goldman Sachs', colour: '#1A1A1A', icon: 'piggy-bank', is_active: true, created_at: makeTimestamp(90), updated_at: makeTimestamp(0) },
  { id: 'acc-4', user_id: 'demo', name: 'Chase Saver', type: 'savings', balance: 3150.00, currency: 'GBP', institution: 'Chase UK', colour: '#117ACA', icon: 'piggy-bank', is_active: true, created_at: makeTimestamp(60), updated_at: makeTimestamp(0) },
  { id: 'acc-5', user_id: 'demo', name: 'Amex Gold', type: 'credit_card', balance: -1340.00, currency: 'GBP', institution: 'American Express', colour: '#007BC1', icon: 'credit-card', is_active: true, created_at: makeTimestamp(90), updated_at: makeTimestamp(0) },
  { id: 'acc-6', user_id: 'demo', name: 'Barclaycard Visa', type: 'credit_card', balance: -486.20, currency: 'GBP', institution: 'Barclays', colour: '#00AEEF', icon: 'credit-card', is_active: true, created_at: makeTimestamp(60), updated_at: makeTimestamp(0) },
  { id: 'acc-7', user_id: 'demo', name: 'Vanguard ISA', type: 'investment', balance: 14500.00, currency: 'GBP', institution: 'Vanguard', colour: '#961A1A', icon: 'chart', is_active: true, created_at: makeTimestamp(90), updated_at: makeTimestamp(0) },
  { id: 'acc-8', user_id: 'demo', name: 'Coinbase Portfolio', type: 'crypto', balance: 2340.00, currency: 'GBP', institution: 'Coinbase', colour: '#0052FF', icon: 'bitcoin', is_active: true, created_at: makeTimestamp(45), updated_at: makeTimestamp(0) },
];

export const sampleTransactions = [
  // This month - various categories
  { id: 'txn-01', user_id: 'demo', account_id: 'acc-1', amount: 3200.00, type: 'income', category: 'Income', subcategory: 'Salary', payee: 'Employer Salary', date: makeDate(9), is_recurring: true, is_cleared: true, created_at: makeTimestamp(9), description: null, ai_category_confidence: null, ai_category_reason: null },
  { id: 'txn-02', user_id: 'demo', account_id: 'acc-1', amount: -1200.00, type: 'expense', category: 'Bills', subcategory: 'Rent/Mortgage', payee: 'Landlord Direct Debit', date: makeDate(8), is_recurring: true, is_cleared: true, created_at: makeTimestamp(8), description: null, ai_category_confidence: 0.98, ai_category_reason: 'Matched to recurring rent payment' },
  { id: 'txn-03', user_id: 'demo', account_id: 'acc-1', amount: -142.00, type: 'expense', category: 'Bills', subcategory: 'Energy', payee: 'EDF Energy', date: makeDate(8), is_recurring: true, is_cleared: true, created_at: makeTimestamp(8), description: null, ai_category_confidence: 0.96, ai_category_reason: 'Energy provider identified' },
  { id: 'txn-04', user_id: 'demo', account_id: 'acc-1', amount: -187.00, type: 'expense', category: 'Bills', subcategory: 'Council Tax', payee: 'Council Tax DD', date: makeDate(7), is_recurring: true, is_cleared: true, created_at: makeTimestamp(7), description: null, ai_category_confidence: 0.99, ai_category_reason: 'Council tax direct debit' },
  { id: 'txn-05', user_id: 'demo', account_id: 'acc-2', amount: -87.40, type: 'expense', category: 'Food & Drink', subcategory: 'Groceries', payee: "Sainsbury's", date: makeDate(2), is_recurring: false, is_cleared: true, created_at: makeTimestamp(2), description: 'Weekly shop', ai_category_confidence: 0.94, ai_category_reason: "Matched 'Sainsbury's' to Groceries" },
  { id: 'txn-06', user_id: 'demo', account_id: 'acc-2', amount: -65.00, type: 'expense', category: 'Transport', subcategory: 'Fuel', payee: 'Shell Petrol', date: makeDate(3), is_recurring: false, is_cleared: true, created_at: makeTimestamp(3), description: null, ai_category_confidence: 0.92, ai_category_reason: 'Fuel station merchant' },
  { id: 'txn-07', user_id: 'demo', account_id: 'acc-2', amount: -4.80, type: 'expense', category: 'Food & Drink', subcategory: 'Coffee', payee: 'Caffè Nero', date: makeDate(1), is_recurring: false, is_cleared: true, created_at: makeTimestamp(1, 8), description: null, ai_category_confidence: 0.97, ai_category_reason: "Matched 'Caffè Nero' to Coffee" },
  { id: 'txn-08', user_id: 'demo', account_id: 'acc-2', amount: -3.90, type: 'expense', category: 'Food & Drink', subcategory: 'Coffee', payee: 'Pret A Manger', date: makeDate(3), is_recurring: false, is_cleared: true, created_at: makeTimestamp(3, 9), description: null, ai_category_confidence: 0.95, ai_category_reason: "Matched 'Pret' to Coffee" },
  { id: 'txn-09', user_id: 'demo', account_id: 'acc-5', amount: -17.99, type: 'expense', category: 'Entertainment', subcategory: 'Subscriptions', payee: 'Netflix', date: makeDate(5), is_recurring: true, is_cleared: true, created_at: makeTimestamp(5), description: null, ai_category_confidence: 0.99, ai_category_reason: 'Known subscription service' },
  { id: 'txn-10', user_id: 'demo', account_id: 'acc-5', amount: -11.99, type: 'expense', category: 'Entertainment', subcategory: 'Subscriptions', payee: 'Spotify Premium', date: makeDate(4), is_recurring: true, is_cleared: true, created_at: makeTimestamp(4), description: null, ai_category_confidence: 0.99, ai_category_reason: 'Known subscription service' },
  { id: 'txn-11', user_id: 'demo', account_id: 'acc-5', amount: -34.99, type: 'expense', category: 'Shopping', subcategory: 'Electronics', payee: 'Amazon', date: makeDate(4), is_recurring: false, is_cleared: true, created_at: makeTimestamp(4), description: 'USB-C hub', ai_category_confidence: 0.88, ai_category_reason: 'Amazon purchase, Electronics inferred from amount' },
  { id: 'txn-12', user_id: 'demo', account_id: 'acc-5', amount: -89.00, type: 'expense', category: 'Shopping', subcategory: 'Clothing', payee: 'Zara', date: makeDate(6), is_recurring: false, is_cleared: true, created_at: makeTimestamp(6), description: null, ai_category_confidence: 0.93, ai_category_reason: 'Clothing retailer identified' },
  { id: 'txn-13', user_id: 'demo', account_id: 'acc-2', amount: -28.50, type: 'expense', category: 'Food & Drink', subcategory: 'Takeaway', payee: 'Uber Eats', date: makeDate(1), is_recurring: false, is_cleared: true, created_at: makeTimestamp(1, 19), description: 'Thai food', ai_category_confidence: 0.96, ai_category_reason: 'Food delivery platform' },
  { id: 'txn-14', user_id: 'demo', account_id: 'acc-2', amount: -14.50, type: 'expense', category: 'Food & Drink', subcategory: 'Takeaway', payee: 'Deliveroo', date: makeDate(5), is_recurring: false, is_cleared: true, created_at: makeTimestamp(5, 20), description: null, ai_category_confidence: 0.96, ai_category_reason: 'Food delivery platform' },
  { id: 'txn-15', user_id: 'demo', account_id: 'acc-2', amount: -42.00, type: 'expense', category: 'Food & Drink', subcategory: 'Restaurants', payee: 'Wagamama', date: makeDate(3), is_recurring: false, is_cleared: true, created_at: makeTimestamp(3, 19), description: 'Dinner with friends', ai_category_confidence: 0.95, ai_category_reason: 'Restaurant chain identified' },
  { id: 'txn-16', user_id: 'demo', account_id: 'acc-1', amount: -45.00, type: 'expense', category: 'Transport', subcategory: 'Public transport', payee: 'TfL Contactless', date: makeDate(2), is_recurring: false, is_cleared: true, created_at: makeTimestamp(2), description: 'Weekly travel', ai_category_confidence: 0.98, ai_category_reason: 'Transport for London payment' },
  { id: 'txn-17', user_id: 'demo', account_id: 'acc-6', amount: -39.99, type: 'expense', category: 'Health', subcategory: 'Gym', payee: 'PureGym', date: makeDate(1), is_recurring: true, is_cleared: true, created_at: makeTimestamp(1), description: null, ai_category_confidence: 0.97, ai_category_reason: 'Gym membership identified' },
  { id: 'txn-18', user_id: 'demo', account_id: 'acc-2', amount: -52.30, type: 'expense', category: 'Food & Drink', subcategory: 'Groceries', payee: 'Tesco', date: makeDate(5), is_recurring: false, is_cleared: true, created_at: makeTimestamp(5), description: null, ai_category_confidence: 0.95, ai_category_reason: "Matched 'Tesco' to Groceries" },
  { id: 'txn-19', user_id: 'demo', account_id: 'acc-1', amount: -72.00, type: 'expense', category: 'Bills', subcategory: 'Broadband', payee: 'Virgin Media', date: makeDate(6), is_recurring: true, is_cleared: true, created_at: makeTimestamp(6), description: null, ai_category_confidence: 0.97, ai_category_reason: 'ISP payment identified' },
  { id: 'txn-20', user_id: 'demo', account_id: 'acc-2', amount: -15.00, type: 'expense', category: 'Personal', subcategory: 'Haircut', payee: 'Local Barber', date: makeDate(7), is_recurring: false, is_cleared: true, created_at: makeTimestamp(7), description: null, ai_category_confidence: 0.82, ai_category_reason: 'Barber/salon service inferred' },
  { id: 'txn-21', user_id: 'demo', account_id: 'acc-1', amount: -25.00, type: 'expense', category: 'Personal', subcategory: 'Charity', payee: 'British Red Cross DD', date: makeDate(8), is_recurring: true, is_cleared: true, created_at: makeTimestamp(8), description: null, ai_category_confidence: 0.91, ai_category_reason: 'Charity donation identified' },
  { id: 'txn-22', user_id: 'demo', account_id: 'acc-2', amount: -8.99, type: 'expense', category: 'Entertainment', subcategory: 'Games', payee: 'Steam', date: makeDate(2), is_recurring: false, is_cleared: true, created_at: makeTimestamp(2), description: null, ai_category_confidence: 0.94, ai_category_reason: 'Gaming platform identified' },
  { id: 'txn-23', user_id: 'demo', account_id: 'acc-1', amount: 150.00, type: 'income', category: 'Income', subcategory: 'Freelance', payee: 'Client Payment', date: makeDate(4), is_recurring: false, is_cleared: true, created_at: makeTimestamp(4), description: 'Website project', ai_category_confidence: null, ai_category_reason: null },
  { id: 'txn-24', user_id: 'demo', account_id: 'acc-2', amount: -6.50, type: 'expense', category: 'Food & Drink', subcategory: 'Coffee', payee: 'Starbucks', date: makeDate(0), is_recurring: false, is_cleared: false, created_at: makeTimestamp(0, 10), description: null, ai_category_confidence: 0.97, ai_category_reason: "Matched 'Starbucks' to Coffee" },
  { id: 'txn-25', user_id: 'demo', account_id: 'acc-6', amount: -24.99, type: 'expense', category: 'Shopping', subcategory: 'Books', payee: 'Waterstones', date: makeDate(1), is_recurring: false, is_cleared: true, created_at: makeTimestamp(1), description: null, ai_category_confidence: 0.90, ai_category_reason: 'Bookstore identified' },
];

export const sampleBudgets = [
  { id: 'bud-1', user_id: 'demo', name: 'Groceries', category: 'Food & Drink', amount: 400, period: 'monthly', colour: '#1D9E75', created_at: makeTimestamp(60) },
  { id: 'bud-2', user_id: 'demo', name: 'Eating out', category: 'Food & Drink', amount: 200, period: 'monthly', colour: '#D85A30', created_at: makeTimestamp(60) },
  { id: 'bud-3', user_id: 'demo', name: 'Transport', category: 'Transport', amount: 150, period: 'monthly', colour: '#EF9F27', created_at: makeTimestamp(60) },
  { id: 'bud-4', user_id: 'demo', name: 'Shopping', category: 'Shopping', amount: 250, period: 'monthly', colour: '#378ADD', created_at: makeTimestamp(60) },
  { id: 'bud-5', user_id: 'demo', name: 'Entertainment', category: 'Entertainment', amount: 80, period: 'monthly', colour: '#7F77DD', created_at: makeTimestamp(60) },
  { id: 'bud-6', user_id: 'demo', name: 'Bills', category: 'Bills', amount: 1700, period: 'monthly', colour: '#E24B4A', created_at: makeTimestamp(60) },
];

export const sampleGoals = [
  { id: 'goal-1', user_id: 'demo', name: 'Emergency Fund', target_amount: 10000, current_amount: 8200, target_date: makeFutureDate(180), colour: '#1D9E75', icon: 'shield', created_at: makeTimestamp(120) },
  { id: 'goal-2', user_id: 'demo', name: 'House Deposit', target_amount: 30000, current_amount: 11350, target_date: makeFutureDate(730), colour: '#7F77DD', icon: 'home', created_at: makeTimestamp(90) },
  { id: 'goal-3', user_id: 'demo', name: 'Japan Holiday', target_amount: 4000, current_amount: 1600, target_date: makeFutureDate(300), colour: '#EF9F27', icon: 'plane', created_at: makeTimestamp(45) },
];

export const samplePulseAlerts = [
  { id: 'pulse-1', user_id: 'demo', title: 'Your takeaway spending is up 40% from last month', body: 'You spent £43.00 on takeaways this month compared to £30.50 last month. At this rate, you\'ll spend £86 by month-end — consider cooking at home a few more nights.', type: 'warning', is_read: false, created_at: makeTimestamp(0, 14), action_label: 'Review budget' },
  { id: 'pulse-2', user_id: 'demo', title: "You're £1,800 away from your Emergency Fund", body: "At your current saving rate of ~£600/month, you'll hit your £10,000 target in about 3 months. You're 82% of the way there — keep going!", type: 'insight', is_read: false, created_at: makeTimestamp(0, 10), action_label: 'View goal' },
  { id: 'pulse-3', user_id: 'demo', title: 'Pay your Amex in full to save ~£268/year', body: 'Your Amex Gold balance is £1,340. Paying it off monthly avoids compound interest charges at the typical 20% APR.', type: 'tip', is_read: false, created_at: makeTimestamp(1, 18), action_label: 'View account' },
  { id: 'pulse-4', user_id: 'demo', title: 'Coffee spending: £15.20 this month across 4 visits', body: "That's on track for ~£45/month (£540/year). Consider making coffee at home — a good grinder + beans costs ~£3/day instead of ~£5.", type: 'tip', is_read: true, created_at: makeTimestamp(1, 9), action_label: null },
  { id: 'pulse-5', user_id: 'demo', title: 'Groceries budget is 35% used with 21 days left', body: "You've spent £139.70 of your £400 groceries budget. You're well on track this month — great discipline!", type: 'success', is_read: true, created_at: makeTimestamp(2, 10), action_label: 'View budget' },
  { id: 'pulse-6', user_id: 'demo', title: 'You have 5 active subscriptions totalling £69.97/month', body: "Netflix (£17.99), Spotify (£11.99), PureGym (£39.99). That's £839.64/year — review whether you're using them all.", type: 'insight', is_read: true, created_at: makeTimestamp(3, 15), action_label: null },
  { id: 'pulse-7', user_id: 'demo', title: 'House Deposit goal: 38% funded!', body: 'You\'ve saved £11,350 of your £30,000 target. At £600/month, you\'ll reach your goal in about 31 months (November 2028).', type: 'insight', is_read: true, created_at: makeTimestamp(4, 11), action_label: 'View goal' },
];

export const sampleScheduledTransactions = [
  { id: 'sched-1', user_id: 'demo', account_id: 'acc-1', name: 'Rent', amount: -1200, type: 'expense', category: 'Bills', frequency: 'monthly', next_date: makeFutureDate(18), payee: 'Landlord', is_active: true, created_at: makeTimestamp(90) },
  { id: 'sched-2', user_id: 'demo', account_id: 'acc-1', name: 'Salary', amount: 3200, type: 'income', category: 'Income', frequency: 'monthly', next_date: makeFutureDate(21), payee: 'Employer', is_active: true, created_at: makeTimestamp(90) },
  { id: 'sched-3', user_id: 'demo', account_id: 'acc-5', name: 'Netflix', amount: -17.99, type: 'expense', category: 'Entertainment', frequency: 'monthly', next_date: makeFutureDate(25), payee: 'Netflix', is_active: true, created_at: makeTimestamp(60) },
  { id: 'sched-4', user_id: 'demo', account_id: 'acc-1', name: 'EDF Energy', amount: -142.00, type: 'expense', category: 'Bills', frequency: 'monthly', next_date: makeFutureDate(22), payee: 'EDF Energy', is_active: true, created_at: makeTimestamp(90) },
  { id: 'sched-5', user_id: 'demo', account_id: 'acc-1', name: 'Council Tax', amount: -187.00, type: 'expense', category: 'Bills', frequency: 'monthly', next_date: makeFutureDate(23), payee: 'Council Tax DD', is_active: true, created_at: makeTimestamp(90) },
  { id: 'sched-6', user_id: 'demo', account_id: 'acc-5', name: 'Spotify', amount: -11.99, type: 'expense', category: 'Entertainment', frequency: 'monthly', next_date: makeFutureDate(26), payee: 'Spotify Premium', is_active: true, created_at: makeTimestamp(45) },
  { id: 'sched-7', user_id: 'demo', account_id: 'acc-6', name: 'PureGym', amount: -39.99, type: 'expense', category: 'Health', frequency: 'monthly', next_date: makeFutureDate(29), payee: 'PureGym', is_active: true, created_at: makeTimestamp(30) },
  { id: 'sched-8', user_id: 'demo', account_id: 'acc-1', name: 'Virgin Media', amount: -72.00, type: 'expense', category: 'Bills', frequency: 'monthly', next_date: makeFutureDate(24), payee: 'Virgin Media', is_active: true, created_at: makeTimestamp(60) },
];

export const sampleChatMessages = [
  { id: 'chat-1', user_id: 'demo', role: 'assistant', content: "Hi! I'm Clarifi, your personal finance coach. I can see your accounts, transactions, and goals. Ask me anything — like \"Am I spending too much on eating out?\" or \"How's my savings rate?\"", created_at: makeTimestamp(1, 10) },
];

export const sampleProfile = {
  id: 'demo',
  full_name: 'Alex',
  currency: 'GBP',
  onboarding_complete: true,
  onboarding_step: 8,
  created_at: makeTimestamp(90),
  updated_at: makeTimestamp(0),
};

export const netWorthHistory = [
  { month: 'Nov', value: 24800 },
  { month: 'Dec', value: 25400 },
  { month: 'Jan', value: 26100 },
  { month: 'Feb', value: 27200 },
  { month: 'Mar', value: 28900 },
  { month: 'Apr', value: 29623.60 },
];
