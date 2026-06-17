export const customers = [
  { id: 1, name: 'Rajesh Hardware', phone: '+94 77 123 4567', customerType: 'Shop', address: '45 Main St, Colombo', balance: 125000, status: 'active' },
  { id: 2, name: 'Sunrise Traders', phone: '+94 71 234 5678', customerType: 'Shop', address: '12 Galle Rd, Dehiwala', balance: 48200, status: 'active' },
  { id: 3, name: 'Metro Supplies', phone: '+94 76 345 6789', customerType: 'Construction', address: '88 Kandy Rd, Kadawatha', balance: 0, status: 'active' },
  { id: 4, name: 'Green Valley Stores', phone: '+94 70 456 7890', customerType: 'Shop', address: '3 Lake Rd, Negombo', balance: 67800, status: 'active' },
  { id: 5, name: 'City Mart', phone: '+94 75 567 8901', customerType: 'Person', address: '22 High St, Kurunegala', balance: 234500, status: 'overdue' },
];

export const bills = [
  { id: 'B-1042', customer: 'Rajesh Hardware', date: '2026-06-10', dueDate: '2026-07-10', amount: 45000, paid: 15000, status: 'partial' },
  { id: 'B-1043', customer: 'Sunrise Traders', date: '2026-06-12', dueDate: '2026-07-12', amount: 28500, paid: 0, status: 'pending' },
  { id: 'B-1044', customer: 'City Mart', date: '2026-05-15', dueDate: '2026-06-15', amount: 89000, paid: 0, status: 'overdue' },
  { id: 'B-1045', customer: 'Green Valley Stores', date: '2026-06-14', dueDate: '2026-07-14', amount: 32000, paid: 32000, status: 'paid' },
  { id: 'B-1046', customer: 'City Mart', date: '2026-05-20', dueDate: '2026-06-20', amount: 145500, paid: 20000, status: 'overdue' },
];

export const cashIn = [
  { id: 'P-301', customer: 'Rajesh Hardware', date: '2026-06-14', amount: 15000, method: 'Cash', reference: 'INV-1042' },
  { id: 'P-302', customer: 'Green Valley Stores', date: '2026-06-15', amount: 32000, method: 'Bank Transfer', reference: 'INV-1045' },
  { id: 'P-303', customer: 'Metro Supplies', date: '2026-06-16', amount: 52000, method: 'Cheque', reference: 'CHQ-8821' },
  { id: 'P-304', customer: 'Sunrise Traders', date: '2026-06-16', amount: 10000, method: 'Cash', reference: 'Partial pay' },
];

export const users = [
  { id: 1, name: 'Admin User', email: 'admin@shop.lk', role: 'Admin', status: 'active', lastLogin: '2026-06-17 08:30' },
  { id: 2, name: 'Kamal Perera', email: 'kamal@shop.lk', role: 'Cashier', status: 'active', lastLogin: '2026-06-17 09:15' },
  { id: 3, name: 'Nimal Silva', email: 'nimal@shop.lk', role: 'Manager', status: 'active', lastLogin: '2026-06-16 17:45' },
  { id: 4, name: 'Guest Account', email: 'guest@shop.lk', role: 'Viewer', status: 'inactive', lastLogin: '2026-05-28 11:00' },
];

export const cheques = [
  { id: 'CHQ-8821', customer: 'Metro Supplies', bank: 'Commercial Bank', chequeNo: '452189', amount: 52000, receivedDate: '2026-06-16', bankDate: '2026-06-20', status: 'to-bank' },
  { id: 'CHQ-8820', customer: 'Rajesh Hardware', bank: 'Sampath Bank', chequeNo: '778234', amount: 35000, receivedDate: '2026-06-12', bankDate: '2026-06-18', status: 'to-bank' },
  { id: 'CHQ-8819', customer: 'City Mart', bank: 'HNB', chequeNo: '991045', amount: 20000, receivedDate: '2026-06-10', bankDate: '2026-06-14', status: 'deposited' },
  { id: 'CHQ-8818', customer: 'Sunrise Traders', bank: 'BOC', chequeNo: '334567', amount: 18500, receivedDate: '2026-06-08', bankDate: '2026-06-12', status: 'cleared' },
];

export const dashboardStats = {
  totalRevenue: 284500,
  outstandingCredit: 412200,
  overdueAmount: 234500,
  activeCustomers: 5,
  billsThisMonth: 12,
  paymentsThisMonth: 8,
  chequesToBank: 2,
};

export const monthlyRevenue = [
  { month: 'Jan', amount: 180000 },
  { month: 'Feb', amount: 210000 },
  { month: 'Mar', amount: 195000 },
  { month: 'Apr', amount: 245000 },
  { month: 'May', amount: 268000 },
  { month: 'Jun', amount: 284500 },
];

export const recentActivity = [
  { time: '09:30 AM', label: 'Payment received — Metro Supplies', amount: 52000, type: 'payment' },
  { time: '10:15 AM', label: 'Credit bill created — Sunrise Traders', amount: 28500, type: 'bill' },
  { time: '11:00 AM', label: 'Cheque received — Rajesh Hardware', amount: 35000, type: 'cheque' },
  { time: '02:30 PM', label: 'Payment received — Green Valley Stores', amount: 32000, type: 'payment' },
  { time: '04:00 PM', label: 'Overdue reminder — City Mart', amount: 234500, type: 'alert' },
];

export function formatCurrency(amount) {
  return `Rs. ${amount.toLocaleString('en-LK')}`;
}

export function getOverdueBills() {
  return bills.filter((b) => b.status === 'overdue');
}
