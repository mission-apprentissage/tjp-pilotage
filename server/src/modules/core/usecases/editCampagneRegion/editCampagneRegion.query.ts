import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

export const updateCampagneRegionQuery = async ({
  id,
  campagneRegion,
}: {
  id: string;
  campagneRegion: Insertable<DB["campagneRegion"]>;
}) => {
  await getKbdClient()
    .updateTable("campagneRegion")
    .set({ ...campagneRegion })
    .where("id", "=", id)
    .execute();
};
