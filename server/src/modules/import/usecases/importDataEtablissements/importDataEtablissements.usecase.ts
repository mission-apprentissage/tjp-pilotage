/**
 * Importe les données des établissements (lycées ACCE) avec leurs informations géographiques et administratives.
 *
 * Fichiers rawData utilisés :
 * - "lyceesACCE" : données des établissements (numero_uai, numero_siren_siret_uai, appellation_officielle, adresse_uai, commune_libe, code_postal_uai, secteur_public_prive, ministere_tutelle, type_uai, departement_insee_3)
 *
 * Cette fonction :
 * 1. Récupère les établissements depuis rawData type "lyceesACCE"
 * 2. Extrait et formate le code département à partir du code INSEE
 * 3. Recherche les codes académie et région correspondants
 * 4. Insère ou met à jour une ligne dans la table "dataEtablissement" avec UAI, SIRET, codes, adresse et informations de l'établissement
 * 5. Gère les erreurs et compte les lignes importées
 *
 * Retourne le nombre total de données d'établissements importées.
 */

import type { DB } from "@/db/db";
import { rawDataRepository } from "@/modules/import/repositories/rawData.repository";
import { streamIt } from "@/modules/import/utils/streamIt";
import { inject } from "@/utils/inject";

import { createDataEtablissement } from "./createDataEtablissement.dep";
import { findDepartement } from "./findDepartement.dep";

export const [importDataEtablissements] = inject(
  {
    createDataEtablissement,
    findRawDatas: rawDataRepository.findRawDatas,
    findDepartement,
  },
  (deps) => async () => {
    let errorCount = 0;
    console.log("Import des dataEtablissement");
    await streamIt(
      async (offset) => deps.findRawDatas({ type: "lyceesACCE", offset, limit: 10000 }),
      async (lyceeACCE, count) => {
        const codeDepartement = formatCodeDepartement(lyceeACCE.departement_insee_3);

        const departement = codeDepartement && (await deps.findDepartement({ codeDepartement }));

        try {
          await deps.createDataEtablissement({
            uai: lyceeACCE.numero_uai,
            siret: lyceeACCE.numero_siren_siret_uai,
            codeAcademie: departement?.codeAcademie,
            codeRegion: departement?.codeRegion,
            codeDepartement,
            libelleEtablissement: lyceeACCE.appellation_officielle,
            adresse: lyceeACCE.adresse_uai,
            commune: lyceeACCE.commune_libe,
            codePostal:
              lyceeACCE.code_postal_uai?.length && lyceeACCE.code_postal_uai.length <= 5
                ? lyceeACCE.code_postal_uai
                : undefined,
            secteur: lyceeACCE.secteur_public_prive,
            codeMinistereTutuelle: lyceeACCE.ministere_tutelle,
            typeUai: lyceeACCE.type_uai as DB["dataEtablissement"]["typeUai"],
          });
        } catch (e) {
          console.log(e);
          errorCount++;
        }

        process.stdout.write(`\r${count} dataEtablissement ajoutés ou mis à jour`);
      },
      { parallel: 20 }
    );
    process.stdout.write(errorCount > 0 ? `(avec ${errorCount} erreurs)\n\n` : "\n\n");
  }
);
// @ts-expect-error
const formatCodeDepartement = (codeInsee: string | undefined) => {
  if (!codeInsee) return;
  if (codeInsee.length === 3) return codeInsee as `${number}${number}${string}`;
  if (codeInsee.length === 2) return `0${codeInsee}` as `${number}${number}${string}`;
};
