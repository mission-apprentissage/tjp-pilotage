/**
 * Importe les indicateurs de tension du marché du travail par code ROME au niveau national.
 *
 * Fichiers rawData utilisés :
 * - "tension_rome" : données de tension du marché du travail par ROME (codeActivite/codeRome, codePeriode/annee, codeNomenclature, libNomenclature, valeurPrincipaleNom)
 *
 * Cette fonction :
 * 1. Supprime les données de tension nationales existantes (tensionRome)
 * 2. Récupère les données de tension depuis rawData type "tension_rome"
 * 3. Pour chaque tension unique (code + libellé), insère ou met à jour dans la table "tension"
 * 4. Insère les relations ROME-tension dans la table "tensionRome" avec année et valeur
 * 5. Gère les doublons et les conflits d'insertion
 *
 * Retourne le nombre total de tensions nationales ROME importées.
 */

import type { Insertable } from "kysely";

import type { DB } from "@/db/schema";
import { dataDI } from "@/modules/import/data.di";
import { streamIt } from "@/modules/import/utils/streamIt";
import { inject } from "@/utils/inject";

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
