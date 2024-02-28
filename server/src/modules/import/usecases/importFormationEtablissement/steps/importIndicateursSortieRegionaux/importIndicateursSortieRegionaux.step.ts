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
          const mefstatData = ijRegData?.scolaire[mefstat];

          if (!mefstatData) {
            const continuumData = await getContinuumData({
              cfd,
              dispositifId,
              codeRegion,
              millesimeSortie,
              voie: "scolaire",
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
            effectifSortie: mefstatData.nb_annee_term ?? null,
            nbSortants: mefstatData.nb_sortant ?? null,
            nbPoursuiteEtudes: mefstatData.nb_poursuite_etudes ?? null,
            nbInsertion6mois: mefstatData.nb_en_emploi_6_mois ?? null,
            nbInsertion12mois: mefstatData.nb_en_emploi_12_mois ?? null,
            nbInsertion24mois: mefstatData.nb_en_emploi_24_mois ?? null,
          });
        }
    }
);

export const [importIndicateursRegionSortieApprentissage] = inject(
  {
    createIndicateurRegionSortie,
    findRawData: rawDataRepository.findRawData,
    getRegionData: inserJeunesApi.getRegionData,
  },
  (deps) =>
    async ({ cfd }: { cfd: string }) => {
      for (const [_crij, codeRegion] of Object.entries(regionAcademiqueMapping))
        for (const millesimeSortie of MILLESIMES_IJ_REG) {
          const data = await deps.findRawData({
            type: "ij_reg",
            filter: { millesime: millesimeSortie, codeRegion },
          });
          const cfdData = data?.apprentissage[cfd];

          if (!cfdData) {
            const continuumData = await getContinuumData({
              cfd,
              dispositifId: null,
              codeRegion,
              millesimeSortie,
              voie: "apprentissage",
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
            dispositifId: null,
            voie: "apprentissage",
            codeRegion,
            millesimeSortie,
            effectifSortie: cfdData.nb_annee_term ?? null,
            nbSortants: cfdData.nb_sortant ?? null,
            nbPoursuiteEtudes: cfdData.nb_poursuite_etudes ?? null,
            nbInsertion6mois: cfdData.nb_en_emploi_6_mois ?? null,
            nbInsertion12mois: cfdData.nb_en_emploi_12_mois ?? null,
            nbInsertion24mois: cfdData.nb_en_emploi_24_mois ?? null,
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
      voie,
    }: {
      cfd: string;
      dispositifId: string | null;
      codeRegion: string;
      millesimeSortie: string;
      voie: string;
    }) => {
      const ancienneFormation = await deps.findAnciennesFormation({
        cfd,
        voie,
      });
      if (ancienneFormation.length !== 1) return;
      const cfdContinuum = ancienneFormation[0].ancienCFD;
      const nouvellesFormation = await deps.findNouvellesFormation({
        cfd: cfdContinuum,
        voie,
      });
      if (nouvellesFormation.length !== 1) return;

      return await deps.findIndicateurRegionSortie({
        cfd: cfdContinuum,
        codeDispositif: dispositifId,
        codeRegion,
        millesimeSortie,
        voie,
      });
    }
);
