import { UserPlusIcon } from './icons';

export default function PatientNotification() {
  return (
    <div className="inline-flex items-center gap-3 rounded-2xl bg-white px-4 py-2.5 shadow-float">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-doc-primary-light text-doc-primary">
        <UserPlusIcon />
      </span>
      <div className="text-sm">
        <span className="font-semibold text-doc-navy">Lily Anderson</span>
        <span className="text-doc-muted">, 27 years, Brighton</span>
      </div>
    </div>
  );
}
