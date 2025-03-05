import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";


export const getAnotherCampagneByAnneeQuery = async ({ id, annee }: { id: string; annee: string }) =>
  await getKbdClient()
    .selectFrom("campagne")
    .selectAll()
    .where((eb) =>
      eb.and([
        eb("campagne.annee", "=", annee),
        eb("campagne.id", "<>", id),
      ])
    )
    .executeTakeFirst();

export const updateCampagneQuery = async ({
  id,
  campagne,
}: {
  id: string;
  campagne: Insertable<DB["campagne"]>;
}) => {
  await getKbdClient()
    .updateTable("campagne")
    .set({ ...campagne })
    .where("id", "=", id)
    .execute();
};
