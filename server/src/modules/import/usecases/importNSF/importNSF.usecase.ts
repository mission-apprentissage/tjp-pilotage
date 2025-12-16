/**
 * Importe les codes NSF (Nomenclature des Spécialités et Formations) avec leurs libellés.
 *
 * Fichiers rawData utilisés :
 * - "n_groupe_specialite_" : données des groupes de spécialités NSF (GROUPE_SPECIALITE, LIBELLE_EDITION, LIBELLE_LONG)
 *
 * Cette fonction :
 * 1. Récupère les groupes de spécialités depuis rawData type "n_groupe_specialite_"
 * 2. Normalise le libellé (utilise LIBELLE_EDITION si disponible, sinon LIBELLE_LONG)
 * 3. Insère ou met à jour une ligne dans la table "nsf" avec code NSF et libellé
 *
 * Retourne le nombre total de codes NSF importés.
 */

import type { Insertable } from "kysely";
import { capitalize } from "lodash-es";

import type { DB } from "@/db/db";
import { dataDI } from "@/modules/import/data.di";
import { streamIt } from "@/modules/import/utils/streamIt";

import { importNSFGroupeSpecialite } from "./importNSF.deps";

const normalizeLibelleLong = (libelleLong: string) => {
  return capitalize(libelleLong.replace(/DO[0-9]+\s:\s/i, "").toLocaleLowerCase());
};

export const importNSFFactory =
  ({
    findRawDatas = dataDI.rawDataRepository.findRawDatas,
    createNSFGroupeSpecialite = importNSFGroupeSpecialite.createNSFGroupeSpecialite,
  }) =>
    async () => {
      console.log(`Import des spécialité de familles de métiers`);

      let countNSFGroupeSpecialite = 0;
      await streamIt(
        async (countNSFGroupeSpecialite) =>
          findRawDatas({
            type: "n_groupe_specialite_",
            offset: countNSFGroupeSpecialite,
            limit: 20,
          }),
        async (item) => {
          const data: Insertable<DB["nsf"]> = {
            codeNsf: item.GROUPE_SPECIALITE,
            libelleNsf: item.LIBELLE_EDITION ?? normalizeLibelleLong(item.LIBELLE_LONG) ?? "",
          };

          await createNSFGroupeSpecialite(data);

          countNSFGroupeSpecialite++;
          process.stdout.write(`\r${countNSFGroupeSpecialite}`);
        },
        { parallel: 20 }
      );
    };

export const importNSF = importNSFFactory({});
