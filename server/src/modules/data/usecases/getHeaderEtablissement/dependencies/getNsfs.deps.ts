import { expressionBuilder, sql } from "kysely";

import { kdb } from "../../../../../db/db";
import { DB } from "../../../../../db/schema";
import { cleanNull } from "../../../../../utils/noNull";

const allNsfs = ({ uai }: { uai: string }) =>
  expressionBuilder<DB, keyof DB>()
    .selectFrom("formationEtablissement")
    .leftJoin("nsf", (join) =>
      join.on(
        "nsf.codeNsf",
        "=",
        (e) => sql`substring(${e.ref("formationEtablissement.cfd")},4,3)`
      )
    )
    .leftJoin("indicateurEntree", (join) =>
      join
        .onRef(
          "indicateurEntree.formationEtablissementId",
          "=",
          "formationEtablissement.id"
        )
        .on("formationEtablissement.voie", "=", "scolaire")
    )
    .where((eb) =>
      eb(
        "formationEtablissement.cfd",
        "not in",
        eb.selectFrom("familleMetier").select("cfdFamille")
      )
    )
    .where("formationEtablissement.UAI", "=", uai)
    .select((eb) => [
      "nsf.codeNsf",
      "nsf.libelleNsf",
      "indicateurEntree.rentreeScolaire",
      "formationEtablissement.voie",
      sql<number>`count(distinct ${eb.ref(
        "formationEtablissement.cfd"
      )} || coalesce(${eb.ref("formationEtablissement.dispositifId")},''))`.as(
        "nbFormations"
      ),
    ])
    .groupBy(["libelleNsf", "codeNsf", "rentreeScolaire", "voie"])
    .distinct()
    .orderBy(["nbFormations desc", "nsf.libelleNsf"]);

export const getNsfs = ({ uai }: { uai: string }) =>
  kdb
    .selectFrom(allNsfs({ uai }).as("allNsfs"))
    .where((w) =>
      w
        .case()
        .when(w.ref("allNsfs.voie"), "=", "scolaire")
        .then(sql<boolean>`${w.ref("allNsfs.rentreeScolaire")} = '2023'`)
        .else(true)
        .end()
    )
    .select(["codeNsf", "libelleNsf", "nbFormations"])
    .distinct()
    .execute()
    .then(cleanNull);
