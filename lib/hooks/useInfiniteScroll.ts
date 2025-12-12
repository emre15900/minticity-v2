'use client';

import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

type Options = {
  batchSize?: number;
  enabled?: boolean;
  root?: RefObject<Element>;
};

export function useInfiniteScroll<T>(
  items: T[],
  { batchSize = 5, enabled = true, root }: Options = {},
) {
  const [visibleItems, setVisibleItems] = useState<T[]>(
    items.slice(0, batchSize),
  );
  const [hasMore, setHasMore] = useState(items.length > batchSize);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setVisibleItems(items.slice(0, batchSize));
    setHasMore(items.length > batchSize);
  }, [items, batchSize]);

  useEffect(() => {
    if (!enabled) return;

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loadingMore) {
          setLoadingMore(true);
          setTimeout(() => {
            const nextLength = Math.min(
              items.length,
              visibleItems.length + batchSize,
            );
            setVisibleItems(items.slice(0, nextLength));
            setHasMore(nextLength < items.length);
            setLoadingMore(false);
          }, 400);
        }
      },
      {
        root: root?.current ?? null,
        rootMargin: '200px',
        threshold: 0.1,
      },
    );

    const currentLoader = loadMoreRef.current;
    if (currentLoader) {
      observerRef.current.observe(currentLoader);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [enabled, hasMore, items, visibleItems.length, batchSize, loadingMore, root]);

  const reset = useCallback(() => {
    setVisibleItems(items.slice(0, batchSize));
    setHasMore(items.length > batchSize);
  }, [items, batchSize]);

  return { visibleItems, hasMore, loadingMore, loadMoreRef, reset };
}

