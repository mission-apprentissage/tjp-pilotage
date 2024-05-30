import { Insertable } from "kysely";

import { kdb } from "../../../../db/db";
import { ChangementStatut } from "../../../../db/schema";

export const deleteChangementStatutQuery = async (
  changementStatut: Insertable<ChangementStatut>
) => {
  if (changementStatut.id)
    await kdb
      .deleteFrom("changementStatut")
      .where("id", "=", changementStatut.id)
      .execute();
};
