import { isEqual } from "lodash-es";

const DEFAULT_BATCH_SIZE = 10000;

type CreateFunction<D> = ({ data }: { data: Array<D> }) => unknown;

/**
 * Memory batch factory from a createCallback.
 * @param createCallback function to take data array and create in database
 * @param batchSize default 1000
 * @param allowDuplicates default false
 * @returns object with two functions: create (take data as parameter, and add it to the batch if it's not already in there), and flush (flush the batch).
 */
export default function batchCreate<T>(
  createCallback: CreateFunction<T>,
  batchSize: number = DEFAULT_BATCH_SIZE,
  allowDuplicates: boolean = false,
) {
  const BATCH: T[] = [];

  async function create({ data }: { data: T }) {
    if (allowDuplicates) {
      BATCH.push(data);
    } else {
      const index = BATCH.findIndex((d) => isEqual(d, data));
      if (index !== -1) {
        BATCH[index] = data;
      } else {
        BATCH.push(data);
      }
    }

    if (BATCH.length >= batchSize) {
      await createCallback({ data: BATCH });
      BATCH.length = 0;
    }
  }

  async function flush() {
    if (BATCH.length > 0) {
      await createCallback({ data: BATCH });
      BATCH.length = 0;
    }
  }

  return {
    create,
    flush,
  };
}
