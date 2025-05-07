import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

export const createDemandeAccessLog = async (demandeAccessLog: Insertable<DB["demandeAccessLog"]>) =>
  await getKbdClient()
    .insertInto("demandeAccessLog")
    .values({
      ...demandeAccessLog,
      updatedAt: new Date(),
    })
    .onConflict((oc) => oc.columns(["demandeNumero", "userId"]).doUpdateSet(demandeAccessLog))
    .returningAll()
    .executeTakeFirstOrThrow();
