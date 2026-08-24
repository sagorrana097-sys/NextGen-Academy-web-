import { useState, useEffect, useRef, useCallback } from 'react';

// In-Memory Cache Store
const memoryCache = new Map();
const inFlightRequests = new Map();

const DEFAULT_TTL = 5 * 60 * 1000; // 5 Minutes default TTL

/**
 * Get item from Cache (checks Memory first, then localStorage)
 */
export function getCacheItem(key) {
  // 1. Memory Check
  if (memoryCache.has(key)) {
    const item = memoryCache.get(key);
    if (Date.now() - item.timestamp < item.ttl) {
      return item.data;
    }
  }

  // 2. LocalStorage Check
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(`nga_swr_${key}`);
      if (raw) {
        const item = JSON.parse(raw);
        if (Date.now() - item.timestamp < item.ttl) {
          // Re-populate memory cache
          memoryCache.set(key, item);
          return item.data;
        }
      }
    }
  } catch (e) {
    // Ignore storage parse errors
  }

  return null;
}

/**
 * Set item in Cache (both Memory and LocalStorage)
 */
export function setCacheItem(key, data, ttl = DEFAULT_TTL) {
  const item = {
    data,
    timestamp: Date.now(),
    ttl
  };

  memoryCache.set(key, item);

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(`nga_swr_${key}`, JSON.stringify(item));
    }
  } catch (e) {
    // Ignore storage quota errors
  }
}

/**
 * Clear/Invalidate Cache Item
 */
export function invalidateCache(key) {
  if (key) {
    memoryCache.delete(key);
    try {
      localStorage.removeItem(`nga_swr_${key}`);
    } catch (_) {}
  } else {
    memoryCache.clear();
  }
}

/**
 * Custom React Hook: useSWRCache
 * Stale-While-Revalidate caching hook for instantaneous page rendering
 * 
 * @param {string} key - Unique cache key
 * @param {Function} fetcher - Async function that fetches data
 * @param {Object} options
 * @param {number} options.ttl - Time to live in ms (default 5 min)
 * @param {boolean} options.revalidateOnMount - Always fetch in background (default true)
 * @param {any} options.fallbackData - Initial data if cache is empty
 */
export function useSWRCache(key, fetcher, options = {}) {
  const {
    ttl = DEFAULT_TTL,
    revalidateOnMount = true,
    fallbackData = null
  } = options;

  const cachedVal = key ? getCacheItem(key) : null;
  const [data, setData] = useState(cachedVal || fallbackData);
  const [error, setError] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const revalidate = useCallback(async () => {
    if (!key || !fetcher) return;

    // Deduplicate in-flight promises
    if (inFlightRequests.has(key)) {
      try {
        const result = await inFlightRequests.get(key);
        if (isMountedRef.current) setData(result);
        return result;
      } catch (err) {
        if (isMountedRef.current) setError(err);
        return;
      }
    }

    setIsValidating(true);
    const fetchPromise = (async () => {
      try {
        const res = await fetcher();
        const extractedData = res?.success && res?.data !== undefined ? res.data : res;

        setCacheItem(key, extractedData, ttl);

        if (isMountedRef.current) {
          setData(extractedData);
          setError(null);
        }
        return extractedData;
      } catch (err) {
        if (isMountedRef.current) {
          setError(err);
        }
        throw err;
      } finally {
        inFlightRequests.delete(key);
        if (isMountedRef.current) {
          setIsValidating(false);
        }
      }
    })();

    inFlightRequests.set(key, fetchPromise);
    return fetchPromise;
  }, [key, fetcher, ttl]);

  useEffect(() => {
    // 1. If cache hit, update state immediately
    const existing = key ? getCacheItem(key) : null;
    if (existing) {
      setData(existing);
    }

    // 2. Perform background revalidation
    if (revalidateOnMount) {
      revalidate();
    }
  }, [key, revalidateOnMount, revalidate]);

  return {
    data,
    error,
    isValidating,
    revalidate,
    mutate: (newData, shouldRevalidate = false) => {
      setData(newData);
      if (key) setCacheItem(key, newData, ttl);
      if (shouldRevalidate) revalidate();
    }
  };
}
