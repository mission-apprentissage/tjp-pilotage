import { Insertable } from "kysely";
import _ from "lodash";

import { DB, kdb } from "../../../db/db";
import { generateId } from "../../utils/generateId";

export const updateIntentionWithHistory = async (
  demande: Insertable<DB["intention"]>
) =>
  kdb
    .insertInto("intention")
    .values({
      ...(_.omit(demande, ["id", "updatedAt"]) as Insertable<DB["intention"]>),
      id: generateId(),
      updatedAt: new Date(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();
