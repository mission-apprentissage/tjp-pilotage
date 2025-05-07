import type { Insertable } from "kysely";

import { getKbdClient } from "@/db/db";
import type { ChangementStatut } from "@/db/schema";

export const deleteChangementStatutQuery = async (changementStatut: Insertable<ChangementStatut>) => {
  if (changementStatut.id)
    await getKbdClient().deleteFrom("changementStatut").where("id", "=", changementStatut.id).execute();
};
