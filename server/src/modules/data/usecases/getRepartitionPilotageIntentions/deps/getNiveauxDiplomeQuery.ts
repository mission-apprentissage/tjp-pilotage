import { sql } from "kysely";

import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { genericOnConstatRentree } from "../../../utils/onConstatDeRentree";
import { Filters } from "../getRepartitionPilotageIntentions.usecase";
import { genericOnDemandes } from "./getDemandesBaseQuery";

export const getNiveauxDiplomeQuery = async ({
  filters,
}: {
  filters: Filters;
}) => {
  return kdb
    .selectFrom("niveauDiplome")
    .leftJoin(
      (eb) =>
        genericOnDemandes(filters)(eb)
          .select((eb) => [
            eb.ref("dataFormation.codeNiveauDiplome").as("codeNiveauDiplome"),
          ])
          .groupBy(["dataFormation.codeNiveauDiplome"])
          .as("demandes"),
      (join) =>
        join.onRef(
          "demandes.codeNiveauDiplome",
          "=",
          "niveauDiplome.codeNiveauDiplome"
        )
    )
    .leftJoin(
      () =>
        genericOnConstatRentree(filters)()
          .select((eb) => [
            eb.ref("dataFormation.codeNiveauDiplome").as("codeNiveauDiplome"),
            sql<number>`SUM(${eb.ref("constatRentree.effectif")})`.as(
              "effectif"
            ),
          ])
          .groupBy(["dataFormation.codeNiveauDiplome"])
          .as("effectifs"),
      (join) =>
        join.onRef(
          "effectifs.codeNiveauDiplome",
          "=",
          "niveauDiplome.codeNiveauDiplome"
        )
    )
    .select((eb) => [
      sql<string>`COALESCE(${eb.ref(
        "niveauDiplome.codeNiveauDiplome"
      )}, '')`.as("code"),
      sql<string>`COALESCE(${eb.ref(
        "niveauDiplome.libelleNiveauDiplome"
      )}, '')`.as("libelle"),
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
        w("demandes.codeNiveauDiplome", "is not", null),
      ])
    )
    .execute()
    .then(cleanNull);
};
