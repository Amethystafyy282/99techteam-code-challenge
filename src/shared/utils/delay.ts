export const delay = (ms: number, signal?: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);

    const onAbort = () => {
      clearTimeout(timer);
      reject(signal?.reason);
    };

    signal?.addEventListener('abort', onAbort, { once: true });
  });

export const withMinDuration = async <T>(task: Promise<T>, ms: number, signal?: AbortSignal): Promise<T> => {
  const [outcome] = await Promise.all([
    task.then(
      (value) => ({ ok: true as const, value }),
      (error: unknown) => ({ ok: false as const, error }),
    ),
    delay(ms, signal),
  ]);

  if (!outcome.ok) {
    throw outcome.error;
  }

  return outcome.value;
};
