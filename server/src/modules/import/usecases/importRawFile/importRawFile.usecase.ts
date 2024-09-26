import fs from "fs";
import { inject } from "injecti";
import { pipeline, Writable } from "stream";

import batchCreate from "../../utils/batchCreate";
import { getStreamParser } from "../../utils/parse";
import { verifyFileEncoding } from "../../utils/verifyFileEncoding";
import { createRawDatas } from "./createRawDatas.dep";
import { deleteRawData } from "./deleteRawData.dep";

export const [importRawFile, importRawFileFactory] = inject(
  {
    batch: batchCreate(createRawDatas, 10000, true),
    deleteRawData,
  },
  (deps) =>
    async ({ type, path }: { type: string; path: string }) => {
      try {
        console.log(`Vérification de l'intégrité du fichier ${path}`);
        await verifyFileEncoding(path);
      } catch (err) {
        console.log(err);
      }

      await deps.deleteRawData({ type });

      process.stdout.write(`Import des lignes du fichier ${type}...\n`);

      let count = 0;
      await pipeline(
        fs.createReadStream(path),
        getStreamParser(),
        new Writable({
          final: async (callback) => {
            await deps.batch.flush();
            console.log(
              `Import du fichier ${type} réussi (${count} lignes ajoutées)\n`
            );
            callback();
          },
          objectMode: true,
          write: async (line, _, callback) => {
            await deps.batch.create({ data: { data: line, type } });
            count++;
            process.stdout.write(`Ajout de ${count} lignes\r`);
            callback();
          },
        })
      );
    }
);
