import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Open state for a memory board, synced with the URL: `#<hash>` opens the board and
 * `#<id>` for any id in `ids` opens it on that memory. Closing clears either hash and
 * returns focus to the trigger.
 */
export function useMemoryDialog(
  hash: string,
  ids: readonly string[],
  defaultOpen: boolean,
  onDeepLink: (id: string) => void
) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const deepLink = useRef(onDeepLink);
  deepLink.current = onDeepLink;

  useEffect(() => {
    const sync = () => {
      const target = window.location.hash.slice(1);
      if (target === hash) {
        setIsOpen(true);
      } else if (ids.includes(target)) {
        deepLink.current(target);
        setIsOpen(true);
      }
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [hash, ids]);

  // Focus can only return once the modal is gone; until then the page is inert.
  const wasOpen = useRef(isOpen);
  useEffect(() => {
    if (wasOpen.current && !isOpen) triggerRef.current?.focus();
    wasOpen.current = isOpen;
  }, [isOpen]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    const target = window.location.hash.slice(1);
    if (target === hash || ids.includes(target)) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [hash, ids]);

  return { isOpen, open, close, triggerRef };
}
