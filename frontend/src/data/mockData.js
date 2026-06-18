export const DEFAULT_OVERDUE_DAYS = 14;

export function formatCurrency(amount) {
  return `Rs. ${amount.toLocaleString('en-LK')}`;
}
