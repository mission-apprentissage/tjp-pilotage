import _ from "lodash";
import { IsolationLevel } from "zapatos/db";

import { db, pool } from "../../../../db/zapatos";
import { AncienneFormation, Formation } from "../../entities/Formation";
import { rawDataRepository } from "../../repositories/rawData.repository";

const createFormation = async (formations: Omit<Formation, "id">[]) => {
  await db.upsert("formation", formations, "codeFormationDiplome").run(pool);
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

  await db.transaction(pool, IsolationLevel.Serializable, async (tr) => {
    await db
      .upsert(
        "formation",
        _.omit(ancienneFormation, "nouveauCFD"),
        "codeFormationDiplome",
        { updateColumns: db.doNothing }
      )
      .run(tr);

    await db
      .upsert("formationHistorique", formationHistorique, [
        "ancienCFD",
        "codeFormationDiplome",
      ])
      .run(tr);
  });
};

export const importFormationsDeps = {
  createFormation,
  findDiplomesProfessionnels,
  findNFormationDiplome,
  createFormationHistorique,
};
