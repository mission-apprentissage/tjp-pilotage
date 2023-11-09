import { inject } from "injecti";

import { streamIt } from "../../utils/streamIt";
import { getCfdDispositifs } from "../getCfdRentrees/getCfdDispositifs.dep";
import { getCfdRentrees } from "../getCfdRentrees/getCfdRentrees.usecase";
import { MILLESIMES_IJ, RENTREES_SCOLAIRES } from "./domain/millesimes";
import { findDiplomesProfessionnels } from "./findDiplomesProfessionnels.dep";
import { logger } from "./importLogger";
import { fetchIJ } from "./steps/fetchIJ/fetchIJ.step";
import { fetchIjReg } from "./steps/fetchIjReg/fetchIjReg.step";
import { importEtablissement } from "./steps/importEtablissement/importEtablissement.step";
import { importFormation } from "./steps/importFormation/importFormation.step";
import { importFormationHistorique } from "./steps/importFormationsHistoriques/importFormationsHistoriques.step";
import { createFormationEtablissement } from "./steps/importIndicateurEtablissement/createFormationEtablissement.dep";
import { importIndicateurEtablissement } from "./steps/importIndicateurEtablissement/importIndicateurEtablissement.step";
import { importIndicateurEntree } from "./steps/importIndicateursEntree/importIndicateursEntree.step";
import { importIndicateurSortie } from "./steps/importIndicateursSortie/importIndicateursSortie.step";
import { importIndicateursRegionSortie } from "./steps/importIndicateursSortieRegionaux/importIndicateursSortieRegionaux.step";

const processedUais: string[] = [];

export const [importFormations] = inject(
  {
    importFormation,
    importFormationHistorique,
    findDiplomesProfessionnels,
    fetchIJ,
    fetchIjReg,
  },
  (deps) => {
    return async ({ fetchIj = true }: { fetchIj?: boolean } = {}) => {
      logger.reset();
      if (fetchIj) await deps.fetchIjReg();

      await streamIt(
        (count) =>
          deps.findDiplomesProfessionnels({ offset: count, limit: 60 }),
        async (item, count) => {
          const cfd = item["Code diplôme"]?.replace("-", "").slice(0, 8);
          console.log("cfd", cfd, count);
          if (!cfd) return;
          const formation = await deps.importFormation({ cfd });
          const ancienCfds = await deps.importFormationHistorique({ cfd });
          for (const ancienCfd of ancienCfds ?? []) {
            await importFormationEtablissements(ancienCfd, { fetchIj });
          }
          await importFormationEtablissements(cfd, { fetchIj });
          if (!formation) return;
        },
        { parallel: 1 }
      );
      // logger.write();
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
    fetchIJ,
    importIndicateursRegionSortie,
  },
  (deps) => {
    return async (
      cfd: string,
      { fetchIj = true }: { fetchIj?: boolean } = {}
    ) => {
      const cfdDispositifs = await deps.getCfdDispositifs({ cfd });

      for (const cfdDispositif of cfdDispositifs) {
        const { dispositifId, anneesDispositif, dureeDispositif } =
          cfdDispositif;

        await deps.importIndicateursRegionSortie({
          cfd,
          dispositifId,
          mefstat: anneesDispositif[dureeDispositif - 1].mefstat,
        });

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
              if (fetchIj) await deps.fetchIJ({ uai });

              await deps.importEtablissement({ uai });
              for (const millesime of MILLESIMES_IJ) {
                await deps.importIndicateurEtablissement({ uai, millesime });
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
                mefstat: anneesDispositif[dureeDispositif - 1].mefstat,
                formationEtablissementId: formationEtablissement.id,
                millesime,
              });
            }
          }
        }
      }
    };
  }
);
