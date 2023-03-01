import { DateTime } from "luxon";

import { dataDI } from "../../data.di";
import { streamIt } from "../../utils/streamIt";
import { createFormationsHistoriquesDeps } from "./importFormationsHistoriques.deps";

const ancienDiplomeFields = [
  "ANCIEN_DIPLOME_1",
  "ANCIEN_DIPLOME_2",
  "ANCIEN_DIPLOME_3",
  "ANCIEN_DIPLOME_4",
  "ANCIEN_DIPLOME_5",
  "ANCIEN_DIPLOME_6",
  "ANCIEN_DIPLOME_7",
] as const;

export const importFormationHistoriqueFactory =
  ({
    createFormationsHistoriques = createFormationsHistoriquesDeps.createFormationsHistoriques,
    getFormations = createFormationsHistoriquesDeps.getFormations,
    findRawData = dataDI.rawDataRepository.findRawData,
  }) =>
  async () => {
    console.log(`Import des formations historiques`);

    await streamIt(
      async (count) => (count ? [] : await getFormations()),
      async (item) => {
        const formationData = await findRawData({
          type: "nFormationDiplome_",
          filter: { FORMATION_DIPLOME: item.codeFormationDiplome },
        });

        const dataPromises = ancienDiplomeFields
          .map((field) => formationData[field])
          .filter((item): item is string => !!item)
          .map(async (ancienCFD) => {
            const ancienneFormationData = await findRawData({
              type: "nFormationDiplome_",
              filter: { FORMATION_DIPLOME: ancienCFD },
            });
            return {
              nouveauCFD: item.codeFormationDiplome,
              codeFormationDiplome: ancienCFD,
              rncp: 123,
              libelleDiplome: ancienneFormationData.LIBELLE_LONG_200,
              codeNiveauDiplome: ancienCFD.slice(0, 3),
              dateOuverture: DateTime.fromFormat(
                ancienneFormationData.DATE_OUVERTURE,
                "dd/LL/yyyy"
              ).toJSDate(),
              dateFermeture: ancienneFormationData.DATE_FERMETURE
                ? DateTime.fromFormat(
                    ancienneFormationData.DATE_FERMETURE,
                    "dd/LL/yyyy"
                  ).toJSDate()
                : undefined,
            };
          });

        const anciennesFormations = await Promise.all(dataPromises);
        await createFormationsHistoriques(anciennesFormations);
      }
    );
  };

export const importFormationHistorique = importFormationHistoriqueFactory({});
