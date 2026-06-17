import { useLocation } from 'react-router-dom';
import { getPageTitle } from '../config/navigation';
import useAuth from '../context/AuthContext';
import { useCustomers } from '../context/CustomersContext';
import useShop from '../context/ShopContext';
import { BellIcon, SearchIcon } from './icons';

export default function TopNavbar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { customerList } = useCustomers();
  const { shop } = useShop();
  const pageTitle = getPageTitle(pathname, customerList);
  const initials = (user?.username || 'AD').slice(0, 2).toUpperCase();

  return (
    <header className="z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-doc-border/60 bg-white px-6 lg:px-8">
      <div className="min-w-0">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-doc-muted">
          {shop.name}
          {shop.city ? ` · ${shop.city}` : ''}
        </p>
        <h2 className="truncate text-lg font-bold text-doc-navy">{pageTitle}</h2>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4">
        <label className="relative hidden max-w-xs flex-1 sm:block lg:max-w-sm">
          <span className="sr-only">Search</span>
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-doc-muted" />
          <input
            type="search"
            placeholder="Search customers, bills..."
            className="w-full rounded-xl border border-doc-border/60 bg-doc-bg py-2 pl-10 pr-4 text-sm text-doc-navy outline-none transition-colors placeholder:text-doc-muted focus:border-doc-primary focus:ring-2 focus:ring-doc-primary/20"
          />
        </label>

        <button
          type="button"
          title="Notifications"
          aria-label="Notifications"
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-doc-muted transition-colors hover:bg-doc-primary-light hover:text-doc-primary"
        >
          <BellIcon className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="hidden items-center gap-3 border-l border-doc-border/60 pl-4 sm:flex">
          <div className="text-right">
            <p className="text-sm font-semibold text-doc-navy">{user?.username || 'Admin'}</p>
          </div>
          <div className="relative shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-doc-primary-light text-sm font-semibold text-doc-primary">
              {initials}
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-doc-teal" />
          </div>
        </div>
      </div>
    </header>
  );
}
