import { inject } from "injecti";

import { rawDataRepository } from "../../repositories/rawData.repository";
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
       * Ajout des indicateurs sur le décrochage scolaire
       */
      for (const rentreeScolaire of ["2020"]) {
        const line = await deps.findRawData({
          type: `decrochage_regional`,
          filter: { codeRegion },
          year: rentreeScolaire,
        });

        const effectifDecrochage = line?.effectif16a29
          ? parseInt(line?.effectif16a29)
          : undefined;

        const nbDecrocheurs = line?.nbDecrocheurs
          ? parseInt(line?.nbDecrocheurs)
          : undefined;

        const tauxDecrochage = line?.tauxDecrochage
          ? parseInt(line?.tauxDecrochage)
          : undefined;

        const decrochage =
          effectifDecrochage &&
          effectifDecrochage > 0 &&
          nbDecrocheurs &&
          nbDecrocheurs > 0
            ? { effectifDecrochage, nbDecrocheurs, tauxDecrochage }
            : undefined;

        await deps.upsertRegionQuery({
          codeRegion,
          rentreeScolaire,
          ...decrochage,
        });
      }

      /**
       * Ajout des indicateurs sur le taux de chomage regionnal
       */
      for (const rentreeScolaire of ["2020", "2021", "2022"]) {
        const line = await deps.findRawData({
          type: `chomage_regional_INSEE`,
          filter: { codeRegion, rentreeScolaire },
        });

        await deps.upsertRegionQuery({
          codeRegion,
          rentreeScolaire,
          tauxChomage: line?.tauxChomage ? parseFloat(line?.tauxChomage.replace(',', '.')) : null
        })
      }
    }
  }
);
