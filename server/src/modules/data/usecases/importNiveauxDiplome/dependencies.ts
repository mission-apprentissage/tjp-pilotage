import { db, pool } from "../../../../db/zapatos";
import { NiveauDiplome } from "../../entities/NiveauDiplome";
import { rawDataRepository } from "../../repositories/rawData.repository";

const findNNiveauDiplomes = async ({
  offset,
  limit,
}: {
  offset: number;
  limit: number;
}) => {
  return await rawDataRepository.findRawDatas({
    type: "nNiveauFormationDiplome_",
    offset,
    limit,
  });
};

const createNiveauDiplome = async (niveauDiplome: NiveauDiplome) => {
  await db
    .upsert("niveauDiplome", niveauDiplome, "codeNiveauDiplome")
    .run(pool);
};

export const dependencies = {
  findNNiveauDiplomes,
  createNiveauDiplome,
};
