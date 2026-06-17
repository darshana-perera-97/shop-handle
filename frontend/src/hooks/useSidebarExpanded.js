import { useEffect, useState } from 'react';

const STORAGE_KEY = 'shop-handle.sidebar.expanded';

export default function useSidebarExpanded() {
  const [expanded, setExpanded] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) return stored === 'true';
    } catch {
      // ignore read errors (e.g. private browsing)
    }
    return false;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(expanded));
    } catch {
      // ignore write errors
    }
  }, [expanded]);

  function toggle() {
    setExpanded((prev) => !prev);
  }

  return { expanded, toggle };
}
