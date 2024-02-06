import { inject } from "injecti";
import { Readable, Writable } from "stream";
import { pipeline } from "stream/promises";

import { getStreamParser } from "../../utils/parse";
import { createRawDatas } from "./createRawDatas.dep";
import { deleteRawData } from "./deleteRawData.dep";

export const [importRawFile, importRawFileFactory] = inject(
  {
    // batch: batchCreate(createRawDatas),
    createRawDatas,
    deleteRawData,
  },
  (deps) =>
    async ({ fileStream, type }: { fileStream: Readable; type: string }) => {
      process.stdout.write(`Import des lignes du fichier ${type}...\n`);

      await deps.deleteRawData({ type });

      let count = 0;
      await pipeline(
        fileStream,
        getStreamParser(),
        new Writable({
          // final: async (callback) => {
          // await deps.batch.flush();
          final: (callback) => {
            console.log(
              `Import du fichier ${type} réussi (${count} lignes ajoutées)\n`
            );
            callback();
          },
          objectMode: true,
          write: async (line, _, callback) => {
            await deps.createRawDatas({ data: [{ type, data: line }] });
            count++;
            process.stdout.write(`Ajout de ${count} lignes\r`);
            callback();
          },
        })
      );
    }
);
