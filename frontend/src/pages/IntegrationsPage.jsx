import PageHeader from '../components/PageHeader';
import { UnderConstructionIllustration } from '../components/icons';

export default function IntegrationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Integrations"
        subtitle="Connect external services and tools to your shop."
      />

      <div className="flex flex-col items-center justify-center rounded-2xl border border-doc-border bg-white px-6 py-16 text-center shadow-card">
        <UnderConstructionIllustration className="h-auto w-56 sm:w-64" />
        <h2 className="mt-8 text-xl font-bold text-doc-navy">Feature under construction</h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-doc-muted">
          Integrations are coming soon. You&apos;ll be able to connect payment gateways, accounting
          tools, and other services to your shop from here.
        </p>
        <span className="mt-6 inline-flex items-center rounded-full bg-amber-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-amber-700 ring-1 ring-amber-200">
          Coming soon
        </span>
      </div>
    </div>
  );
}
