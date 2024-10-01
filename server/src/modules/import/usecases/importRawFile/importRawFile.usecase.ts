import { pipeline, Writable } from "node:stream";

import fs from "fs";
import { inject } from "injecti";
import { ZodError } from "zod";

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
    async ({
      type,
      path,
      schema,
    }: {
      type: string;
      path: string;
      schema: Zod.Schema<unknown>;
    }) => {
      console.log(`Vérification de l'intégrité du fichier : ${path}`);
      await verifyFileEncoding(path);
      console.log(`Fichier validé : ${path}`);
      console.log(`Suppression des raw data ${type}`);

      await deps.deleteRawData({ type });

      process.stdout.write(`Import des lignes du fichier ${type}...\n`);

      let count = 0;
      pipeline(
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
            try {
              count++;
              const sanitizedLine = schema.parse(line) as JSON;
              await deps.batch.create({ data: { data: sanitizedLine, type } });
              process.stdout.write(`Ajout de ${count} lignes\r`);
            } catch (err) {
              const zodError = err as ZodError;
              console.warn(
                `- Erreur ligne ${count} : \n`,
                zodError.issues
                  .map((i) => `- ${i.path}: ${i.message}`)
                  .join("\n")
              );
            }
            callback();
          },
        }),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
);
