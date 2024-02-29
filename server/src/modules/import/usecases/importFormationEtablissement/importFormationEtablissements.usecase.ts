import { inject } from "injecti";
import { MILLESIMES_IJ, RENTREES_SCOLAIRES } from "shared";

import { streamIt } from "../../utils/streamIt";
import { getCfdDispositifs } from "../getCfdRentrees/getCfdDispositifs.dep";
import { getCfdRentrees } from "../getCfdRentrees/getCfdRentrees.usecase";
import { findDiplomesProfessionnels } from "../importIJData/findDiplomesProfessionnels.dep";
import { findFamillesMetiers } from "./findFamillesMetiers.dep";
import { findUAIsApprentissage } from "./findUAIsApprentissage";
import { importEtablissement } from "./steps/importEtablissement/importEtablissement.step";
import { importFormation } from "./steps/importFormation/importFormation.step";
import { importFormationHistorique } from "./steps/importFormationsHistoriques/importFormationsHistoriques.step";
import { createFormationEtablissement } from "./steps/importIndicateurEtablissement/createFormationEtablissement.dep";
import { importIndicateurEtablissement } from "./steps/importIndicateurEtablissement/importIndicateurEtablissement.step";
import { importIndicateurEntree } from "./steps/importIndicateursEntree/importIndicateursEntree.step";
import {
  importIndicateurSortie,
  importIndicateurSortieApprentissage,
} from "./steps/importIndicateursSortie/importIndicateursSortie.step";
import {
  importIndicateursRegionSortie,
  importIndicateursRegionSortieApprentissage,
} from "./steps/importIndicateursSortieRegionaux/importIndicateursSortieRegionaux.step";

export const [importFormations] = inject(
  {
    importFormation,
    importFormationHistorique,
    findDiplomesProfessionnels,
    findFamillesMetiers,
  },
  (deps) => {
    return async () => {
      await streamIt(
        (count) =>
          deps.findDiplomesProfessionnels({ offset: count, limit: 60 }),
        async (item, count) => {
          const cfd = item.cfd;
          const voie = item.voie;
          console.log("cfd", `(${voie})`, cfd, count);
          if (!cfd) return;
          const ancienCfds = await deps.importFormationHistorique({
            cfd,
            voie,
          });
          for (const ancienCfd of ancienCfds ?? []) {
            await importFormationEtablissements({ cfd: ancienCfd, voie });
          }
          await importFormationEtablissements({ cfd, voie });
        },
        { parallel: 20 }
      );

      await streamIt(
        (count) => deps.findFamillesMetiers({ offset: count, limit: 60 }),
        async (item, count) => {
          const cfd = item.cfd;
          console.log("cfd famille", cfd, count);
          if (!cfd) return;
          const formation = await deps.importFormation({ cfd });
          const ancienCfds = await deps.importFormationHistorique({ cfd });
          for (const ancienCfd of ancienCfds ?? []) {
            await importFormationEtablissements({ cfd: ancienCfd });
          }
          await importFormationEtablissements({ cfd });
          if (!formation) return;
        },
        { parallel: 20 }
      );
    };
  }
);

export const [importFormationEtablissements] = inject(
  {
    createFormationEtablissement,
    importEtablissement,
    importIndicateurEtablissement,
    importIndicateurEntree,
    importIndicateurSortie,
    getCfdRentrees,
    getCfdDispositifs,
    importIndicateursRegionSortie,
    importIndicateurSortieApprentissage,
    importIndicateursRegionSortieApprentissage,
    findUAIsApprentissage,
  },
  (deps) => {
    return async ({
      cfd,
      voie = "scolaire",
    }: {
      cfd: string;
      voie?: string;
    }) => {
      if (voie === "apprentissage") {
        await deps.importIndicateursRegionSortieApprentissage({ cfd });
        const uais = await deps.findUAIsApprentissage({ cfd });
        if (!uais) return;
        for (const uai of uais) {
          await deps.importEtablissement({ uai });
          const formationEtablissement =
            await deps.createFormationEtablissement({
              UAI: uai,
              cfd,
              dispositifId: null,
              voie: "apprentissage",
            });

          for (const millesime of MILLESIMES_IJ) {
            await deps.importIndicateurEtablissement({ uai, millesime });
            await deps.importIndicateurSortieApprentissage({
              uai,
              formationEtablissementId: formationEtablissement.id,
              millesime,
              cfd,
            });
          }
        }
      } else {
        const cfdDispositifs = await deps.getCfdDispositifs({ cfd });

        for (const cfdDispositif of cfdDispositifs) {
          const { codeDispositif, anneesDispositif } = cfdDispositif;

          const lastMefstat = Object.values(anneesDispositif).pop()?.mefstat;
          if (!lastMefstat) continue;

          await deps.importIndicateursRegionSortie({
            cfd,
            dispositifId: codeDispositif,
            mefstat: lastMefstat,
          });

          for (const rentreeScolaire of RENTREES_SCOLAIRES) {
            const { enseignements } =
              (await deps.getCfdRentrees({
                cfd,
                codeDispositif,
                year: rentreeScolaire,
              })) ?? {};

            if (!enseignements) continue;

            for (const enseignement of enseignements) {
              const { uai, anneesEnseignement, voie } = enseignement;
              await deps.importEtablissement({ uai });
              const formationEtablissement =
                await deps.createFormationEtablissement({
                  UAI: uai,
                  cfd,
                  dispositifId: codeDispositif,
                  voie,
                });

              await deps.importIndicateurEntree({
                formationEtablissementId: formationEtablissement.id,
                rentreeScolaire,
                cfd,
                uai,
                anneesEnseignement,
                anneesDispositif,
              });

              for (const millesime of MILLESIMES_IJ) {
                await deps.importIndicateurEtablissement({ uai, millesime });
                await deps.importIndicateurSortie({
                  uai,
                  mefstat: lastMefstat,
                  formationEtablissementId: formationEtablissement.id,
                  millesime,
                  cfd,
                  codeDispositif,
                });
              }
            }
          }
        }
      }
    };
  }
);
