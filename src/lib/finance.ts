export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date));
};

export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(date);
};

export const categoryIcons: Record<string, string> = {
  'Groceries': '🛒',
  'Transport': '🚗',
  'Income': '💰',
  'Entertainment': '🎬',
  'Food & Drink': '☕',
  'Shopping': '🛍️',
  'Bills': '📄',
  'Clothing': '👕',
  'Health': '💊',
  'Travel': '✈️',
  'Education': '📚',
  'Personal': '👤',
  'Subscriptions': '📱',
};

export const categoryColours: Record<string, string> = {
  'Groceries': '#1D9E75',
  'Transport': '#EF9F27',
  'Income': '#1D9E75',
  'Entertainment': '#7F77DD',
  'Food & Drink': '#D85A30',
  'Shopping': '#534AB7',
  'Bills': '#EF9F27',
  'Clothing': '#7F77DD',
};
