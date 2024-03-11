import { sql } from "kysely";

import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";

export const getInformations = ({ uai }: { uai: string }) =>
  kdb
    .selectFrom("etablissement")
    .leftJoin(
      "departement",
      "etablissement.codeDepartement",
      "departement.codeDepartement"
    )
    .leftJoin("formationEtablissement as feScolaire", (join) =>
      join
        .onRef("feScolaire.UAI", "=", "etablissement.UAI")
        .on("feScolaire.voie", "=", sql<string>`'scolaire'`)
    )
    .leftJoin("formationEtablissement as feApprentissage", (join) =>
      join
        .onRef("feApprentissage.UAI", "=", "etablissement.UAI")
        .on("feApprentissage.voie", "=", sql<string>`'apprentissage'`)
    )
    .where("etablissement.UAI", "=", uai)
    .select((eb) => [
      sql<string>`trim(split_part(split_part(split_part(split_part(${eb.ref(
        "etablissement.libelleEtablissement"
      )},' - Lycée',1),' -Lycée',1),',',1),' : ',1))`.as(
        "libelleEtablissement"
      ),
      sql<string>`INITCAP(${eb.ref("etablissement.adresseEtablissement")})`.as(
        "adresse"
      ),
      eb.ref("etablissement.UAI").as("uai"),
      eb.ref("etablissement.commune").as("commune"),
      eb.ref("etablissement.codePostal").as("codePostal"),
      eb.ref("departement.libelleDepartement").as("libelleDepartement"),
      eb.ref("departement.codeDepartement").as("codeDepartement"),
      eb.ref("departement.codeRegion").as("codeRegion"),
      sql<boolean>`count(${eb.table(
        "feScolaire"
      )}.*) over (partition by ${eb.ref("feScolaire.UAI")}) > 0`.as(
        "isScolaire"
      ),
      sql<boolean>`count(${eb.table(
        "feApprentissage"
      )}.*) over (partition by ${eb.ref("feApprentissage.UAI")}) > 0`.as(
        "isApprentissage"
      ),
      eb.ref("etablissement.secteur").as("secteur"),
    ])
    .distinct()
    .executeTakeFirst()
    .then(cleanNull);
