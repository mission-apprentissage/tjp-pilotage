import { Insertable } from "kysely";
import _ from "lodash";

import { DB, kdb } from "../../../db/db";
import { generateId } from "../../utils/generateId";

export const updateDemandeExpeWithHistory = async (
  demande: Insertable<DB["demandeExpe"]>
) =>
  kdb
    .insertInto("demandeExpe")
    .values({
      ...(_.omit(demande, ["id", "updatedAt"]) as Insertable<
        DB["demandeExpe"]
      >),
      id: generateId(),
      updatedAt: new Date(),
    })
    .returningAll()
    .executeTakeFirst();
