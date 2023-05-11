import { streamIt } from "../../utils/streamIt";
import { getCfdRentrees as getCfdRentreesDep } from "../getCfdRentrees/getCfdRentrees.usecase";
import { dependencies } from "./dependencies.di";
import { MILLESIMES_IJ, RENTREES_SCOLAIRES } from "./domain/millesimes";
import { logger } from "./importLogger";
import { importEtablissementFactory } from "./steps/importEtablissement.step";
import { importIndicateurEtablissementFactory } from "./steps/importIndicateurEtablissement";
import { importIndicateurEntree as importIndicateurEntreeDep } from "./steps/importIndicateursEntree.step";
import { importIndicateurSortieFactory } from "./steps/importIndicateursSortie.step";

export const importFormationEtablissementsFactory = ({
  findFormations = dependencies.findFormations,
  createFormationEtablissement = dependencies.createFormationEtablissement,
  importEtablissement = importEtablissementFactory(),
  importIndicateurEtablissement = importIndicateurEtablissementFactory({}),
  importIndicateurEntree = importIndicateurEntreeDep,
  importIndicateurSortie = importIndicateurSortieFactory({}),
  getCfdRentrees = getCfdRentreesDep,
}) => {
  logger.reset();
  return async () => {
    await streamIt(
      async (count) => findFormations({ offset: count, limit: 50 }),
      async (item, count) => {
        const processedUais: string[] = [];
        const cfd = item.codeFormationDiplome;

        for (const rentreeScolaire of RENTREES_SCOLAIRES) {
          const cfdDispositifs = await getCfdRentrees({
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
                  await importIndicateurEtablissement({ uai, millesime });
                }
                processedUais.push(uai);
              }
              if (voie !== "scolaire") continue;

              const formationEtablissement = await createFormationEtablissement(
                {
                  UAI: uai,
                  cfd,
                  dispositifId,
                  voie,
                }
              );

              await importIndicateurEntree({
                formationEtablissementId: formationEtablissement.id,
                rentreeScolaire,
                cfd,
                uai,
                anneeDebutConstate,
                anneesEnseignement,
                anneesDispositif,
              });

              for (const millesime of MILLESIMES_IJ) {
                await importIndicateurSortie({
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
};

export const importFormationEtablissements =
  importFormationEtablissementsFactory({});
