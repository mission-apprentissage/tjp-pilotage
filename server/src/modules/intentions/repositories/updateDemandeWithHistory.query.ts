import { Insertable } from "kysely";
import _ from "lodash";

import { DB, kdb } from "../../../db/db";
import { generateId } from "../../utils/generateId";

export const updateDemandeWithHistory = async (
  demande: Insertable<DB["demande"]>
) =>
  kdb
    .insertInto("demande")
    .values({
      ...(_.omit(demande, ["id", "dateModification"]) as Insertable<
        DB["demande"]
      >),
      id: generateId(),
      dateModification: new Date(),
    })
    .returningAll()
    .executeTakeFirst();
