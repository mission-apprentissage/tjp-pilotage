import { inject } from "injecti";

import { rawDataRepository } from "../../repositories/rawData.repository";
import { findAcademiesQuery } from "./findAcademiesQuery.dep";
import { upsertIndicateurAcaemieQuery } from "./upsertIndicateurAcademieQuery.dep";

export const [importIndicateursAcademie] = inject(
  {
    findAcademiesQuery,
    upsertIndicateurAcaemieQuery,
    findRawData: rawDataRepository.findRawData,
  },
  (deps) => async () => {
    const academies = await deps.findAcademiesQuery();
    for (const { codeAcademie } of academies) {
      for (const rentreeScolaire of ["2020"]) {
        const line = await deps.findRawData({
          type: `decrochage_academique`,
          filter: { codeAcademie },
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

        await deps.upsertIndicateurAcaemieQuery({
          codeAcademie,
          rentreeScolaire,
          ...decrochage,
        });
      }
    }
  }
);
