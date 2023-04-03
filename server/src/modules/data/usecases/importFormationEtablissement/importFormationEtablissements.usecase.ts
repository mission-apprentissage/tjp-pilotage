import { streamIt } from "../../utils/streamIt";
import { dependencies } from "./dependencies.di";
import { MILLESIMES } from "./domain/millesimes";
import { logger } from "./importLogger";
import { getUaiFormationsFactory } from "./steps/getUaiFormations.step";
import { importEtablissementFactory } from "./steps/importEtablissement.step";
import { importIndicateurEtablissementFactory } from "./steps/importIndicateurEtablissement";
import { importIndicateurEntreeFactory } from "./steps/importIndicateursEntree.step";
import { importIndicateurSortieFactory } from "./steps/importIndicateursSortie.step";

export const importFormationEtablissementsFactory = ({
  findFormations = dependencies.findFormations,
  createFormationEtablissement = dependencies.createFormationEtablissement,
  importEtablissement = importEtablissementFactory(),
  getUaiFormations = getUaiFormationsFactory({}),
  importIndicateurEtablissement = importIndicateurEtablissementFactory({}),
  importIndicateurEntree = importIndicateurEntreeFactory({}),
  importIndicateurSortie = importIndicateurSortieFactory({}),
}) => {
  logger.reset();
  return async () => {
    await streamIt(
      async (count) => findFormations({ offset: count, limit: 50 }),
      async (item, count) => {
        const processedUais: string[] = [];
        const cfd = item.codeFormationDiplome;
        const uaiFormations = await getUaiFormations({ cfd });
        console.log("cfd", cfd, count);

        for (const uaiFormation of uaiFormations) {
          const uai = uaiFormation.uai;

          if (!processedUais.includes(uai)) {
            await importEtablissement({ uai });
            await importIndicateurEtablissement({ uai });
            processedUais.push(uai);
          }

          if (uaiFormation.voie !== "scolaire") continue;
          const formationEtablissement = await createFormationEtablissement({
            UAI: uai,
            cfd,
            dispositifId: uaiFormation.dispositifId,
            voie: uaiFormation.voie,
          });
          await importIndicateurEntree({
            isSpecialite: uaiFormation.isSpecialite,
            formationEtablissementId: formationEtablissement.id,
            mefstat11FirstYear: uaiFormation.mefstat11FirstYear,
            libelleDebut: uaiFormation.libelleDebut,
            uai,
          });

          for (const millesime of MILLESIMES) {
            await importIndicateurSortie({
              formationEtablissementId: formationEtablissement.id,
              mefstat11LastYear: uaiFormation.mefstat11LastYear,
              millesime,
              uai,
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
