import { Readable, Writable } from "stream";
import { pipeline } from "stream/promises";
export const streamIt = <T>(
  load: (count: number) => Promise<T[]>,
  write: (chunk: T, writeCount: number) => Promise<void>
) => {
  let count = 0;

  const readable = new Readable({
    objectMode: true,
    autoDestroy: false,
    read: async () => {
      const data = await load(count);
      count += data.length;
      if (data.length) {
        data.forEach((item) => {
          readable.push(item);
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
      await write(chunk, writeCount);
      writeCount++;
      callback();
    },
  });

  return pipeline(readable, writable);
};
