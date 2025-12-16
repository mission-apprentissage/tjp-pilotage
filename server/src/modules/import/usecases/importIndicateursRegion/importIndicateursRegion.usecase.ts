/**
 * Importe les indicateurs de taux de chômage par région et rentrée scolaire.
 *
 * Fichiers rawData utilisés :
 * - "chomage_regional_INSEE" : données de taux de chômage par région (codeRegion, rentreeScolaire, tauxChomage)
 *
 * Cette fonction :
 * 1. Récupère tous les régions existantes dans le système
 * 2. Pour chaque région et chaque rentrée scolaire (2020-2023)
 * 3. Recherche les données de chômage depuis rawData type "chomage_regional_INSEE"
 * 4. Insère ou met à jour une ligne dans la table "indicateurRegion" avec taux de chômage
 *
 * Retourne le nombre total d'indicateurs de régions importés.
 */

import { rawDataRepository } from "@/modules/import/repositories/rawData.repository";
import { inject } from "@/utils/inject";

import { findRegionsQuery } from "./findRegionsQuery.dep";
import { upsertRegionQuery } from "./upsertIndicateurRegionQuery.dep";

export const [importIndicateursRegion] = inject(
  {
    findRegionsQuery,
    upsertRegionQuery,
    findRawData: rawDataRepository.findRawData,
  },
  (deps) => async () => {
    const regions = await deps.findRegionsQuery();
    for (const { codeRegion } of regions) {
      /**
       * Ajout des indicateurs sur le taux de chomage regionnal
       */
      for (const rentreeScolaire of ["2020", "2021", "2022", "2023"]) {
        const line = await deps.findRawData({
          type: `chomage_regional_INSEE`,
          filter: { codeRegion, rentreeScolaire },
        });

        await deps.upsertRegionQuery({
          codeRegion,
          rentreeScolaire,
          tauxChomage: line?.tauxChomage ? parseFloat(line?.tauxChomage.replace(",", ".")) : null,
        });
      }
    }
  }
);
