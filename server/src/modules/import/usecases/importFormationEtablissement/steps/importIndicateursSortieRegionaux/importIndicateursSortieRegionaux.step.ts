import { MILLESIMES_IJ_REG } from "shared";

import { regionAcademiqueMapping } from "@/modules/import/domain/regionAcademiqueMapping";
import { rawDataRepository } from "@/modules/import/repositories/rawData.repository";
import { inserJeunesApi } from "@/modules/import/services/inserJeunesApi/inserJeunes.api";
import { getCfdDispositifs } from "@/modules/import/usecases/getCfdRentrees/getCfdDispositifs.dep";
import { inject } from "@/utils/inject";

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
    async ({ cfd, codeDispositif, mefstat }: { cfd: string; codeDispositif: string; mefstat: string }) => {
      for (const [_crij, codeRegion] of Object.entries(regionAcademiqueMapping))
        for (const millesimeSortie of MILLESIMES_IJ_REG) {

          const mefstatData = await deps.findRawData({
            type: "ij_region_data",
            filter: { millesime: millesimeSortie, code_region: codeRegion, cfd, voie: "scolaire", mefstat11: mefstat },
          });

          if (!mefstatData) {
            const continuumData = await getContinuumData({
              cfd,
              codeDispositif,
              codeRegion,
              millesimeSortie,
              voie: "scolaire",
            });

            if (!continuumData) continue;
            await deps.createIndicateurRegionSortie({
              ...continuumData,
              codeDispositif,
              cfd,
              cfdContinuum: continuumData.cfd,
            });
            continue;
          }

          await deps.createIndicateurRegionSortie({
            cfd,
            codeDispositif,
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
          const ijRegionData = await deps.findRawData({
            type: "ij_region_data",
            filter: { millesime: millesimeSortie, code_region_ij: codeRegion, voie: "apprentissage", cfd },
          });

          if (!ijRegionData) {
            const continuumData = await getContinuumData({
              cfd,
              codeDispositif: null,
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
            codeDispositif: null,
            voie: "apprentissage",
            codeRegion,
            millesimeSortie,
            effectifSortie: ijRegionData.nb_annee_term ?? null,
            nbSortants: ijRegionData.nb_sortant ?? null,
            nbPoursuiteEtudes: ijRegionData.nb_poursuite_etudes ?? null,
            nbInsertion6mois: ijRegionData.nb_en_emploi_6_mois ?? null,
            nbInsertion12mois: ijRegionData.nb_en_emploi_12_mois ?? null,
            nbInsertion24mois: ijRegionData.nb_en_emploi_24_mois ?? null,
          });
        }
    }
);

// Règle dans le cas du continuum MC vers CS qui ont des codes dispositifs différents
const isMCToCS = (cfd: string, cfdContinuum: string) => {
  return ["461", "561"].includes(cfd.substring(0,3)) && cfdContinuum.substring(0,3) === "010";
};

const [getContinuumData] = inject(
  {
    findIndicateurRegionSortie,
    findAnciennesFormation,
    findNouvellesFormation,
    getCfdDispositifs
  },
  (deps) =>
    async ({
      cfd,
      codeDispositif,
      codeRegion,
      millesimeSortie,
      voie,
    }: {
      cfd: string;
      codeDispositif: string | null;
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

      const baseParams = { codeRegion, millesimeSortie, voie, cfd: cfdContinuum };

      if (isMCToCS(cfd, cfdContinuum)) {
        const dispositifs = await deps.getCfdDispositifs({ cfd: cfdContinuum });
        if (dispositifs.length !== 1) return;

        return deps.findIndicateurRegionSortie({
          ...baseParams,
          codeDispositif: dispositifs[0].codeDispositif,
        });
      }

      return deps.findIndicateurRegionSortie({
        ...baseParams,
        codeDispositif,
      });
    }
);
