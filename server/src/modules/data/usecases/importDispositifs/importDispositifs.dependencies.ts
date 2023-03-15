import { db, pool } from "../../../../db/zapatos";
import { Dispositif } from "../../entities/Dispositif";
import { NDispositifFormation } from "../../files/NDispositifFormation";

const findNDispositifFormation = async ({
  offset,
  limit,
}: {
  offset: number;
  limit: number;
}) => {
  return (
    await db
      .select(
        "rawData",
        {
          type: "nDispositifFormation_",
        },
        { offset, limit }
      )
      .run(pool)
  ).map((item) => item.data as NDispositifFormation);
};

const createDispositif = async (dispositif: Dispositif) => {
  await db.upsert("dispositif", dispositif, "codeDispositif").run(pool);
};

export const dependencies = {
  findNDispositifFormation,
  createDispositif,
};
