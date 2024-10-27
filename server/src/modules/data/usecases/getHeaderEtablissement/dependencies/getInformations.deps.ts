import type { ExpressionBuilder } from "kysely";
import { sql } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

const getEtablissementLibelle = (eb: ExpressionBuilder<DB, "etablissement">) =>
  sql<string>`trim(split_part(split_part(split_part(split_part(coalesce(${eb.ref(
    "etablissement.libelleEtablissement"
  )},${sql.lit("Sans libellé")}),' - Lycée',1),' -Lycée',1),',',1),' : ',1))`;

export const getInformations = ({ uai }: { uai: string }) =>
  getKbdClient()
    .selectFrom("etablissement")
    .leftJoin("departement", "etablissement.codeDepartement", "departement.codeDepartement")
    .leftJoin("formationEtablissement as feScolaire", (join) =>
      join.onRef("feScolaire.uai", "=", "etablissement.uai").on("feScolaire.voie", "=", "scolaire")
    )
    .leftJoin("formationEtablissement as feApprentissage", (join) =>
      join.onRef("feApprentissage.uai", "=", "etablissement.uai").on("feApprentissage.voie", "=", "apprentissage")
    )
    .where("etablissement.uai", "=", uai)
    .select((eb) => [
      getEtablissementLibelle(eb).as("libelleEtablissement"),
      sql<string>`INITCAP(${eb.ref("etablissement.adresseEtablissement")})`.as("adresse"),
      eb.ref("etablissement.uai").as("uai"),
      eb.ref("etablissement.commune").as("commune"),
      eb.ref("etablissement.codePostal").as("codePostal"),
      eb.ref("departement.libelleDepartement").as("libelleDepartement"),
      eb.ref("departement.codeDepartement").as("codeDepartement"),
      eb.ref("departement.codeRegion").as("codeRegion"),
      sql<boolean>`count(${eb.table("feScolaire")}.*) over (partition by ${eb.ref("feScolaire.uai")}) > 0`.as(
        "isScolaire"
      ),
      sql<boolean>`count(${eb.table("feApprentissage")}.*) over (partition by ${eb.ref("feApprentissage.uai")}) > 0`.as(
        "isApprentissage"
      ),
      eb.ref("etablissement.secteur").as("secteur"),
    ])
    .distinct()
    .executeTakeFirst()
    .then(cleanNull);
