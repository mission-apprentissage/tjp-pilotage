import { inject } from "injecti";
import { Insertable } from "kysely";

import { DB } from "../../../../db/schema";
import { dataDI } from "../../data.di";
import { streamIt } from "../../utils/streamIt";
import {
  createTension,
  createTensionRegionRome,
  deleteTensionRegionRome,
} from "./importTensionRegionRome.dep";

export const [importTensionRegionRome] = inject(
  {
    findRawDatas: dataDI.rawDataRepository.findRawDatas,
    createTension,
    createTensionRegionRome,
    deleteTensionRegionRome,
  },
  (deps) => async () => {
    console.log(`Suppression des tensions région/rome`);
    await deleteTensionRegionRome();

    console.log(`\nImport des données de tension région/rome`);

    let tensionCount = 0;

    const insertedTensions: Set<string> = new Set();

    await streamIt(
      (offset) =>
        deps.findRawDatas({
          type: "tension_region_rome",
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

        const tensionRegionRomeData: Insertable<DB["tensionRomeRegion"]> = {
          codeRome: tension.codeActivite,
          codeRegion: tension.codeTerritoire,
          codeTension: tension.codeNomenclature,
          annee: tension.codePeriode,
          valeur: Number(tension.valeurPrincipaleNom),
        };

        try {
          await createTensionRegionRome(tensionRegionRomeData);
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
