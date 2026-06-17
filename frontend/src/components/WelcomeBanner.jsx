import { DoctorIllustration } from './icons';

export default function WelcomeBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-card">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 80%, #E8F0FE 0%, transparent 50%), radial-gradient(circle at 80% 20%, #E8F0FE 0%, transparent 40%)',
        }}
      />
      <div className="relative flex items-center justify-between gap-4">
        <div className="max-w-xs">
          <h2 className="text-xl font-bold text-doc-navy">Hello, Anne!</h2>
          <p className="mt-2 text-sm leading-relaxed text-doc-muted">
            Don&apos;t forget to complete your daily health report. Have a nice day!
          </p>
          <button
            type="button"
            className="mt-4 rounded-2xl bg-doc-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-doc-primary/25 transition hover:bg-doc-primary-dark"
          >
            Complete report
          </button>
        </div>
        <div className="hidden shrink-0 sm:block">
          <DoctorIllustration />
        </div>
      </div>
    </div>
  );
}
