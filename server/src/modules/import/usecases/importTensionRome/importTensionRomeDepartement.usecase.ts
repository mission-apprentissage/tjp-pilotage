/**
 * Importe les indicateurs de tension du marché du travail par code ROME au niveau départemental.
 *
 * Fichiers rawData utilisés :
 * - "tension_rome_departement" : données de tension départementale par ROME (codeActivite/codeRome, codeDepartement, codePeriode/annee, codeNomenclature, libNomenclature, valeurPrincipaleNom)
 *
 * Cette fonction :
 * 1. Supprime les données de tension départementales existantes (tensionRomeDepartement)
 * 2. Récupère les données de tension départementale depuis rawData type "tension_rome_departement"
 * 3. Formate les codes département (ajoute leading 0 si nécessaire)
 * 4. Pour chaque tension unique (code + libellé), insère ou met à jour dans la table "tension"
 * 5. Insère les relations ROME-département-tension dans la table "tensionRomeDepartement" avec année et valeur
 * 6. Gère les doublons et les conflits d'insertion
 *
 * Retourne le nombre total de tensions départementales ROME importées.
 */

import type { Insertable } from "kysely";

import type { DB } from "@/db/schema";
import { dataDI } from "@/modules/import/data.di";
import { streamIt } from "@/modules/import/utils/streamIt";
import { inject } from "@/utils/inject";

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
    console.log(`Suppression des données de tension départementales par rome...\n`);
    await deleteTensionRomeDepartement();

    console.log(`Import des données de tension départementales par rome...\n`);

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
