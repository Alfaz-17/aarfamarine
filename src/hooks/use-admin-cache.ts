import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

// Global in-memory cache
const globalCache: Record<string, any> = {};
const pendingRequests: Record<string, Promise<any>> = {};

export function useAdminCache<T = any>(url: string | null) {
  const [data, setData] = useState<T | null>(url ? globalCache[url] || null : null);
  const [isLoading, setIsLoading] = useState<boolean>(url ? !globalCache[url] : false);
  const [error, setError] = useState<any>(null);

  const mutate = useCallback(async (optimisticData?: T) => {
    if (!url) return;
    
    if (optimisticData !== undefined) {
      globalCache[url] = optimisticData;
      setData(optimisticData);
      return;
    }

    try {
      if (!pendingRequests[url]) {
        pendingRequests[url] = api.get(url);
      }
      const res = await pendingRequests[url];
      
      globalCache[url] = res.data;
      setData(res.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      delete pendingRequests[url];
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (!url) return;
    
    // If it's already cached, we don't need to show loading screen
    if (!globalCache[url]) {
      setIsLoading(true);
    } else {
      // Ensure state is synced if URL changes
      setData(globalCache[url]);
      setIsLoading(false);
    }
    
    // Always revalidate in background (Stale-While-Revalidate)
    mutate();
  }, [url, mutate]);

  return { data, isLoading, error, mutate };
}
