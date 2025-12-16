/**
 * Importe les constats de rentrée (effectifs par établissement et MEF) pour chaque rentrée scolaire.
 *
 * Fichiers rawData utilisés :
 * - "constat_[rentreeScolaire]" : données des constats de rentrée pour chaque rentrée (Mef Bcp 11, UAI, Rentrée scolaire, Nombre d'élèves : Total)
 * - "nMef" : données des MEF pour enrichissement des infos (MEF_STAT_11, FORMATION_DIPLOME, DISPOSITIF_FORMATION, ANNEE_DISPOSITIF)
 *
 * Cette fonction :
 * 1. Itère sur chaque rentrée scolaire définie (RENTREES_SCOLAIRES)
 * 2. Récupère les constats de rentrée depuis rawData type "constat_[rentreeScolaire]" filtrés par rentrée
 * 3. Pour chaque constat, recherche le nMef correspondant via MEF_STAT_11
 * 4. Insère ou met à jour une ligne dans la table "constatRentree" avec UAI, effectif, cfd, codeDispositif et année du dispositif
 * 5. Gère les erreurs et compte les lignes importées
 *
 * Rapport d'erreurs d'import :
 * - Chemin : `server/dist/import_files_report.csv` (relatif à la racine du projet, créé au runtime)
 * - Les erreurs de validation des fichiers CSV y sont enregistrées
 *
 * Retourne le nombre total de constats de rentrée importés.
 */

import type { Insertable } from "kysely";
import { RENTREES_SCOLAIRES } from "shared";

import type { DB } from "@/db/schema";
import { rawDataRepository } from "@/modules/import/repositories/rawData.repository";
import { streamIt } from "@/modules/import/utils/streamIt";
import { inject } from "@/utils/inject";

import { createConstatRentree } from "./createConstatRentree.dep";
import { findNMef } from "./findNMef.dep";

export const [importConstatRentree] = inject(
  {
    createConstatRentree,
    findNMef,
    findRawDatas: rawDataRepository.findRawDatas,
  },
  (deps) => async () => {
    let errorCount = 0;
    for (const rentreeScolaire of RENTREES_SCOLAIRES) {
      console.log(`Import du constat rentrée de l'année scolaire ${rentreeScolaire}`);

      await streamIt(
        async (offset) =>
          deps.findRawDatas({
            type: "constat",
            offset,
            limit: 10000,
            year: rentreeScolaire,
          }),
        async (constatRentreeLine, count) => {
          const mefStat11 = constatRentreeLine["Mef Bcp 11"];
          const rentreeScolaireConstat = constatRentreeLine["Rentrée scolaire"]?.trim();

          if (mefStat11 && rentreeScolaireConstat === rentreeScolaire) {
            const nMef = await findNMef({
              mefstat: constatRentreeLine["Mef Bcp 11"],
            });

            const uai = constatRentreeLine["UAI"];

            if (!uai) {
              throw new Error(
                `Création de la table constatRentree : Pas d'UAI pour la ligne comportant le mefstat ${constatRentreeLine["Mef Bcp 11"]}.`
              );
            }

            const constatRentree: Insertable<DB["constatRentree"]> = {
              uai: constatRentreeLine["UAI"],
              mefstat11: constatRentreeLine["Mef Bcp 11"],
              effectif: Number(constatRentreeLine["Nombre d'élèves : Total"] ?? "0"),
              cfd: nMef.FORMATION_DIPLOME,
              codeDispositif: nMef.DISPOSITIF_FORMATION,
              anneeDispositif: Number(nMef.ANNEE_DISPOSITIF ?? "0"),
              rentreeScolaire,
            };

            try {
              await deps.createConstatRentree(constatRentree);

              process.stdout.write(`\r${count} constat de rentrée ajoutés ou mis à jour`);
            } catch (error) {
              console.log(`An error occured while importing data`, JSON.stringify(constatRentree, null, 2));
              console.error(error);
              errorCount++;
            }
          }
        },
        { parallel: 20 }
      );

      process.stdout.write(errorCount > 0 ? `(avec ${errorCount} erreurs)\n\n` : "\n\n");
    }
  }
);
