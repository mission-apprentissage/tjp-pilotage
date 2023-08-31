import { kdb } from "../../../db/db";
import { cleanNull } from "../../../utils/noNull";

export const findDemande = async ({ id }: { id: string }) => {
  const demande = await kdb
    .selectFrom("demande")
    .selectAll()
    .where("id", "=", id)
    .orderBy("createdAt", "asc")
    .limit(1)
    .executeTakeFirst();

  return (
    demande &&
    cleanNull({ ...demande, createdAt: demande.createdAt?.toISOString() })
  );
};
