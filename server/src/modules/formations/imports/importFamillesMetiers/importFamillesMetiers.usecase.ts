import { parse } from "csv-parse";
import fs from "fs";
import _, { isEmpty } from "lodash";
import { Readable, Writable } from "stream";

import { createFamilleMetier as createFamilleMetierDep } from "./createFamilleMetier";

export const importFamillesMetiersFactory =
  ({
    csvStream = fs.createReadStream(
      `src/files/familleMetiers.csv`,
      "utf8"
    ) as Readable,
    createFamilleMetier = createFamilleMetierDep,
  }) =>
  async () => {
    const csvPaser = parse({
      trim: true,
      delimiter: ";",
      columns: true,
      on_record: (record) =>
        _.chain(record)
          .mapKeys((_, key: string) => key.trim())
          .pickBy((value) => !isEmpty(value) && value.trim().length)
          .value(),
    });

    csvStream.pipe(csvPaser).pipe(
      new Writable({
        objectMode: true,
        write: async (line, _, callback) => {
          await createFamilleMetier({
            libelleOfficielFamille: line.FAMILLE,
            libelleOfficielSpecialite: line.SPECIALITE,
            mefStat11Famille: line["MEFSTAT11 2NDE PRO"],
            mefStat11Specialite: line["MEFSTAT11 TLEPRO"],
            codeMinistereTutelle: line.CODE_MINISTERE_TUTELLE,
          });
          callback();
        },
      })
    );
  };

export const importFamillesMetiers = importFamillesMetiersFactory({});
