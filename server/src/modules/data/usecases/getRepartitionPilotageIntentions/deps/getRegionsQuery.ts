import { sql } from "kysely";

import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { isInPerimetreIJRegion } from "../../../utils/isInPerimetreIJ";
import { genericOnConstatRentree } from "../../../utils/onConstatDeRentree";
import { Filters } from "../getRepartitionPilotageIntentions.usecase";
import { genericOnDemandes } from "./getDemandesBaseQuery";

export const getRegionsQuery = async ({ filters }: { filters: Filters }) => {
  return kdb
    .selectFrom("region")
    .leftJoin(
      (eb) =>
        genericOnDemandes(filters)(eb)
          .select((eb) => [eb.ref("demande.codeRegion").as("codeRegion")])
          .groupBy(["demande.codeRegion"])
          .as("demandes"),
      (join) => join.onRef("demandes.codeRegion", "=", "region.codeRegion")
    )
    .leftJoin(
      () =>
        genericOnConstatRentree(filters)()
          .select((eb) => [
            eb.ref("dataEtablissement.codeRegion").as("codeRegion"),
            sql<number>`SUM(${eb.ref("constatRentree.effectif")})`.as(
              "effectif"
            ),
          ])
          .groupBy(["dataEtablissement.codeRegion"])
          .as("effectifs"),
      (join) => join.onRef("effectifs.codeRegion", "=", "region.codeRegion")
    )
    .select((eb) => [
      sql<string>`COALESCE(${eb.ref("region.codeRegion")}, '')`.as("code"),
      sql<string>`COALESCE(${eb.ref("region.libelleRegion")}, '')`.as(
        "libelle"
      ),
      eb.fn.coalesce("placesOuvertes", eb.val(0)).as("placesOuvertes"),
      eb.fn.coalesce("placesFermees", eb.val(0)).as("placesFermees"),
      eb.fn.coalesce("placesColorees", eb.val(0)).as("placesColorees"),
      eb.fn.coalesce("placesTransformees", eb.val(0)).as("placesTransformees"),
      eb.fn.coalesce("effectif", eb.val(0)).as("effectif"),
      sql<number>`
              ${eb.fn.coalesce("placesOuvertes", eb.val(0))} -
              ${eb.fn.coalesce("placesFermees", eb.val(0))}
            `.as("solde"),
    ])
    .where(isInPerimetreIJRegion)
    .execute()
    .then(cleanNull);
};
