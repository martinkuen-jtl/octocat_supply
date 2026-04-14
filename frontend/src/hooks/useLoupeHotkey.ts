import { useEffect, useState } from 'react';

/**
 * Toggles the loupe overlay with Alt+L.
 * Skips the toggle when focus is inside an input, textarea, or
 * contenteditable element to avoid disrupting normal typing.
 */
export function useLoupeHotkey(): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.altKey || e.code !== 'KeyL') {return;}

      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      e.preventDefault();
      setVisible((v) => !v);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return visible;
}
