import { sql } from "kysely";

import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { Filters } from "../getRepartitionPilotageIntentions.usecase";
import { getDemandesBaseQuery } from "./getDemandesBaseQuery";
import { getEffectifsParCampagneQuery } from "./getEffectifsParCampagneQuery";

export const getDepartementsQuery = async ({
  filters,
}: {
  filters: Filters;
}) => {
  const demandesBaseQuery = getDemandesBaseQuery(filters);
  const effectifsParCampagne = getEffectifsParCampagneQuery(filters);

  return kdb
    .selectFrom(
      kdb
        .selectFrom(demandesBaseQuery.as("demandes"))
        .leftJoin(
          kdb
            .selectFrom(effectifsParCampagne.as("effectifsParCampagne"))
            .select((eb) => [
              "effectifsParCampagne.annee",
              "effectifsParCampagne.codeDepartement",
              sql<number>`SUM(${eb.ref(
                "effectifsParCampagne.denominateur"
              )})`.as("denominateur"),
            ])
            .groupBy([
              "effectifsParCampagne.annee",
              "effectifsParCampagne.codeDepartement",
            ])
            .as("effectifs"),
          (join) =>
            join
              .onRef("demandes.annee", "=", "effectifs.annee")
              .onRef(
                "demandes.codeDepartement",
                "=",
                "effectifs.codeDepartement"
              )
        )
        .select((eb) => [
          "effectifs.denominateur as effectif",
          "demandes.annee",
          "demandes.libelleDepartement",
          "demandes.codeDepartement",
          eb.fn.sum<number>("demandes.placesOuvertes").as("placesOuvertes"),
          eb.fn.sum<number>("demandes.placesFermees").as("placesFermees"),
          eb.fn.sum<number>("demandes.placesColorees").as("placesColorees"),
          eb.fn
            .sum<number>("demandes.placesTransformees")
            .as("placesTransformees"),
        ])
        .groupBy([
          "demandes.annee",
          "demandes.libelleDepartement",
          "demandes.codeDepartement",
          "effectif",
        ])
        .$call((eb) => {
          if (filters.campagne)
            return eb.where("demandes.annee", "=", filters.campagne);
          return eb;
        })
        .$call((eb) => {
          if (filters.rentreeScolaire)
            return eb.where(
              "demandes.rentreeScolaire",
              "in",
              filters.rentreeScolaire.map((rs) => Number.parseInt(rs))
            );
          return eb;
        })
        .as("demandesAvecEffectif")
    )
    .selectAll("demandesAvecEffectif")
    .select((eb) => [
      sql<number>`COALESCE(${eb.ref("demandesAvecEffectif.effectif")},0)`.as(
        "effectif"
      ),
      sql<string>`COALESCE(${eb.ref(
        "demandesAvecEffectif.codeDepartement"
      )}, '')`.as("code"),
      sql<string>`COALESCE(${eb.ref(
        "demandesAvecEffectif.libelleDepartement"
      )}, '')`.as("libelle"),
      sql<number>`
        ${eb.ref("placesOuvertes")} -
        ${eb.ref("placesFermees")}
      `.as("solde"),
      sql<number>`
        ${eb.ref("demandesAvecEffectif.placesTransformees")} /
        ${eb.ref("demandesAvecEffectif.effectif")}
      `.as("tauxTransformation"),
      sql<number>`
        ${eb.ref("placesOuvertes")} /
        ${eb.ref("demandesAvecEffectif.effectif")}
      `.as("tauxTransformationOuvertures"),
      sql<number>`
        ${eb.ref("placesFermees")} /
        ${eb.ref("demandesAvecEffectif.effectif")}
      `.as("tauxTransformationFermetures"),
      sql<number>`
        ${eb.ref("placesColorees")} /
        ${eb.ref("demandesAvecEffectif.effectif")}
      `.as("tauxTransformationColorations"),
    ])
    .execute()
    .then(cleanNull);
};
