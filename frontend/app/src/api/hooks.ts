/**
 * React hooks for API operations
 */

import { useState, useEffect, useCallback } from 'react';
import { Service, SystemMetrics } from './index';
import * as servicesApi from './services';
import * as systemApi from './system';
import * as processApi from './process';
import { ApiError } from './client';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Generic hook for fetching data
 */
function useFetch<T>(
  fetcher: () => Promise<T>,
  options: { interval?: number; dependencies?: unknown[] } = {}
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { interval, dependencies = [fetcher] } = options;

  useEffect(() => {
    let isMounted = true;

    const fetch = async () => {
      try {
        setLoading(true);
        const result = await fetcher();
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetch();

    if (interval) {
      const id = setInterval(fetch, interval);
      return () => clearInterval(id);
    }

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error };
}

/**
 * Hook to fetch all services with auto-refresh
 */
export function useServices(refreshInterval: number = 5000): UseApiState<Service[]> {
  return useFetch(servicesApi.getServices, {
    interval: refreshInterval,
  });
}

/**
 * Hook to fetch system metrics with auto-refresh
 */
export function useSystemMetrics(
  refreshInterval: number = 5000
): UseApiState<SystemMetrics> {
  return useFetch(systemApi.getSystemMetrics, {
    interval: refreshInterval,
  });
}

export function useCPUMetrics( refreshInterval: number = 5000 ): UseApiState<systemApi.CpuMetrics> {
  return useFetch(systemApi.getCpuMetrics, {
    interval: refreshInterval,
  });
}

export function useRAMMetrics( refreshInterval: number = 5000 ): UseApiState<systemApi.MemoryMetrics> {
  return useFetch(systemApi.getMemoryMetrics, {
    interval: refreshInterval,
  });
}

export function useProcesses( refreshInterval: number = 10000 ): UseApiState<processApi.ProcessInfo[]> {
  return useFetch(processApi.getProcesses, {
    interval: refreshInterval,
  });
}

/**
 * Hook for service actions (start, stop, etc.) with loading state
 */
export function useServiceAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const executeAction = useCallback(
    async (action: () => Promise<unknown>) => {
      try {
        setLoading(true);
        setError(null);
        await action();
        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { executeAction, loading, error };
}

/**
 * Hook for starting a service
 */
export function useStartService() {
  const { executeAction, ...state } = useServiceAction();
  const start = useCallback(
    (name: string) => executeAction(() => servicesApi.startService(name)),
    [executeAction]
  );
  return { start, ...state };
}

/**
 * Hook for stopping a service
 */
export function useStopService() {
  const { executeAction, ...state } = useServiceAction();
  const stop = useCallback(
    (name: string) => executeAction(() => servicesApi.stopService(name)),
    [executeAction]
  );
  return { stop, ...state };
}

/**
 * Hook for restarting a service
 */
export function useRestartService() {
  const { executeAction, ...state } = useServiceAction();
  const restart = useCallback(
    (name: string) => executeAction(() => servicesApi.restartService(name)),
    [executeAction]
  );
  return { restart, ...state };
}

/**
 * Hook for enabling a service
 */
export function useEnableService() {
  const { executeAction, ...state } = useServiceAction();
  const enable = useCallback(
    (name: string) => executeAction(() => servicesApi.enableService(name)),
    [executeAction]
  );
  return { enable, ...state };
}

/**
 * Hook for disabling a service
 */
export function useDisableService() {
  const { executeAction, ...state } = useServiceAction();
  const disable = useCallback(
    (name: string) => executeAction(() => servicesApi.disableService(name)),
    [executeAction]
  );
  return { disable, ...state };
}

/**
 * Hook for killing a process
 */
export function useKillProcess() {
  const { executeAction, ...state } = useServiceAction();
  const kill = useCallback(
    (pid: number) => executeAction(() => processApi.killProcess(pid)),
    [executeAction]
  );
  return { kill, ...state };
}

export function useServiceInfo(serviceName: string) {
  return useFetch(() => servicesApi.getServiceByName(serviceName), {
    dependencies: [serviceName],
  });
}