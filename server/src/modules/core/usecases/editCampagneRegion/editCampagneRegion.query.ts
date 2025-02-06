import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";



export const getAnotherCampagneRegionByAnneeAndCodeRegionQuery = async (
  { id, annee, codeRegion }:
  { id: string; annee: string; codeRegion: string }
) =>
  await getKbdClient()
    .selectFrom("campagneRegion")
    .innerJoin("campagne", "campagne.id", "campagneRegion.campagneId")
    .selectAll()
    .where((eb) =>
      eb.and([
        eb("campagne.annee", "=", annee),
        eb("campagneRegion.codeRegion", "=", codeRegion),
        eb("campagneRegion.id", "<>", id),
      ])
    )
    .executeTakeFirst();

export const getCampagneOfCampagneRegionQuery = async ({ id }: { id: string }) =>
  await getKbdClient()
    .selectFrom("campagneRegion")
    .innerJoin("campagne", "campagne.id", "campagneRegion.campagneId")
    .selectAll("campagne")
    .where("campagneRegion.id", "=", id)
    .executeTakeFirst();

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
