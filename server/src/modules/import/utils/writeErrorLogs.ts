import fs from "fs/promises";
import type { ZodError } from "zod";

import type { ImportFileError } from "@/modules/import/usecases/importRawFile/importRawFile.usecase";
import { ImportFileErrorType } from "@/modules/import/usecases/importRawFile/importRawFile.usecase";

const COLUMNS = ["path", "type", "line", "field", "message"];
const DELIMITER = ";";

export const writeErrorLogs = async ({
  path,
  errors,
  withHeader = false,
}: {
  path: string;
  errors?: Array<ImportFileError>;
  withHeader?: boolean;
}) => {
  if (withHeader) {
    await fs.writeFile(path, COLUMNS.join(DELIMITER));
  }

  if (errors) {
    for (const error of errors) {
      const zodError = error.error as ZodError;
      const rows: string[][] = [];
      switch (error.type) {
        case ImportFileErrorType.FILE:
          rows.push([error.path, ImportFileErrorType.FILE, "", "", error.error.message]);
          break;
        case ImportFileErrorType.LINE:
          for (const issue of zodError.issues) {
            rows.push([error.path, ImportFileErrorType.LINE, "" + error.line, issue.path.join(","), issue.message]);
          }
          break;
      }
      for (const row of rows) {
        await fs.appendFile(path, `\n${row.join(DELIMITER)}`);
      }
    }
  }
  return;
};
