import { chunk } from "lodash-es";
import { Readable, Writable } from "stream";
import { pipeline } from "stream/promises";
export const streamIt = async <T>(
  load: (count: number) => Promise<T[]>,
  write: (chunk: T, writeCount: number) => Promise<void>,
  { parallel = 1 } = {},
  onFinal?: () => Promise<void>,
) => {
  let count = 0;

  const readable = new Readable({
    objectMode: true,
    autoDestroy: false,
    read: async () => {
      const data = await load(count);
      count += data.length;
      if (data.length) {
        const chunks = chunk(data, parallel);
        chunks.forEach((chunk) => {
          readable.push(chunk);
        });
      } else {
        readable.push(null);
      }
    },
  });
  let writeCount = 0;

  const writable = new Writable({
    objectMode: true,
    write: async (chunk, _, callback) => {
      await Promise.all(
        chunk.map(async (item: T) => {
          writeCount++;
          await write(item, writeCount);
        }),
      );

      callback();
    },
    final: async (callback) => {
      await onFinal?.();
      callback();
    },
  });

  return pipeline(readable, writable);
};
