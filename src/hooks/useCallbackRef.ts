import { DependencyList, useCallback, useEffect, useRef } from 'react';

export function useCallbackRef<T extends (...args: unknown[]) => unknown>(
  callback: T | undefined,
  deps: DependencyList = [],
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback(((...args) => callbackRef.current?.(...args)) as T, deps);
}
