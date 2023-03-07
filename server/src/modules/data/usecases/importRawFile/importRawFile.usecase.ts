import { Readable, Writable } from "stream";
import { pipeline } from "stream/promises";

import { getStreamParser } from "../../utils/parse";
import { importRawFileDeps } from "./importRawFile.deps";

export const importRawFileFactory =
  ({
    createRawDatas = importRawFileDeps.createRawDatas,
    deleteRawData = importRawFileDeps.deleteRawData,
  }) =>
  async ({ fileStream, type }: { fileStream: Readable; type: string }) => {
    console.log(`Import des lignes de fichier`);

    await deleteRawData({ type });

    let count = 0;
    await pipeline(
      fileStream,
      getStreamParser(),
      new Writable({
        final: (callback) => {
          console.log("import successfull");
          callback();
        },
        objectMode: true,
        write: async (line, _, callback) => {
          await createRawDatas({ data: [{ type, data: line }] });
          count++;
          console.log(`Added line ${count}`);
          callback();
        },
      })
    );
  };

export const importRawFile = importRawFileFactory({});
