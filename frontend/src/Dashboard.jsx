import Sidebar from './components/Sidebar';
import Timeline from './components/Timeline';
import CalendarWidget from './components/CalendarWidget';
import WelcomeBanner from './components/WelcomeBanner';
import Appointments from './components/Appointments';
import MonthlyReports from './components/MonthlyReports';
import ChatFab from './components/ChatFab';

export default function Dashboard() {
  return (
    <div className="min-h-screen w-full bg-doc-bg font-sans">
      <div className="relative w-full">
        <div className="relative min-h-screen w-full overflow-hidden bg-white">
          <div className="flex min-h-screen">
            <Sidebar />

            <main className="flex flex-1 flex-col p-6 pt-10 lg:p-8 lg:pt-10">
              <div className="grid flex-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-4 xl:col-span-3">
                  <Timeline />
                </div>

                <div className="flex flex-col gap-6 lg:col-span-8 xl:col-span-9">
                  <div className="grid gap-4 md:grid-cols-5">
                    <div className="md:col-span-2">
                      <CalendarWidget />
                    </div>
                    <div className="md:col-span-3">
                      <WelcomeBanner />
                    </div>
                  </div>

                  <Appointments />
                  <MonthlyReports />
                </div>
              </div>
            </main>
          </div>
        </div>

        <div className="fixed bottom-8 right-8 z-30">
          <ChatFab />
        </div>
      </div>
    </div>
  );
}
