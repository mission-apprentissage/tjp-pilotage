import { db, pool } from "../../../../db/zapatos";
import { Formation } from "../../entities/Formation";
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

export const importFormationsDeps = {
  createFormation,
  findDiplomesProfessionnels,
  findNFormationDiplome,
};
