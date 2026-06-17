import { ChatIcon } from './icons';

export default function ChatFab() {
  return (
    <button
      type="button"
      className="flex flex-col items-center gap-1 rounded-full bg-white p-3 shadow-float transition hover:shadow-lg"
      aria-label="Open chat"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-doc-primary text-white shadow-md shadow-doc-primary/30">
        <ChatIcon className="w-5 h-5" />
      </span>
      <span className="text-xs font-medium text-doc-muted">Chat</span>
    </button>
  );
}
