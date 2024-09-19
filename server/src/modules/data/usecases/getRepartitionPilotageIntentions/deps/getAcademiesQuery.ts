import { sql } from "kysely";

import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { Filters } from "../getRepartitionPilotageIntentions.usecase";
import { getDemandesBaseQuery } from "./getDemandesBaseQuery";
import { getEffectifsParCampagneQuery } from "./getEffectifsParCampagneQuery";

export const getAcademiesQuery = async ({ filters }: { filters: Filters }) => {
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
              "effectifsParCampagne.codeAcademie",
              sql<number>`SUM(${eb.ref(
                "effectifsParCampagne.denominateur"
              )})`.as("denominateur"),
            ])
            .groupBy([
              "effectifsParCampagne.annee",
              "effectifsParCampagne.codeAcademie",
            ])
            .as("effectifs"),
          (join) =>
            join
              .onRef("demandes.annee", "=", "effectifs.annee")
              .onRef("demandes.codeAcademie", "=", "effectifs.codeAcademie")
        )
        .select((eb) => [
          "effectifs.denominateur as effectif",
          "demandes.annee",
          "demandes.libelleAcademie",
          "demandes.codeAcademie",
          eb.fn.sum<number>("demandes.placesOuvertes").as("placesOuvertes"),
          eb.fn.sum<number>("demandes.placesFermees").as("placesFermees"),
          eb.fn.sum<number>("demandes.placesColorees").as("placesColorees"),
          eb.fn
            .sum<number>("demandes.placesTransformees")
            .as("placesTransformees"),
        ])
        .groupBy([
          "demandes.annee",
          "demandes.libelleAcademie",
          "demandes.codeAcademie",
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
        "demandesAvecEffectif.codeAcademie"
      )}, '')`.as("code"),
      sql<string>`COALESCE(${eb.ref(
        "demandesAvecEffectif.libelleAcademie"
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
