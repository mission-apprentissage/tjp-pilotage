import { inject } from "injecti";
import type { Insertable } from "kysely";

import type { DB } from "@/db/schema";
import { dataDI } from "@/modules/import/data.di";
import { streamIt } from "@/modules/import/utils/streamIt";

import { createTension, createTensionRomeRegion, deleteTensionRomeRegion } from "./utils";

export const [importTensionRomeRegion] = inject(
  {
    findRawDatas: dataDI.rawDataRepository.findRawDatas,
    createTension,
    createTensionRomeRegion,
    deleteTensionRomeRegion,
  },
  (deps) => async () => {
    console.log(`Suppression des tensions rome/région...`);
    await deleteTensionRomeRegion();

    console.log(`Import des données de tension rome/région...\n`);

    let tensionCount = 0;

    const insertedTensions: Set<string> = new Set();

    await streamIt(
      async (offset) =>
        deps.findRawDatas({
          type: "tension_rome_region",
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

        const tensionRomeRegionData: Insertable<DB["tensionRomeRegion"]> = {
          codeRome: tension.codeActivite,
          codeRegion: tension.codeTerritoire,
          codeTension: tension.codeNomenclature,
          annee: tension.codePeriode,
          valeur: Number(tension.valeurPrincipaleNom),
        };

        try {
          await createTensionRomeRegion(tensionRomeRegionData);
        } catch (e) {
          if (typeof e === "object" && e && "detail" in e) {
            console.error(`\rErreur : ${e.detail}`);
          } else {
            console.error(e);
          }
        }

        tensionCount++;
        process.stdout.write(`\r${tensionCount} tensions régionales ajoutées`);
      },
      {
        parallel: 20,
      }
    );
  }
);
