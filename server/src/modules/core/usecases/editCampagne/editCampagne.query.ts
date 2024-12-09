import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

export const updateCampagneQuery = async ({
  campagneId,
  campagne,
}: {
  campagneId: string;
  campagne: Insertable<DB["campagne"]>;
}) => {
  await getKbdClient()
    .updateTable("campagne")
    .set({ ...campagne })
    .where("id", "=", campagneId)
    .execute();
};
