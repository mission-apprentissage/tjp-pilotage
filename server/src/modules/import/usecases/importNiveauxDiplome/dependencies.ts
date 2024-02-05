import { Insertable } from "kysely";

import { DB, kdb } from "../../../../db/db";
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

const createNiveauDiplome = async ({
  data
}: { 
  data: Array<Insertable<DB["niveauDiplome"]>>
}) => {
  await kdb
    .insertInto("niveauDiplome")
    .values(data)
    .execute();
};

export const dependencies = {
  findNNiveauDiplomes,
  createNiveauDiplome,
};
