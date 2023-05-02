import { streamIt } from "../../utils/streamIt";
import { getCfdRentreesFactory } from "../getCfdRentrees/getCfdRentrees.usecase";
import { dependencies } from "./dependencies.di";
import { MILLESIMES } from "./domain/millesimes";
import { logger } from "./importLogger";
import { importEtablissementFactory } from "./steps/importEtablissement.step";
import { importIndicateurEtablissementFactory } from "./steps/importIndicateurEtablissement";
import { importIndicateurEntreeFactory } from "./steps/importIndicateursEntree.step";
import { importIndicateurSortieFactory } from "./steps/importIndicateursSortie.step";

export const importFormationEtablissementsFactory = ({
  findFormations = dependencies.findFormations,
  createFormationEtablissement = dependencies.createFormationEtablissement,
  importEtablissement = importEtablissementFactory(),
  importIndicateurEtablissement = importIndicateurEtablissementFactory({}),
  importIndicateurEntree = importIndicateurEntreeFactory({}),
  importIndicateurSortie = importIndicateurSortieFactory({}),
  getCfdRentrees = getCfdRentreesFactory({}),
}) => {
  logger.reset();
  return async () => {
    await streamIt(
      async (count) => findFormations({ offset: count, limit: 50 }),
      async (item, count) => {
        const processedUais: string[] = [];
        const cfd = item.codeFormationDiplome;
        const cfdRentrees = await getCfdRentrees({ cfd });
        console.log("cfd", cfd, count);

        for (const dispositifRentrees of cfdRentrees) {
          const { uai, voie, dispositifId } = dispositifRentrees;
          console.log(dispositifRentrees);

          if (!processedUais.includes(uai)) {
            await importEtablissement({ uai });
            await importIndicateurEtablissement({ uai });
            processedUais.push(uai);
          }
          if (voie !== "scolaire") continue;

          const formationEtablissement = await createFormationEtablissement({
            UAI: uai,
            cfd,
            dispositifId,
            voie,
          });

          await importIndicateurEntree({
            formationEtablissementId: formationEtablissement.id,
            dispositifRentrees,
          });

          for (const millesime of MILLESIMES) {
            await importIndicateurSortie({
              formationEtablissementId: formationEtablissement.id,
              dispositifRentrees,
              millesime,
            });
          }
        }
      }
    );
    logger.write();
  };
};

export const importFormationEtablissements =
  importFormationEtablissementsFactory({});
