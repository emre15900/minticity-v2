'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Options = {
  enabled: boolean;
};

export function useLeaveConfirm({ enabled }: Options) {
  const [open, setOpen] = useState(false);
  const [allowLeave, setAllowLeave] = useState(false);
  const pendingActionRef = useRef<(() => void) | 'reload' | null>(null);

  const requestLeave = useCallback((action: () => void) => {
    if (!enabled) {
      action();
      return;
    }
    pendingActionRef.current = action;
    setOpen(true);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyRefresh = (event: KeyboardEvent) => {
      const isRefresh =
        event.key === 'F5' ||
        ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'r');
      if (isRefresh) {
        event.preventDefault();
        pendingActionRef.current = 'reload';
        setOpen(true);
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (allowLeave) return;
      event.preventDefault();
      event.returnValue = '';
      pendingActionRef.current = 'reload';
      setOpen(true);
      return '';
    };

    window.addEventListener('keydown', handleKeyRefresh);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('keydown', handleKeyRefresh);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, allowLeave]);

  const confirmLeave = useCallback(() => {
    setOpen(false);
    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    if (action === 'reload') {
      setAllowLeave(true);
      window.location.reload();
    } else if (action) {
      action();
    }
  }, []);

  const cancelLeave = useCallback(() => {
    setOpen(false);
  }, []);

  return { open, requestLeave, confirmLeave, cancelLeave };
}

