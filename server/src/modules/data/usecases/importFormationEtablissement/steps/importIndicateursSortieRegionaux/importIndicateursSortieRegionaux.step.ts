import { inject } from "injecti";

import { regionAcademiqueMapping } from "../../../../domain/regionAcademiqueMapping";
import { rawDataRepository } from "../../../../repositories/rawData.repository";
import { inserJeunesApi } from "../../../../services/inserJeunesApi/inserJeunes.api";
import { createIndicateurRegionSortie } from "./createIndicateurRegionSortie.dep";

export const [importIndicateursRegionSortie] = inject(
  {
    createIndicateurRegionSortie,
    findRawData: rawDataRepository.findRawData,
    getRegionData: inserJeunesApi.getRegionData,
  },
  (deps) =>
    async ({
      cfd,
      dispositifId,
      mefstat,
    }: {
      cfd: string;
      dispositifId: string;
      mefstat: string;
    }) => {
      for (const [_crij, codeRegion] of Object.entries(regionAcademiqueMapping))
        for (const millesimeSortie of ["2019_2020", "2020_2021"]) {
          const data = await deps.findRawData({
            type: "ij_reg",
            filter: { millesime: millesimeSortie, codeRegion },
          });
          const mefstatData = data?.meftstats[mefstat];
          if (!mefstatData) continue;
          await deps.createIndicateurRegionSortie({
            cfd,
            dispositifId,
            voie: "scolaire",
            codeRegion,
            millesimeSortie,
            effectifSortie: mefstatData.scolaire?.nb_annee_term ?? null,
            nbSortants: mefstatData.scolaire?.nb_sortant ?? null,
            nbPoursuiteEtudes:
              mefstatData.scolaire?.nb_poursuite_etudes ?? null,
            nbInsertion6mois: mefstatData.scolaire?.nb_en_emploi_6_mois ?? null,
            nbInsertion12mois:
              mefstatData.scolaire?.nb_en_emploi_12_mois ?? null,
            nbInsertion24mois:
              mefstatData.scolaire?.nb_en_emploi_24_mois ?? null,
          });
        }
    }
);
