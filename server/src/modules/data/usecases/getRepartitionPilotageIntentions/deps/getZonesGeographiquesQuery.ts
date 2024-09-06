import { sql } from "kysely";

import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { Filters } from "../getRepartitionPilotageIntentions.usecase";
import { getDemandesBaseQuery } from "./getDemandesBaseQuery";
import { getEffectifsParCampagneQuery } from "./getEffectifsParCampagneQuery";

export const getZonesGeographiquesQuery = async ({
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
              "effectifsParCampagne.libelleRegion",
              "effectifsParCampagne.codeRegion",
              sql<number>`SUM(${eb.ref(
                "effectifsParCampagne.denominateur"
              )})`.as("denominateur"),
            ])
            .groupBy([
              "effectifsParCampagne.annee",
              "effectifsParCampagne.libelleRegion",
              "effectifsParCampagne.codeRegion",
            ])
            .as("effectifs"),
          (join) =>
            join
              .onRef("demandes.annee", "=", "effectifs.annee")
              .onRef("demandes.codeRegion", "=", "effectifs.codeRegion")
        )
        .select((eb) => [
          "effectifs.denominateur as placesEffectivementOccupees",
          "demandes.annee",
          "demandes.rentreeScolaire",
          "demandes.libelleRegion",
          "demandes.codeRegion",
          sql<number>`SUM(
            ${eb.ref("demandes.placesOuvertesScolaire")} + ${eb.ref(
              "demandes.placesOuvertesApprentissage"
            )}
          )`.as("placesOuvertes"),
          sql<number>`SUM(
            CASE WHEN ${eb.ref("demandes.annee")} = '2023'
            THEN ${eb.ref("demandes.placesFermeesScolaire")}
            ELSE
              ${eb.ref("demandes.placesFermeesScolaire")} +
              ${eb.ref("demandes.placesFermeesApprentissage")}
            END
          )`.as("placesFermees"),
          sql<number>`SUM(
            CASE WHEN ${eb.ref("demandes.typeDemande")} = 'coloration'
            THEN COALESCE(${eb.ref("demandes.placesColoreesScolaire")}, 0) +
              COALESCE(${eb.ref("demandes.placesColoreesApprentissage")}, 0)
            ELSE 0
            END
          )`.as("placesColorees"),
        ])
        .groupBy([
          "demandes.annee",
          "demandes.rentreeScolaire",
          "demandes.libelleRegion",
          "demandes.codeRegion",
          "placesEffectivementOccupees",
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
        .where(
          sql<boolean>`"demandes"."annee"::int = "demandes"."rentreeScolaire"::int - 1`
        )
        .as("demandesAvecEffectif")
    )
    .selectAll("demandesAvecEffectif")
    .select((eb) => [
      sql<number>`COALESCE(${eb.ref(
        "demandesAvecEffectif.placesEffectivementOccupees"
      )},0)`.as("placesEffectivementOccupees"),
      sql<string>`COALESCE(${eb.ref(
        "demandesAvecEffectif.codeRegion"
      )}, '')`.as("code"),
      sql<string>`COALESCE(${eb.ref(
        "demandesAvecEffectif.libelleRegion"
      )}, '')`.as("libelle"),
      sql<number>`
        ${eb.ref("placesOuvertes")} +
        ${eb.ref("placesFermees")} +
        ${eb.ref("placesColorees")}
      `.as("placesTransformees"),
      sql<number>`
        ${eb.ref("placesOuvertes")} -
        ${eb.ref("placesFermees")}
      `.as("solde"),
      sql<number>`
        (
          ${eb.ref("placesOuvertes")} +
          ${eb.ref("placesFermees")} +
          ${eb.ref("placesColorees")}
        ) /
        ${eb.ref("demandesAvecEffectif.placesEffectivementOccupees")}
      `.as("tauxTransformation"),
      sql<number>`
        ${eb.ref("placesOuvertes")} /
        ${eb.ref("demandesAvecEffectif.placesEffectivementOccupees")}
      `.as("tauxTransformationOuvertures"),
      sql<number>`
        ${eb.ref("placesFermees")} /
        ${eb.ref("demandesAvecEffectif.placesEffectivementOccupees")}
      `.as("tauxTransformationFermetures"),
      sql<number>`
        ${eb.ref("placesColorees")} /
        ${eb.ref("demandesAvecEffectif.placesEffectivementOccupees")}
      `.as("tauxTransformationColorations"),
    ])
    .execute()
    .then(cleanNull);
};
