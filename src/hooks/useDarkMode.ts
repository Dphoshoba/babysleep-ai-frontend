import { useEffect, useState } from 'react';

export default function useDarkMode() {
  const [enabled, setEnabled] = useState(() => {
    return localStorage.getItem('dark-mode') === 'true';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (enabled) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('dark-mode', enabled.toString());
  }, [enabled]);

  return [enabled, setEnabled] as const;
}
