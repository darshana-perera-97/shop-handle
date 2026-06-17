export function ChevronLeftIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronRightIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

export function BellIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PencilIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20h9" strokeLinecap="round" />
      <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DashboardIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function CalendarIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

export function PatientsIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
    </svg>
  );
}

export function SettingsIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

export function ClockIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function PersonIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3.1-5.5 7-5.5s7 2 7 5.5" />
    </svg>
  );
}

export function CoffeeIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 8h10v6a4 4 0 01-4 4H8a4 4 0 01-4-4V8z" />
      <path d="M16 10h2a2 2 0 012 2v1a2 2 0 01-2 2h-2" />
      <path d="M6 4v2" />
    </svg>
  );
}

export function ChatIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.02 2 10.75c0 2.63 1.35 4.98 3.5 6.58L4 22l5.2-2.6c.87.2 1.78.3 2.8.3 5.52 0 10-4.02 10-8.75S17.52 2 12 2z" />
    </svg>
  );
}

export function ReportIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M8 13h8M8 17h5" />
    </svg>
  );
}

export function HeartPulseIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      <path d="M8 12h2l1.5-3 2 6 1.5-3H16" />
    </svg>
  );
}

export function UserPlusIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="7" r="3.5" />
      <path d="M3 19c0-3 2.7-5 6-5" />
      <path d="M16 11v6M13 14h6" />
    </svg>
  );
}

export function BillsIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M8 13h8M8 17h5" />
      <path d="M8 9h2" />
    </svg>
  );
}

export function CashInIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M6 10h.01M18 14h.01" />
    </svg>
  );
}

export function UsersIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="7" r="3.5" />
      <path d="M3 19c0-3 2.7-5 6-5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M14 19c0-2 1.8-3.5 4-3.5" />
    </svg>
  );
}

export function OverdueIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
      <path d="M4.5 4.5l15 15" strokeLinecap="round" />
    </svg>
  );
}

export function ChequeIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M6 10h4M6 14h8" />
      <path d="M16 10l2 2-2 2" />
    </svg>
  );
}

export function IntegrationsIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 2v6M12 16v6" strokeLinecap="round" />
      <path d="M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24" strokeLinecap="round" />
      <path d="M2 12h6M16 12h6" strokeLinecap="round" />
      <path d="M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function RevenueIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 17l6-6 4 4 8-10" />
      <path d="M17 5h4v4" />
    </svg>
  );
}

export function LogoutIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ShopIllustration() {
  return (
    <svg viewBox="0 0 200 220" className="h-auto w-44" fill="none">
      <ellipse cx="100" cy="210" rx="70" ry="8" fill="#E8F0FE" />
      <rect x="40" y="90" width="120" height="100" rx="8" fill="#fff" stroke="#2D7FF9" strokeWidth="2" />
      <path d="M30 90 L100 50 L170 90" fill="#2D7FF9" stroke="#1A73E8" strokeWidth="2" />
      <rect x="75" y="130" width="50" height="60" rx="4" fill="#E8F0FE" stroke="#2D7FF9" strokeWidth="1.5" />
      <rect x="50" y="110" width="30" height="25" rx="2" fill="#E8F0FE" stroke="#2D7FF9" strokeWidth="1.5" />
      <rect x="120" y="110" width="30" height="25" rx="2" fill="#E8F0FE" stroke="#2D7FF9" strokeWidth="1.5" />
      <circle cx="100" cy="75" r="8" fill="#4FD1C5" />
      <path d="M85 75 h30" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

export function DoctorIllustration() {
  return (
    <svg viewBox="0 0 200 220" className="w-44 h-auto" fill="none">
      <ellipse cx="100" cy="210" rx="70" ry="8" fill="#E8F0FE" />
      <rect x="55" y="120" width="90" height="85" rx="12" fill="#fff" stroke="#2D7FF9" strokeWidth="2" />
      <path d="M70 120 V95 Q100 75 130 95 V120" fill="#F4D1C4" stroke="#E8B4A8" strokeWidth="1.5" />
      <circle cx="100" cy="65" r="32" fill="#F4D1C4" />
      <path d="M68 55 Q100 30 132 55 Q128 80 100 82 Q72 80 68 55" fill="#5C3D2E" />
      <rect x="88" y="108" width="24" height="8" rx="2" fill="#2D7FF9" />
      <path d="M75 145 L100 165 L125 145" stroke="#2D7FF9" strokeWidth="2" fill="none" />
      <circle cx="88" cy="62" r="3" fill="#1B2559" />
      <circle cx="112" cy="62" r="3" fill="#1B2559" />
      <path d="M92 72 Q100 78 108 72" stroke="#C97B6B" strokeWidth="1.5" fill="none" />
      <path d="M130 100 L155 85" stroke="#2D7FF9" strokeWidth="3" strokeLinecap="round" />
      <circle cx="158" cy="83" r="5" fill="#2D7FF9" />
    </svg>
  );
}
