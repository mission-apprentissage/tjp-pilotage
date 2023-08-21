import { inject } from "injecti";
import { Insertable } from "kysely";
import _ from "lodash";
import { DateTime } from "luxon";

import { kdb } from "../../../../../../db/db";
import { DB } from "../../../../../../db/schema";
import { NFormationDiplomeLine } from "../../../../../../../public/files/NFormationDiplome";
import { rawDataRepository } from "../../../../repositories/rawData.repository";

export const createFormationHistorique = async (
  ancienneFormation: Insertable<DB["formation"]> & {
    nouveauCFD: string;
  }
) => {
  const formationHistorique = {
    codeFormationDiplome: ancienneFormation.nouveauCFD,
    ancienCFD: ancienneFormation.codeFormationDiplome,
  };
  kdb.transaction().execute(async (t) => {
    await t
      .insertInto("formation")
      .values(_.omit(ancienneFormation, "nouveauCFD"))
      .onConflict((oc) => oc.column("codeFormationDiplome").doNothing())
      .execute();

    await t
      .insertInto("formationHistorique")
      .values(formationHistorique)
      .onConflict((oc) =>
        oc.columns(["ancienCFD", "codeFormationDiplome"]).doNothing()
      )
      .execute();
  });
};

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
}):
  | (Insertable<DB["formation"]> & {
      nouveauCFD: string;
    })
  | undefined => {
  if (!ancienneFormationData) return;
  if (!ancienneFormationData.DATE_OUVERTURE) return;
  return {
    nouveauCFD: cfd,
    codeFormationDiplome: ancienCfd,
    libelleDiplome: ancienneFormationData.LIBELLE_LONG_200.replace(/"/g, ""),
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

export const [importFormationHistorique] = inject(
  {
    createFormationHistorique,
    findRawData: rawDataRepository.findRawData,
  },
  (deps) =>
    async ({ cfd }: { cfd: string }) => {
      const formationData = await deps.findRawData({
        type: "nFormationDiplome_",
        filter: { FORMATION_DIPLOME: cfd },
      });
      if (!formationData) return;

      const ancienCfds = toAncienCfds({ formationData });

      for (const ancienCfd of ancienCfds) {
        const ancienneFormationData = await deps.findRawData({
          type: "nFormationDiplome_",
          filter: { FORMATION_DIPLOME: ancienCfd },
        });

        const ancienneFormation = toAncienneFormation({
          cfd,
          ancienCfd,
          ancienneFormationData,
        });
        if (!ancienneFormation) continue;
        if (
          isOldFormation(
            ancienneFormation.dateFermeture
              ? new Date(ancienneFormation.dateFermeture)
              : undefined
          )
        ) {
          continue;
        }

        deps.createFormationHistorique(ancienneFormation);
      }
    }
);
