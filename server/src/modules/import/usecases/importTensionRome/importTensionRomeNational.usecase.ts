import { inject } from "injecti";
import type { Insertable } from "kysely";

import type { DB } from "@/db/schema";
import { dataDI } from "@/modules/import/data.di";
import { streamIt } from "@/modules/import/utils/streamIt";

import { createTension, createTensionRome, deleteTensionRome } from "./utils";

export const [importTensionRomeNational] = inject(
  {
    findRawDatas: dataDI.rawDataRepository.findRawDatas,
    createTension,
    createTensionRome,
    deleteTensionRome,
  },
  (deps) => async () => {
    console.log(`Suppression des tensions nationales par rome...\n`);
    await deleteTensionRome();

    console.log(`Import des données de tension nationales par rome...\n`);

    let tensionCount = 0;

    const insertedTensions: Set<string> = new Set();

    await streamIt(
      async (offset) =>
        deps.findRawDatas({
          type: "tension_rome",
          limit: 1000,
          offset,
        }),
      async (tension) => {
        const tensionKey = `${tension.codeNomenclature}_${tension.libNomenclature}`;

        if (!insertedTensions.has(tensionKey)) {
          console.log(`Insertion de tension ${tensionKey} en db`);

          const tensionData: Insertable<DB["tension"]> = {
            codeTension: tension.codeNomenclature,
            libelleTension: tension.libNomenclature,
          };

          await createTension(tensionData);

          insertedTensions.add(tensionKey);
        }

        const tensionRomeData: Insertable<DB["tensionRome"]> = {
          codeRome: tension.codeActivite,
          codeTension: tension.codeNomenclature,
          annee: tension.codePeriode,
          valeur: Number(tension.valeurPrincipaleNom),
        };

        try {
          await createTensionRome(tensionRomeData);
        } catch (e) {
          if (typeof e === "object" && e && "detail" in e) {
            console.error(`\rErreur : ${e.detail}`);
          } else {
            console.error(e);
          }
        }

        tensionCount++;
        process.stdout.write(`\r${tensionCount} tensions nationales ajoutées`);
      },
      {
        parallel: 20,
      }
    );
  }
);
