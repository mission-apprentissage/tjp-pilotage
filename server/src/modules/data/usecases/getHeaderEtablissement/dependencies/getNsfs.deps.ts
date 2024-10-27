import { expressionBuilder, sql } from "kysely";

import { getKbdClient } from "@/db/db";
import type { DB } from "@/db/schema";
import { cleanNull } from "@/utils/noNull";

const getAllEtablisementNsfs = ({ uai }: { uai: string }) =>
  expressionBuilder<DB, keyof DB>()
    .selectFrom("formationEtablissement")
    .leftJoin("nsf", (join) =>
      join.on("nsf.codeNsf", "=", (e) => sql`substring(${e.ref("formationEtablissement.cfd")},4,3)`)
    )
    .leftJoin("indicateurEntree", (join) =>
      join
        .onRef("indicateurEntree.formationEtablissementId", "=", "formationEtablissement.id")
        .on("formationEtablissement.voie", "=", "scolaire")
    )
    .where((eb) => eb("formationEtablissement.cfd", "not in", eb.selectFrom("familleMetier").select("cfdFamille")))
    .where("formationEtablissement.uai", "=", uai)
    .select((eb) => [
      "nsf.codeNsf",
      "nsf.libelleNsf",
      "indicateurEntree.rentreeScolaire",
      "formationEtablissement.voie",
      sql<number>`count(distinct ${eb.ref("formationEtablissement.cfd")} || coalesce(${eb.ref(
        "formationEtablissement.codeDispositif"
      )},''))`.as("nbFormations"),
    ])
    .groupBy(["libelleNsf", "codeNsf", "rentreeScolaire", "voie"])
    .distinct()
    .orderBy(["nbFormations desc", "nsf.libelleNsf"]);

export const getNsfs = ({ uai }: { uai: string }) =>
  getKbdClient()
    .selectFrom(getAllEtablisementNsfs({ uai }).as("nsfs"))
    .where((w) =>
      w
        .case()
        .when(w.ref("nsfs.voie"), "=", "scolaire")
        .then(sql<boolean>`${w.ref("nsfs.rentreeScolaire")} = '2023'`)
        .else(true)
        .end()
    )
    .select((eb) => ["codeNsf", "libelleNsf", eb.fn.sum("nbFormations").as("nbFormations")])
    .groupBy(["codeNsf", "libelleNsf"])
    .orderBy("nbFormations desc")
    .distinct()
    .$castTo<{ codeNsf: string; libelleNsf: string; nbFormations: number }>()
    .execute()
    .then(cleanNull);
