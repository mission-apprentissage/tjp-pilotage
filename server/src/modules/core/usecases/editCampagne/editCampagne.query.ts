import { Insertable } from "kysely";

import { DB, kdb } from "../../../../db/db";

export const updateCampagne = async ({
  campagneId,
  data,
}: {
  campagneId: string;
  data: Insertable<DB["campagne"]>;
}) => {
  await kdb
    .updateTable("campagne")
    .set({ ...data })
    .where("id", "=", campagneId)
    .execute();
};
