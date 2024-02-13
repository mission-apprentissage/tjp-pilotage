import { inject } from "injecti";
import { MILLESIMES_IJ_REG } from "shared";

import { regionAcademiqueMapping } from "../../../../domain/regionAcademiqueMapping";
import { rawDataRepository } from "../../../../repositories/rawData.repository";
import { inserJeunesApi } from "../../../../services/inserJeunesApi/inserJeunes.api";
import { createIndicateurRegionSortie } from "./createIndicateurRegionSortie.dep";
import { findAnciennesFormation } from "./findAnciennesFormation.dep";
import { findIndicateurRegionSortie } from "./findIndicateurRegionSortie.dep";
import { findNouvellesFormation } from "./findNouvellesFormation.dep";

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
        for (const millesimeSortie of MILLESIMES_IJ_REG) {
          const ijRegData = await deps.findRawData({
            type: "ij_reg",
            filter: { millesime: millesimeSortie, codeRegion },
          });
          const mefstatData = ijRegData?.mefstats[mefstat];

          if (!mefstatData) {
            const continuumData = await getContinuumData({
              cfd,
              dispositifId,
              codeRegion,
              millesimeSortie,
            });

            if (!continuumData) continue;
            await deps.createIndicateurRegionSortie({
              ...continuumData,
              cfd,
              cfdContinuum: continuumData.cfd,
            });
            continue;
          }

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

const [getContinuumData] = inject(
  {
    findIndicateurRegionSortie,
    findAnciennesFormation,
    findNouvellesFormation,
  },
  (deps) =>
    async ({
      cfd,
      dispositifId,
      codeRegion,
      millesimeSortie,
    }: {
      cfd: string;
      dispositifId: string;
      codeRegion: string;
      millesimeSortie: string;
    }) => {
      const ancienneFormation = await deps.findAnciennesFormation({ cfd });
      if (ancienneFormation.length !== 1) return;
      const cfdContinuum = ancienneFormation[0].ancienCFD;
      const nouvellesFormation = await deps.findNouvellesFormation({
        cfd: cfdContinuum,
      });
      if (nouvellesFormation.length !== 1) return;

      return await deps.findIndicateurRegionSortie({
        cfd: cfdContinuum,
        codeDispositif: dispositifId,
        codeRegion,
        millesimeSortie,
      });
    }
);
