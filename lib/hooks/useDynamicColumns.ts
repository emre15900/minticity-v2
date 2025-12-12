'use client';

import { TableColumnType } from 'antd';
import { useEffect, useMemo, useState } from 'react';

export type DynamicColumn<T> = TableColumnType<T> & {
  id: string;
  visibleByDefault?: boolean;
  lockVisibility?: boolean;
};

export function useDynamicColumns<T>(
  columns: DynamicColumn<T>[],
  storageKey?: string,
) {
  const [hiddenIds, setHiddenIds] = useState<string[]>(() =>
    columns
      .filter((col) => col.visibleByDefault === false)
      .map((col) => col.id),
  );

  useEffect(() => {
    if (!storageKey) return;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setHiddenIds(JSON.parse(stored));
      } catch {
        setHiddenIds([]);
      }
    }
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(hiddenIds));
  }, [hiddenIds, storageKey]);

  const visibleColumns = useMemo(
    () =>
      columns.filter((col) =>
        col.lockVisibility ? true : !hiddenIds.includes(col.id),
      ),
    [columns, hiddenIds],
  );

  const toggleColumn = (id: string, visible: boolean) => {
    setHiddenIds((prev) => {
      const set = new Set(prev);
      if (visible) {
        set.delete(id);
      } else {
        set.add(id);
      }
      return Array.from(set);
    });
  };

  const resetColumns = () => setHiddenIds([]);

  return { visibleColumns, hiddenIds, toggleColumn, resetColumns };
}

