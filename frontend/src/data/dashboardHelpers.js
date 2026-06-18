import { getCustomerClosingBalance, getOverdueBills, isBillOverdue } from './customerHelpers';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function toLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getLastNDays(count, referenceDate = new Date()) {
  const days = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    const date = new Date(referenceDate);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    days.push({
      date: toLocalDateString(date),
      label: date.toLocaleDateString('en-LK', { month: 'short', day: 'numeric' }),
    });
  }
  return days;
}

function parseYearMonth(dateString) {
  const [year, month] = dateString.split('-');
  return { year: Number(year), month: Number(month) };
}

function isSameMonth(dateString, referenceDate = new Date()) {
  const { year, month } = parseYearMonth(dateString);
  return year === referenceDate.getFullYear() && month === referenceDate.getMonth() + 1;
}

function getLast6Months(referenceDate = new Date()) {
  const months = [];
  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1);
    months.push({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      label: MONTH_LABELS[date.getMonth()],
    });
  }
  return months;
}

export function computeDailyCashFlow(paymentList, billList, referenceDate = new Date(), dayCount = 14) {
  return getLastNDays(dayCount, referenceDate).map(({ date, label }) => ({
    date,
    label,
    cashIn: paymentList
      .filter((payment) => payment.date === date)
      .reduce((sum, payment) => sum + payment.amount, 0),
    cashOut: billList
      .filter((bill) => bill.date === date)
      .reduce((sum, bill) => sum + bill.amount, 0),
  }));
}

export function computeMonthlyRevenue(paymentList, referenceDate = new Date()) {
  const months = getLast6Months(referenceDate);
  const currentYear = referenceDate.getFullYear();
  const currentMonth = referenceDate.getMonth() + 1;

  return months.map(({ year, month, label }) => {
    const amount = paymentList
      .filter((payment) => {
        const parsed = parseYearMonth(payment.date);
        return parsed.year === year && parsed.month === month;
      })
      .reduce((sum, payment) => sum + payment.amount, 0);

    return {
      month: label,
      amount,
      isCurrent: year === currentYear && month === currentMonth,
    };
  });
}

export function computeDashboardStats({
  customerList,
  billList,
  paymentList,
  chequeList,
  collections,
}) {
  const now = new Date();
  const overdueBills = getOverdueBills(billList);

  return {
    totalRevenue: paymentList
      .filter((payment) => isSameMonth(payment.date, now))
      .reduce((sum, payment) => sum + payment.amount, 0),
    outstandingCredit: customerList.reduce(
      (sum, customer) => sum + getCustomerClosingBalance(customer, collections),
      0,
    ),
    overdueAmount: overdueBills.reduce((sum, bill) => sum + (bill.amount - bill.paid), 0),
    activeCustomers: customerList.filter((customer) => customer.status === 'active').length,
    billsThisMonth: billList.filter((bill) => isSameMonth(bill.date, now)).length,
    paymentsThisMonth: paymentList.filter((payment) => isSameMonth(payment.date, now)).length,
    chequesToBank: chequeList.filter((cheque) => cheque.status === 'to-bank').length,
  };
}

function formatActivityDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const itemDate = new Date(date);
  itemDate.setHours(0, 0, 0, 0);

  const diffDays = Math.round((today - itemDate) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';

  return date.toLocaleDateString('en-LK', { month: 'short', day: 'numeric' });
}

export function computeRecentActivity({ billList, paymentList, chequeList }, limit = 8) {
  const items = [
    ...paymentList.map((payment) => ({
      date: payment.date,
      sortKey: `${payment.date}-payment-${payment.id}`,
      label: `Payment received — ${payment.customer}`,
      amount: payment.amount,
      type: 'payment',
    })),
    ...billList.map((bill) => ({
      date: bill.date,
      sortKey: `${bill.date}-bill-${bill.id}`,
      label: isBillOverdue(bill)
        ? `Overdue bill — ${bill.customer}`
        : `Credit bill created — ${bill.customer}`,
      amount: bill.amount,
      type: isBillOverdue(bill) ? 'alert' : 'bill',
    })),
    ...chequeList.map((cheque) => ({
      date: cheque.receivedDate,
      sortKey: `${cheque.receivedDate}-cheque-${cheque.id}`,
      label: `Cheque received — ${cheque.customer}`,
      amount: cheque.amount,
      type: 'cheque',
    })),
  ];

  items.sort((a, b) => b.sortKey.localeCompare(a.sortKey));

  return items.slice(0, limit).map((item) => ({
    ...item,
    time: formatActivityDate(item.date),
  }));
}
