import type { Kysely } from "kysely";

import type { DB } from "@/db/schema";

export const createDemandeConstatViewIndex = async (db: Kysely<DB>) => {
  await db.schema
    .createIndex("demandeConstatView_index")
    .ifNotExists()
    .unique()
    .on("demandeConstatView")
    .columns(["numero", "typeDemande", "cfd", "codeDispositif", "uai", "rentreeScolaire"])
    .execute();
};

export const dropDemandeConstatViewIndex = async (db: Kysely<DB>) => {
  await db.schema
    .dropIndex("demandeConstatView_index")
    .ifExists()
    .execute();
};
