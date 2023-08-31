import { Insertable } from "kysely";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";

export const createDemandeQuery = async ({
  demande,
}: {
  demande: Insertable<DB["demande"]>;
}) => {
  await kdb.insertInto("demande").values(demande).execute();
};
