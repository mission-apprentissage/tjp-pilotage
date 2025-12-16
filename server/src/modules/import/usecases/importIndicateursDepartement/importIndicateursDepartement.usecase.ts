/**
 * Importe les indicateurs de taux de chômage par département et rentrée scolaire.
 *
 * Fichiers rawData utilisés :
 * - "chomage_departemental_INSEE" : données de taux de chômage par département (codeDepartement, rentreeScolaire, tauxChomage)
 *
 * Cette fonction :
 * 1. Récupère tous les départements existants dans le système
 * 2. Pour chaque département et chaque rentrée scolaire (2020 à 2023)
 * 3. Recherche les données de chômage depuis rawData type "chomage_departemental_INSEE"
 * 4. Insère ou met à jour une ligne dans la table "indicateurDepartement" avec taux de chômage
 *
 * Retourne le nombre total d'indicateurs de départements importés.
 */

import { rawDataRepository } from "@/modules/import/repositories/rawData.repository";
import { inject } from "@/utils/inject";

import { findDepartementsQuery } from "./findDepartementsQuery.dep";
import { upsertDepartementQuery } from "./upsertIndicateurDepartementQuery.dep";

export const [importIndicateursDepartement] = inject(
  {
    findDepartementsQuery,
    upsertDepartementQuery,
    findRawData: rawDataRepository.findRawData,
  },
  (deps) => async () => {
    const departements = await deps.findDepartementsQuery();
    for (const { codeDepartement } of departements) {
      /**
       * Ajout des indicateurs sur le taux de chomage regionnal
       */
      for (const rentreeScolaire of ["2020", "2021", "2022", "2023"]) {
        const line = await deps.findRawData({
          type: `chomage_departemental_INSEE`,
          filter: { codeDepartement, rentreeScolaire },
        });

        await deps.upsertDepartementQuery({
          codeDepartement,
          rentreeScolaire,
          tauxChomage: line?.tauxChomage ? parseFloat(line?.tauxChomage.replace(",", ".")) : null,
        });
      }
    }
  }
);
