import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import type { NDispositifFormation } from "@/modules/import/fileTypes/NDispositifFormation";

const findNDispositifFormation = async ({ offset, limit }: { offset: number; limit: number }) => {
  return (
    await getKbdClient()
      .selectFrom("rawData")
      .selectAll("rawData")
      .where("type", "=", "nDispositifFormation_")
      .orderBy("id", "asc")
      .offset(offset)
      .limit(limit)
      .execute()
  ).map((item) => item.data as NDispositifFormation);
};

const createDispositif = async (dispositif: Insertable<DB["dispositif"]>) => {
  await getKbdClient()
    .insertInto("dispositif")
    .values(dispositif)
    .onConflict((oc) => oc.column("codeDispositif").doUpdateSet(dispositif))
    .execute();
};

export const dependencies = {
  findNDispositifFormation,
  createDispositif,
};
