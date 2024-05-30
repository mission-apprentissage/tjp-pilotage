import { kdb } from "../../../db/db";
import { cleanNull } from "../../../utils/noNull";

export const findOneChangementStatut = async (id: string) => {
  return cleanNull(
    await kdb
      .selectFrom("changementStatut")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst()
  );
};
