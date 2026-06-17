import {
  DashboardIcon,
  PatientsIcon,
  BillsIcon,
  CashInIcon,
  UsersIcon,
  OverdueIcon,
  ChequeIcon,
  IntegrationsIcon,
} from '../components/icons';
import { customers as defaultCustomers } from '../data/mockData';

export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, path: '/' },
  { id: 'customers', label: 'Customers', icon: PatientsIcon, path: '/customers' },
  { id: 'bills', label: 'Bills', icon: BillsIcon, path: '/bills' },
  { id: 'cash-in', label: 'Cash In', icon: CashInIcon, path: '/cash-in' },
  { id: 'users', label: 'Users', icon: UsersIcon, path: '/users' },
  { id: 'overdue', label: 'Overdue Bills', icon: OverdueIcon, path: '/overdue-bills' },
  { id: 'cheques', label: 'Cheques', icon: ChequeIcon, path: '/cheques' },
  { id: 'integrations', label: 'Integrations', icon: IntegrationsIcon, path: '/integrations' },
];

export function getPageTitle(pathname, customerList = defaultCustomers) {
  const customerMatch = pathname.match(/^\/customers\/(\d+)$/);
  if (customerMatch) {
    const customer = customerList.find((item) => item.id === Number(customerMatch[1]));
    return customer?.name ?? 'Customer';
  }

  const item = navItems.find(({ path }) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path)
  );
  return item?.label ?? 'Shop Handle';
}
