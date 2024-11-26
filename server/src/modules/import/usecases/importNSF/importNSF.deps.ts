import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

const createNSFGroupeSpecialite = async (NSFGroupeSpecialite: Insertable<DB["nsf"]>) => {
  return getKbdClient()
    .insertInto("nsf")
    .values(NSFGroupeSpecialite)
    .onConflict((oc) => oc.column("codeNsf").doUpdateSet(NSFGroupeSpecialite))
    .execute();
};

export const importNSFGroupeSpecialite = {
  createNSFGroupeSpecialite,
};
