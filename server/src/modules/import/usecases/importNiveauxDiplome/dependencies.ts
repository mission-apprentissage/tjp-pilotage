import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import { rawDataRepository } from "@/modules/import/repositories/rawData.repository";

const findNNiveauDiplomes = async ({ offset, limit }: { offset: number; limit: number }) => {
  return await rawDataRepository.findRawDatas({
    type: "nNiveauFormationDiplome_",
    offset,
    limit,
  });
};

const createNiveauDiplome = async (niveauDiplome: Insertable<DB["niveauDiplome"]>) => {
  await getKbdClient()
    .insertInto("niveauDiplome")
    .values(niveauDiplome)
    .onConflict((oc) => oc.column("codeNiveauDiplome").doUpdateSet(niveauDiplome))
    .execute();
};

export const dependencies = {
  findNNiveauDiplomes,
  createNiveauDiplome,
};
