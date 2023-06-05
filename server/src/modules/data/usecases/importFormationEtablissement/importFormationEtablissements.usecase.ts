import { inject } from "injecti";

import { streamIt } from "../../utils/streamIt";
import { getCfdRentrees } from "../getCfdRentrees/getCfdRentrees.usecase";
import { dependencies } from "./dependencies.di";
import { MILLESIMES_IJ, RENTREES_SCOLAIRES } from "./domain/millesimes";
import { logger } from "./importLogger";
import { importEtablissement } from "./steps/importEtablissement.step";
import { importIndicateurEtablissement } from "./steps/importIndicateurEtablissement";
import { importIndicateurEntree } from "./steps/importIndicateursEntree.step";
import { importIndicateurSortie } from "./steps/importIndicateursSortie.step";

export const [importFormationEtablissements] = inject(
  {
    findFormations: dependencies.findFormations,
    createFormationEtablissement: dependencies.createFormationEtablissement,
    importEtablissement,
    importIndicateurEtablissement,
    importIndicateurEntree,
    importIndicateurSortie,
    getCfdRentrees,
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
