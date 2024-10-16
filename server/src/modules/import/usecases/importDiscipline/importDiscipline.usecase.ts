import { inject } from "injecti";
import { Insertable } from "kysely";

import { DB } from "../../../../db/schema";
import { rawDataRepository } from "../../repositories/rawData.repository";
import { streamIt } from "../../utils/streamIt";
import { createDiscipline } from "./createDiscipline";

export const [importDiscipline] = inject(
  {
    createDiscipline,
    findRawDatas: rawDataRepository.findRawDatas,
  },
  (deps) => async () => {
    let errorCount = 0;
    await streamIt(
      (offset) =>
        deps.findRawDatas({
          type: "discipline",
          offset,
          limit: 10000,
        }),
      async (disciplineLine, count) => {
        const discipline: Insertable<DB["discipline"]> = {
          libelleDiscipline: disciplineLine.libelleDiscipline,
          codeDiscipline: disciplineLine.codeDiscipline,
        };

        try {
          await deps.createDiscipline(discipline);

          process.stdout.write(
            `\r${count} disciplines ajoutées ou mises à jour`
          );
        } catch (error) {
          console.log(
            `An error occured while importing data`,
            JSON.stringify(discipline, null, 2)
          );
          console.error(error);
          errorCount++;
        }
      },
      { parallel: 20 }
    );
    process.stdout.write(
      `${errorCount > 0 ? `(avec ${errorCount} erreurs)` : ""}\n\n`
    );
  }
);
