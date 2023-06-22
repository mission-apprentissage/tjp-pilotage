import { inject } from "injecti";

import { rawDataRepository } from "../../repositories/rawData.repository";
import { streamIt } from "../../utils/streamIt";
import {
  getCfdDispositifs,
  getCfdRentrees,
  getCfdRentreesS,
} from "../getCfdRentrees/getCfdRentrees.usecase";
import { dependencies } from "./dependencies.di";
import { MILLESIMES_IJ, RENTREES_SCOLAIRES } from "./domain/millesimes";
import { logger } from "./importLogger";
import { importEtablissement } from "./steps/importEtablissement/importEtablissement.step";
import { importFormation } from "./steps/importFormation/importFormation.step";
import { importIndicateurEtablissement } from "./steps/importIndicateurEtablissement/importIndicateurEtablissement.step";
import { importIndicateurEntree } from "./steps/importIndicateursEntree/importIndicateursEntree.step";
import { importIndicateurSortie } from "./steps/importIndicateursSortie/importIndicateursSortie.step";

const findDiplomesProfessionnels = ({
  offset,
  limit,
}: {
  offset: number;
  limit: number;
}) => {
  return rawDataRepository.findRawDatas({
    type: "diplomesProfessionnels",
    offset,
    limit,
  });
};

export const [importFormationEtablissements] = inject(
  {
    findFormations: dependencies.findFormations,
    createFormationEtablissement: dependencies.createFormationEtablissement,
    importEtablissement,
    importIndicateurEtablissement,
    importIndicateurEntree,
    importIndicateurSortie,
    getCfdRentrees,
    getCfdDispositifs,
    importFormation,
    findDiplomesProfessionnels,
  },
  (deps) => {
    logger.reset();
    return async () => {
      await streamIt(
        async (count) =>
          deps.findDiplomesProfessionnels({ offset: count, limit: 50 }),
        async (item, count) => {
          const processedUais: string[] = [];

          const formation = await deps.importFormation({
            diplomeProfessionnelLine: item,
          });
          if (!formation) return;

          const cfd = formation.codeFormationDiplome;
          const cfdDispositifs = await deps.getCfdDispositifs({ cfd });

          console.log("cfd", cfd, count);

          for (const cfdDispositif of cfdDispositifs) {
            const { dispositifId, anneesDispositif } = cfdDispositif;

            for (const rentreeScolaire of RENTREES_SCOLAIRES) {
              const { enseignements, anneeDebutConstate } =
                (await deps.getCfdRentrees({
                  cfd,
                  dispositifId,
                  year: rentreeScolaire,
                })) ?? {};

              if (!enseignements) continue;

              for (const enseignement of enseignements) {
                const { uai, anneesEnseignement, voie } = enseignement;
                if (!processedUais.includes(uai)) {
                  await deps.importEtablissement({ uai });
                  for (const millesime of MILLESIMES_IJ) {
                    await deps.importIndicateurEtablissement({
                      uai,
                      millesime,
                    });
                  }
                  processedUais.push(uai);
                }
                if (voie !== "scolaire") continue;

                const formationEtablissement =
                  await deps.createFormationEtablissement({
                    UAI: uai,
                    cfd,
                    dispositifId,
                    voie,
                  });

                await deps.importIndicateurEntree({
                  formationEtablissementId: formationEtablissement.id,
                  rentreeScolaire,
                  cfd,
                  uai,
                  anneeDebutConstate: anneeDebutConstate ?? 0,
                  anneesEnseignement,
                  anneesDispositif,
                });

                for (const millesime of MILLESIMES_IJ) {
                  await deps.importIndicateurSortie({
                    uai,
                    anneesDispositif,
                    formationEtablissementId: formationEtablissement.id,
                    millesime,
                  });
                }
              }
            }
          }
        }
      );
      logger.write();
    };
  }
);

export const [importFormationEtablissementsO] = inject(
  {
    findFormations: dependencies.findFormations,
    createFormationEtablissement: dependencies.createFormationEtablissement,
    importEtablissement,
    importIndicateurEtablissement,
    importIndicateurEntree,
    importIndicateurSortie,
    getCfdRentrees: getCfdRentreesS,
  },
  (deps) => {
    logger.reset();
    return async () => {
      await streamIt(
        async (count) => deps.findFormations({ offset: count, limit: 50 }),
        async (item, count) => {
          const processedUais: string[] = [];
          const cfd = item.codeFormationDiplome;

          for (const rentreeScolaire of RENTREES_SCOLAIRES) {
            const cfdDispositifs = await deps.getCfdRentrees({
              cfd,
              year: rentreeScolaire,
            });

            console.log("cfd", cfd, count);

            for (const cfdDispositif of cfdDispositifs) {
              const {
                dispositifId,
                enseignements,
                anneesDispositif,
                anneeDebutConstate,
              } = cfdDispositif;

              for (const enseignement of enseignements) {
                const { uai, anneesEnseignement, voie } = enseignement;
                if (!processedUais.includes(uai)) {
                  await importEtablissement({ uai });
                  for (const millesime of MILLESIMES_IJ) {
                    await deps.importIndicateurEtablissement({
                      uai,
                      millesime,
                    });
                  }
                  processedUais.push(uai);
                }
                if (voie !== "scolaire") continue;

                const formationEtablissement =
                  await deps.createFormationEtablissement({
                    UAI: uai,
                    cfd,
                    dispositifId,
                    voie,
                  });

                await deps.importIndicateurEntree({
                  formationEtablissementId: formationEtablissement.id,
                  rentreeScolaire,
                  cfd,
                  uai,
                  anneeDebutConstate,
                  anneesEnseignement,
                  anneesDispositif,
                });

                for (const millesime of MILLESIMES_IJ) {
                  await deps.importIndicateurSortie({
                    uai,
                    anneesDispositif,
                    formationEtablissementId: formationEtablissement.id,
                    millesime,
                  });
                }
              }
            }
          }
        }
      );
      logger.write();
    };
  }
);
