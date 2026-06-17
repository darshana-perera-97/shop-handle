import { useEffect } from 'react';
import { CloseIcon } from './icons';

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-doc-navy/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative z-10 w-full max-w-lg rounded-3xl border border-doc-border bg-white p-6 shadow-float"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 id="modal-title" className="text-lg font-bold text-doc-navy">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-doc-muted transition-colors hover:bg-doc-primary-light hover:text-doc-primary"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
