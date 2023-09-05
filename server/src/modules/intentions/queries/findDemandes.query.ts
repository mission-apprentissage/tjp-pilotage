import { kdb } from "../../../db/db";
import { cleanNull } from "../../../utils/noNull";

export const findDemandes = async () => {
  const demandes = await kdb
    .selectFrom("demande")
    .selectAll()
    .orderBy("createdAt", "asc")
    .execute();

  return demandes.map((item) =>
    cleanNull({ ...item, createdAt: item.createdAt?.toISOString() })
  );
};
