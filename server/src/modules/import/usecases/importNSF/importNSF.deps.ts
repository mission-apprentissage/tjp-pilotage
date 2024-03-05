import { Insertable } from "kysely";

import { DB, kdb } from "../../../../db/db";

const createNSFGroupeSpecialite = async (
  NSFGroupeSpecialite: Insertable<DB["nsf"]>
) => {
  return kdb
    .insertInto("nsf")
    .values(NSFGroupeSpecialite)
    .onConflict((oc) => oc.column("codeNsf").doUpdateSet(NSFGroupeSpecialite))
    .execute();
};

export const importNSFGroupeSpecialite = {
  createNSFGroupeSpecialite,
};
