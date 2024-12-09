import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const findOneChangementStatut = async (id: string) => {
  return cleanNull(
    await getKbdClient().selectFrom("changementStatut").selectAll().where("id", "=", id).executeTakeFirst()
  );
};
