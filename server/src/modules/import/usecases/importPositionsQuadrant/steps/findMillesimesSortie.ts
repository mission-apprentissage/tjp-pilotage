import { getKbdClient } from "@/db/db";

export const findMillesimesSortie = async () =>
  await getKbdClient().selectFrom("indicateurSortie").distinct().select(["millesimeSortie"]).execute();
