import _ from "lodash";

import { kdb } from "../../../../db/db";
import { AncienneFormation, Formation } from "../../entities/Formation";
import { rawDataRepository } from "../../repositories/rawData.repository";

const createFormation = async (formation: Omit<Formation, "id">) => {
  await kdb
    .insertInto("formation")
    .values(formation)
    .onConflict((oc) =>
      oc.column("codeFormationDiplome").doUpdateSet(formation)
    )
    .execute();
};

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

const findNFormationDiplome = ({ cfd }: { cfd: string }) => {
  return rawDataRepository.findRawData({
    type: "nFormationDiplome_",
    filter: { FORMATION_DIPLOME: cfd },
  });
};

export const createFormationHistorique = async (
  ancienneFormation: Omit<AncienneFormation, "id">
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

export const importFormationsDeps = {
  createFormation,
  findDiplomesProfessionnels,
  findNFormationDiplome,
  createFormationHistorique,
};
