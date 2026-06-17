import { NavLink, useNavigate } from 'react-router-dom';
import useSidebarExpanded from '../hooks/useSidebarExpanded';
import useAuth from '../context/AuthContext';
import useShop from '../context/ShopContext';
import { navItems } from '../config/navigation';
import { ChevronLeftIcon, ChevronRightIcon, LogoutIcon } from './icons';

export default function Sidebar() {
  const { expanded, toggle } = useSidebarExpanded();
  const { shop } = useShop();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initials = (user?.username || 'AD').slice(0, 2).toUpperCase();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <aside
      className={`flex h-screen shrink-0 flex-col overflow-y-auto border-r border-doc-border/60 bg-white py-8 transition-all duration-300 ease-in-out ${
        expanded ? 'w-60 px-4' : 'w-20 items-center lg:w-24'
      }`}
    >
      <div
        className={`mb-8 flex items-center ${
          expanded ? 'justify-between gap-2' : 'flex-col justify-center gap-3'
        }`}
      >
        <div className={expanded ? 'min-w-0' : 'flex justify-center'}>
          {expanded ? (
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-doc-primary text-xs font-bold text-white shadow-md shadow-doc-primary/30">
                {shop.shortName}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-bold leading-tight text-doc-primary">
                  {shop.name}
                </div>
                {shop.city ? (
                  <p className="truncate text-xs text-doc-muted">{shop.city}</p>
                ) : null}
              </div>
            </div>
          ) : (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-doc-primary text-sm font-bold text-white shadow-md shadow-doc-primary/30"
              title={shop.name}
            >
              {shop.shortName}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={toggle}
          title={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-expanded={expanded}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-doc-muted transition-colors hover:bg-doc-primary-light hover:text-doc-primary"
        >
          {expanded ? <ChevronLeftIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
        </button>
      </div>

      <nav className={`flex flex-1 flex-col gap-2 ${expanded ? 'w-full' : 'items-center gap-3'}`}>
        {navItems.map(({ id, label, icon: Icon, path }) => (
          <NavLink
            key={id}
            to={path}
            end={path === '/'}
            title={label}
            className={({ isActive }) =>
              `flex items-center rounded-xl transition-colors ${
                expanded ? 'gap-3 px-3 py-2.5' : 'h-11 w-11 justify-center'
              } ${
                isActive
                  ? 'bg-doc-primary text-white shadow-md shadow-doc-primary/30'
                  : 'text-doc-muted hover:bg-doc-primary-light hover:text-doc-primary'
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {expanded && (
              <span className="truncate text-sm font-medium">{label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div
        className={`mt-auto flex flex-col gap-3 ${
          expanded ? 'w-full' : 'items-center'
        }`}
      >
        <div
          className={`flex gap-2 ${
            expanded ? 'w-full items-center px-1' : 'flex-col items-center'
          }`}
        >
          <div className="relative shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-doc-primary-light text-sm font-semibold text-doc-primary">
              {initials}
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-doc-teal" />
          </div>
          {expanded && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-doc-navy">{user?.username || 'Admin'}</p>
              <p className="truncate text-xs text-doc-muted">Signed in</p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          title="Sign out"
          aria-label="Sign out"
          className={`flex items-center rounded-xl text-doc-muted transition-colors hover:bg-red-50 hover:text-red-600 ${
            expanded ? 'w-full gap-3 px-3 py-2.5' : 'h-11 w-11 justify-center'
          }`}
        >
          <LogoutIcon className="h-5 w-5 shrink-0" />
          {expanded && <span className="truncate text-sm font-medium">Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
