import { inject } from "injecti";
import { Readable, Writable } from "stream";
import { pipeline } from "stream/promises";

import { getStreamParser } from "../../utils/parse";
import { createRawDatas } from "./createRawDatas.dep";
import { deleteRawData } from "./deleteRawData.dep";

export const [importRawFile] = inject(
  { createRawDatas, deleteRawData },
  (deps) =>
    async ({ fileStream, type }: { fileStream: Readable; type: string }) => {
      console.log(`Import des lignes de fichier`);

      await deps.deleteRawData({ type });

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
            await deps.createRawDatas({ data: [{ type, data: line }] });
            count++;
            console.log(`Added line ${count}`);
            callback();
          },
        })
      );
    }
);
