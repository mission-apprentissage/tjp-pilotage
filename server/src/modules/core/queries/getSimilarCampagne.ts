import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

export const getSimilarCampagne = async ({ data }: { data: Insertable<DB["campagne"]> }) =>
  await getKbdClient().selectFrom("campagne").selectAll().where("campagne.annee", "=", data.annee).executeTakeFirst();
