/**
 * Utilitaire générique d'import de fichiers CSV dans la table rawData.
 *
 * Cette fonction :
 * 1. Vérifie l'encodage du fichier (UTF-8)
 * 2. Supprime les données rawData existantes du type spécifié
 * 3. Lit le fichier CSV ligne par ligne via un stream
 * 4. Valide chaque ligne contre le schéma Zod fourni
 * 5. Nettoie les guillemets supplémentaires des valeurs
 * 6. Insère les lignes en batch dans la table "rawData" avec type et données
 * 7. Collecte les erreurs de validation (au niveau fichier ou ligne)
 *
 * Retourne un tableau d'erreurs (vide si succès) contenant détails du fichier/ligne problématique.
 */

import { pipeline, Writable } from "node:stream";

import fs from "fs";
import type { z } from "zod";
import { ZodError, ZodIssueCode } from "zod";

import batchCreate from "@/modules/import/utils/batchCreate";
import { getStreamParser } from "@/modules/import/utils/parse";
import { verifyFileEncoding } from "@/modules/import/utils/verifyFileEncoding";
import { inject } from "@/utils/inject";

import type { RawDataLine } from "./createRawDatas.dep";
import { createRawDatas } from "./createRawDatas.dep";
import { deleteRawData } from "./deleteRawData.dep";

const sanitizeLine = (line: RawDataLine): RawDataLine => {
  const sanitizedLine: RawDataLine = {};

  Object.entries(line).forEach(([key, value]) => {
    if (value.startsWith('"') && value.endsWith('"')) {
      sanitizedLine[key] = value.slice(1, -1);
    } else {
      sanitizedLine[key] = value;
    }
  });

  return sanitizedLine;
};

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
    async ({ type, path, schema }: { type: string; path: string; schema: z.Schema<unknown> }) => {
      const errors: Array<ImportFileError> = [];

      try {
        await verifyFileEncoding(path);
      } catch (err) {
        errors.push({
          type: ImportFileErrorType.FILE,
          path,
          error: new ZodError([{ code: ZodIssueCode.custom, message: err as string, path: [path] }]),
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
            console.log(`Import du fichier ${type} réussi (${count} lignes ajoutées)\n`);
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
            await deps.batch.create({ data: { data: sanitizeLine(line), type } });
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
