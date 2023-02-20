import { Readable, Writable } from "stream";
import { pipeline } from "stream/promises";

import { dataDI } from "../../data.DI";
import { getStreamParser } from "../../utils/parse";

export const importRawFileFactory =
  ({ createRawDatas = dataDI.createRawDatas }) =>
  async ({
    fileStream,
    key,
    type,
  }: {
    fileStream: Readable;
    key: string;
    type: string;
  }) => {
    console.log(`Import des lignes de fichier`);

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
          if (!line[key]) {
            callback();
            return;
          }
          await createRawDatas({
            data: [{ type, key: line[key], data: line }],
          });
          count++;
          console.log(`Added line ${count}`);
          callback();
        },
      })
    );
  };

export const importRawFile = importRawFileFactory({});
