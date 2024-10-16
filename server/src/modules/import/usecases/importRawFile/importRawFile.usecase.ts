import { pipeline, Writable } from "node:stream";

import fs from "fs";
import { inject } from "injecti";
import { ZodError, ZodIssueCode } from "zod";

import batchCreate from "../../utils/batchCreate";
import { getStreamParser } from "../../utils/parse";
import { verifyFileEncoding } from "../../utils/verifyFileEncoding";
import { createRawDatas } from "./createRawDatas.dep";
import { deleteRawData } from "./deleteRawData.dep";

export enum ImportFileErrorType {
  FILE = "file",
  LINE = "line",
}

export type ImportFileError =
  | {
      type: ImportFileErrorType.FILE;
      path: string;
      error: ZodError;
    }
  | {
      type: ImportFileErrorType.LINE;
      path: string;
      error: ZodError;
      line: number;
    };

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
      const errors: Array<ImportFileError> = [];

      try {
        await verifyFileEncoding(path);
      } catch (err) {
        errors.push({
          type: ImportFileErrorType.FILE,
          path,
          error: new ZodError([
            { code: ZodIssueCode.custom, message: err as string, path: [path] },
          ]),
        });
        return errors;
      }

      await deps.deleteRawData({ type });

      process.stdout.write(`Import des lignes du fichier ${type}...\n`);

      let count = 0;
      const stream = pipeline(
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
              schema.parse(line) as JSON;
            } catch (err) {
              const zodError = err as ZodError;
              errors.push({
                type: ImportFileErrorType.LINE,
                error: zodError,
                path,
                line: count,
              });
            }
            await deps.batch.create({ data: { data: line, type } });
            process.stdout.write(`Ajout de ${count} lignes\r`);
            callback();
          },
        }),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );

      const promise = async () =>
        new Promise<void>((resolve, reject) => {
          stream.on("error", (err) => {
            reject(err);
          });
          stream.on("finish", () => {
            resolve();
          });
        });

      await promise();

      return errors;
    }
);
