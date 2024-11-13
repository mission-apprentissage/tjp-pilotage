// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import type { Insertable } from "kysely";

import type { DB } from "@/db/schema";
import { dataDI } from "@/modules/import/data.di";
import { streamIt } from "@/modules/import/utils/streamIt";

import { createTension, createTensionRomeDepartement, deleteTensionRomeDepartement } from "./utils";

const formatCodeDepartement = (codeDepartement: string) =>
  codeDepartement.length > 2 ? codeDepartement : `0${codeDepartement}`;

export const [importTensionRomeDepartement] = inject(
  {
    findRawDatas: dataDI.rawDataRepository.findRawDatas,
    createTension,
    createTensionRomeDepartement,
    deleteTensionRomeDepartement,
  },
  (deps) => async () => {
    console.log(`Suppression des tensions rome/département...\n`);
    await deleteTensionRomeDepartement();

    console.log(`Import des données de tension rome/département...\n`);

    let tensionCount = 0;

    const insertedTensions: Set<string> = new Set();

    await streamIt(
      async (offset) =>
        deps.findRawDatas({
          type: "tension_rome_departement",
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

        const tensionRomeDepartementData: Insertable<DB["tensionRomeDepartement"]> = {
          codeRome: tension.codeActivite,
          codeDepartement: formatCodeDepartement(tension.codeTerritoire),
          codeTension: tension.codeNomenclature,
          annee: tension.codePeriode,
          valeur: Number(tension.valeurPrincipaleNom),
        };

        try {
          await createTensionRomeDepartement(tensionRomeDepartementData);
        } catch (e) {
          if (typeof e === "object" && e && "detail" in e) {
            console.error(`\rErreur : ${e.detail}`);
          } else {
            console.error(e);
          }
        }

        tensionCount++;
        process.stdout.write(`\r${tensionCount} tensions départementales ajoutées`);
      },
      {
        parallel: 20,
      }
    );
  }
);
