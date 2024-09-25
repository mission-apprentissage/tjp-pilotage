import { sql } from "kysely";

import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { genericOnConstatRentree } from "../../../utils/onConstatDeRentree";
import { Filters } from "../getRepartitionPilotageIntentions.usecase";
import { genericOnDemandes } from "./getDemandesBaseQuery";

export const getDomainesQuery = async ({ filters }: { filters: Filters }) => {
  return kdb
    .selectFrom("nsf")
    .leftJoin(
      (eb) =>
        genericOnDemandes(filters)(eb)
          .select((eb) => [eb.ref("dataFormation.codeNsf").as("codeNsf")])
          .groupBy(["dataFormation.codeNsf"])
          .as("demandes"),
      (join) => join.onRef("demandes.codeNsf", "=", "nsf.codeNsf")
    )
    .leftJoin(
      () =>
        genericOnConstatRentree(filters)()
          .select((eb) => [
            eb.ref("dataFormation.codeNsf").as("codeNsf"),
            sql<number>`SUM(${eb.ref("constatRentree.effectif")})`.as(
              "effectif"
            ),
          ])
          .groupBy(["dataFormation.codeNsf"])
          .as("effectifs"),
      (join) => join.onRef("effectifs.codeNsf", "=", "nsf.codeNsf")
    )
    .select((eb) => [
      sql<string>`COALESCE(${eb.ref("nsf.codeNsf")}, '')`.as("code"),
      sql<string>`COALESCE(${eb.ref("nsf.libelleNsf")}, '')`.as("libelle"),
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
    .where((w) =>
      w.or([
        w("effectifs.effectif", "is not", null),
        w("demandes.codeNsf", "is not", null),
      ])
    )
    .execute()
    .then(cleanNull);
};
