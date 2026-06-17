import { Outlet } from 'react-router-dom';
import CopyrightBar from '../components/CopyrightBar';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';

export default function AppLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white font-sans">
      <Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto overscroll-contain bg-doc-bg p-6 lg:p-8">
          <Outlet />
        </main>
        <CopyrightBar />
      </div>
    </div>
  );
}
