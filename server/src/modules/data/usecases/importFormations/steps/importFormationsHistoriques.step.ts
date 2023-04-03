import { DateTime } from "luxon";

import { dataDI } from "../../../data.di";
import { AncienneFormation } from "../../../entities/Formation";
import { NFormationDiplomeLine } from "../../../files/NFormationDiplome";
import { importFormationsDeps } from "../importFormations.deps";

const ancienDiplomeFields = [
  "ANCIEN_DIPLOME_1",
  "ANCIEN_DIPLOME_2",
  "ANCIEN_DIPLOME_3",
  "ANCIEN_DIPLOME_4",
  "ANCIEN_DIPLOME_5",
  "ANCIEN_DIPLOME_6",
  "ANCIEN_DIPLOME_7",
] as const;

const toAncienneFormation = ({
  cfd,
  ancienCfd,
  ancienneFormationData,
}: {
  cfd: string;
  ancienCfd: string;
  ancienneFormationData?: NFormationDiplomeLine;
}): Omit<AncienneFormation, "id"> | undefined => {
  if (!ancienneFormationData) return;
  if (!ancienneFormationData.DATE_OUVERTURE) return;
  return {
    nouveauCFD: cfd,
    codeFormationDiplome: ancienCfd,
    rncp: 123,
    libelleDiplome: ancienneFormationData.LIBELLE_LONG_200,
    codeNiveauDiplome: ancienCfd.slice(0, 3),
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
};

const toAncienCfds = ({
  formationData,
}: {
  formationData: NFormationDiplomeLine;
}) => {
  return ancienDiplomeFields
    .map((field) => formationData[field])
    .filter((item): item is string => !!item);
};

const isOldFormation = (dateFermeture: Date | undefined) => {
  return dateFermeture && dateFermeture?.getFullYear() < 2018;
};

export const importFormationHistoriqueFactory =
  ({
    createFormationHistorique = importFormationsDeps.createFormationHistorique,
    findRawData = dataDI.rawDataRepository.findRawData,
  }) =>
  async ({ cfd }: { cfd: string }) => {
    const formationData = await findRawData({
      type: "nFormationDiplome_",
      filter: { FORMATION_DIPLOME: cfd },
    });

    const ancienCfds = toAncienCfds({ formationData });

    for (const ancienCfd of ancienCfds) {
      const ancienneFormationData = await findRawData({
        type: "nFormationDiplome_",
        filter: { FORMATION_DIPLOME: ancienCfd },
      });

      const ancienneFormation = toAncienneFormation({
        cfd,
        ancienCfd,
        ancienneFormationData,
      });
      if (!ancienneFormation) continue;
      if (isOldFormation(ancienneFormation.dateFermeture)) {
        continue;
      }

      createFormationHistorique(ancienneFormation);
    }
  };
