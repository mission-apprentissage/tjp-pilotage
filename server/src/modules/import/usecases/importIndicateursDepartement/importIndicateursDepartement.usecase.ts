// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";

import { rawDataRepository } from "@/modules/import/repositories/rawData.repository";

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
      for (const rentreeScolaire of ["2020", "2021", "2022"]) {
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
  },
);
