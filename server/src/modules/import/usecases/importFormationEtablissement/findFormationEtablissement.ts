import type { Insertable } from "kysely";

import type { DB} from "@/db/db";
import { getKbdClient } from "@/db/db";

export const findFormationEtablissement = async (formationEtablissement: Insertable<DB["formationEtablissement"]>) => {
  return getKbdClient()
    .selectFrom("formationEtablissement")
    .selectAll()
    .where(eb => (
      eb.and([
        eb("cfd", "=", formationEtablissement.cfd),
        eb("uai", "=", formationEtablissement.uai),
        eb("voie", "=", formationEtablissement.voie),
        eb("codeDispositif", "is", formationEtablissement.codeDispositif ?? null)
      ])
    ))
    .executeTakeFirst();
};
