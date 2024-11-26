export async function timeout<T>(promise: Promise<T>, millis: number): Promise<T> {
  let timeoutID: undefined | NodeJS.Timeout;
  const timeout: Promise<never> = new Promise((_resolve, reject) => {
    timeoutID = setTimeout(() => reject(`Timed out after ${millis} ms.`), millis);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutID));
}

export async function sleep(durationMs: number, signal?: AbortSignal): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    let timeout: NodeJS.Timeout | null = null;

    if (signal?.aborted) return reject(signal?.reason);

    const listener = () => {
      if (timeout) clearTimeout(timeout);
      reject(signal?.reason);
    };

    timeout = setTimeout(() => {
      signal?.removeEventListener("abort", listener);

      resolve();
    }, durationMs);

    signal?.addEventListener("abort", listener);
  });
}
