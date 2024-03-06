import { sql } from "kysely";

import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";

export const getNsfs = ({ uai }: { uai: string }) =>
  kdb
    .selectFrom("formationEtablissement")
    .leftJoin("nsf", (join) =>
      join.on(
        "nsf.codeNsf",
        "=",
        (e) => sql`substring(${e.ref("formationEtablissement.cfd")},4,3)`
      )
    )
    .where((eb) =>
      eb(
        "formationEtablissement.cfd",
        "not in",
        eb.selectFrom("familleMetier").select("cfdFamille")
      )
    )
    .where("formationEtablissement.UAI", "=", uai)
    .groupBy(["libelleNsf", "codeNsf"])
    .select((eb) => [
      "nsf.codeNsf",
      "nsf.libelleNsf",
      sql<number>`count(distinct ${eb.ref(
        "formationEtablissement.cfd"
      )} || coalesce(${eb.ref("formationEtablissement.dispositifId")},''))`.as(
        "nbFormations"
      ),
    ])
    .distinct()
    .orderBy(["nbFormations desc", "nsf.libelleNsf"])
    .execute()
    .then(cleanNull);
