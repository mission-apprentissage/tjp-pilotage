import { sql } from "kysely";

import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { isInPerimetreIJDepartement } from "../../../utils/isInPerimetreIJ";
import { genericOnConstatRentree } from "../../../utils/onConstatDeRentree";
import { Filters } from "../getRepartitionPilotageIntentions.usecase";
import { genericOnDemandes } from "./getDemandesBaseQuery";

export const getDepartementsQuery = async ({
  filters,
}: {
  filters: Filters;
}) => {
  return kdb
    .selectFrom("departement")
    .leftJoin(
      (eb) =>
        genericOnDemandes(filters)(eb)
          .select((eb) => [
            eb.ref("dataEtablissement.codeDepartement").as("codeDepartement"),
          ])
          .groupBy(["dataEtablissement.codeDepartement"])
          .as("demandes"),
      (join) =>
        join.onRef(
          "demandes.codeDepartement",
          "=",
          "departement.codeDepartement"
        )
    )
    .leftJoin(
      () =>
        genericOnConstatRentree(filters)()
          .select((eb) => [
            eb.ref("dataEtablissement.codeDepartement").as("codeDepartement"),
            sql<number>`SUM(${eb.ref("constatRentree.effectif")})`.as(
              "effectif"
            ),
          ])
          .groupBy(["dataEtablissement.codeDepartement"])
          .as("effectifs"),
      (join) =>
        join.onRef(
          "effectifs.codeDepartement",
          "=",
          "departement.codeDepartement"
        )
    )
    .select((eb) => [
      sql<string>`COALESCE(${eb.ref("departement.codeDepartement")}, '')`.as(
        "code"
      ),
      sql<string>`COALESCE(${eb.ref("departement.libelleDepartement")}, '')`.as(
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
    .where(isInPerimetreIJDepartement)
    .execute()
    .then(cleanNull);
};
