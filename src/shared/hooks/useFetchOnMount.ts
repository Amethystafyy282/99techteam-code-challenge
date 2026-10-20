import { useEffect, useState } from 'react';
import { useToast } from './useToast';

export const useFetchOnMount = <T>(fetcher: (signal: AbortSignal) => Promise<T>, emptyData: T) => {
  const [data, setData] = useState<T>(emptyData);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    fetcher(controller.signal)
      .then(setData)
      .catch((err: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setData(emptyData);
        showToast(err instanceof Error ? err.message : 'Something went wrong', 'error');
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [fetcher, emptyData, showToast]);

  return { data, setData, isLoading };
};
