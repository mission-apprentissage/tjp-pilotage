import { Insertable } from "kysely";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";
import { NDispositifFormation } from "../../fileTypes/NDispositifFormation";

const findNDispositifFormation = async ({
  offset,
  limit,
}: {
  offset: number;
  limit: number;
}) => {
  return (
    await kdb
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
  await kdb
    .insertInto("dispositif")
    .values(dispositif)
    .onConflict((oc) => oc.column("codeDispositif").doUpdateSet(dispositif))
    .execute();
};

export const dependencies = {
  findNDispositifFormation,
  createDispositif,
};
