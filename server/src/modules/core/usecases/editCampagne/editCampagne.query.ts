import { Insertable } from "kysely";

import { DB, kdb } from "../../../../db/db";

export const updateCampagneQuery = async ({
  campagneId,
  campagne,
}: {
  campagneId: string;
  campagne: Insertable<DB["campagne"]>;
}) => {
  await kdb
    .updateTable("campagne")
    .set({ ...campagne })
    .where("id", "=", campagneId)
    .execute();
};
