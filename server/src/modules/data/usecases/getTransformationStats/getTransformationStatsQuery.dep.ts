import { AnyColumnWithTable, ExpressionBuilder, sql } from "kysely";
import { jsonBuildObject } from "kysely/helpers/postgres";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";
import { cleanNull } from "../../../../utils/noNull";

const selectPlacesTransformees =
  (eb: ExpressionBuilder<DB, "demande" | "dataEtablissement">) =>
  (partitionBy?: AnyColumnWithTable<DB, "dataEtablissement">) =>
    eb.fn
      .sum<number>(
        sql`ABS(
        ${eb.ref("demande.capaciteScolaire")}
        -${eb.ref("demande.capaciteScolaireActuelle")})
        +GREATEST(${eb.ref("demande.capaciteApprentissage")}
        -${eb.ref("demande.capaciteApprentissageActuelle")}, 0)`
      )
      .over((ob) => (partitionBy ? ob.partitionBy(partitionBy) : ob));

const selectDifferenceScolaire =
  (eb: ExpressionBuilder<DB, "demande" | "dataEtablissement">) =>
  (partitionBy?: AnyColumnWithTable<DB, "dataEtablissement">) =>
    sql<number>`
${eb.fn
  .sum("demande.capaciteScolaire")
  .over((ob) => (partitionBy ? ob.partitionBy(partitionBy) : ob))}
-
${eb.fn
  .sum("demande.capaciteScolaireActuelle")
  .over((ob) => (partitionBy ? ob.partitionBy(partitionBy) : ob))}`;

const selectDifferenceApprentissage =
  (eb: ExpressionBuilder<DB, "demande" | "dataEtablissement">) =>
  (partitionBy?: AnyColumnWithTable<DB, "dataEtablissement">) =>
    sql<number>`
${eb.fn
  .sum("demande.capaciteApprentissage")
  .over((ob) => (partitionBy ? ob.partitionBy(partitionBy) : ob))}
-
${eb.fn
  .sum("demande.capaciteApprentissageActuelle")
  .over((ob) => (partitionBy ? ob.partitionBy(partitionBy) : ob))}`;

const selectPlacesOuvertesScolaire =
  (eb: ExpressionBuilder<DB, "demande" | "dataEtablissement">) =>
  (partitionBy?: AnyColumnWithTable<DB, "dataEtablissement">) =>
    eb.fn
      .sum<number>(
        sql`GREATEST(${eb.ref("demande.capaciteScolaire")}
        - ${eb.ref("demande.capaciteScolaireActuelle")}, 0)`
      )
      .over((ob) => (partitionBy ? ob.partitionBy(partitionBy) : ob));

const selectPlacesFermeesScolaire =
  (eb: ExpressionBuilder<DB, "demande" | "dataEtablissement">) =>
  (partitionBy?: AnyColumnWithTable<DB, "dataEtablissement">) =>
    eb.fn
      .sum<number>(
        sql`GREATEST(${eb.ref("demande.capaciteScolaireActuelle")}
      - ${eb.ref("demande.capaciteScolaire")}, 0)`
      )
      .over((ob) => (partitionBy ? ob.partitionBy(partitionBy) : ob));

const selectPlacesOuvertesApprentissage =
  (eb: ExpressionBuilder<DB, "demande" | "dataEtablissement">) =>
  (partitionBy?: AnyColumnWithTable<DB, "dataEtablissement">) =>
    eb.fn
      .sum<number>(
        sql`GREATEST(${eb.ref("demande.capaciteApprentissage")}
      - ${eb.ref("demande.capaciteApprentissageActuelle")}, 0)`
      )
      .over((ob) => (partitionBy ? ob.partitionBy(partitionBy) : ob));

const selectPlacesFermeesApprentissage =
  (eb: ExpressionBuilder<DB, "demande" | "dataEtablissement">) =>
  (partitionBy?: AnyColumnWithTable<DB, "dataEtablissement">) =>
    eb.fn
      .sum<number>(
        sql`GREATEST(${eb.ref("demande.capaciteApprentissageActuelle")}
    - ${eb.ref("demande.capaciteApprentissage")}, 0)`
      )
      .over((ob) => (partitionBy ? ob.partitionBy(partitionBy) : ob));

const selectNbDemandes =
  (eb: ExpressionBuilder<DB, "demande" | "dataEtablissement">) =>
  (partitionBy?: AnyColumnWithTable<DB, "dataEtablissement">) =>
    eb.fn
      .count<number>("demande.id")
      .over((ob) => (partitionBy ? ob.partitionBy(partitionBy) : ob));

export const getTransformationStatsQuery = ({
  rentreeScolaire,
  status,
}: {
  rentreeScolaire: number;
  status?: "draft" | "submitted";
}) =>
  kdb
    .selectFrom("demande")
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .leftJoin("region", "region.codeRegion", "dataEtablissement.codeRegion")
    .leftJoin(
      "academie",
      "academie.codeAcademie",
      "dataEtablissement.codeAcademie"
    )
    .leftJoin(
      "departement",
      "departement.codeDepartement",
      "dataEtablissement.codeDepartement"
    )
    .distinctOn(["dataEtablissement.codeDepartement"])
    .select((eb) => [
      selectNbDemandes(eb)().as("nbDemandesNational"),
      selectPlacesTransformees(eb)().as("transformeNational"),
      selectDifferenceScolaire(eb)().as("differenceScolaireNational"),
      jsonBuildObject({
        countDemande: selectNbDemandes(eb)(),
        transformes: selectPlacesTransformees(eb)(),
        differenceCapaciteScolaire: selectDifferenceScolaire(eb)(),
        differenceCapaciteApprentissage: selectDifferenceApprentissage(eb)(),
        placesOuvertesScolaire: selectPlacesOuvertesScolaire(eb)(),
        placesFermeesScolaire: selectPlacesFermeesScolaire(eb)(),
        placesOuvertesApprentissage: selectPlacesOuvertesApprentissage(eb)(),
        placesFermeesApprentissage: selectPlacesFermeesApprentissage(eb)(),
      }).as("national"),
      jsonBuildObject({
        countDemande: selectNbDemandes(eb)("dataEtablissement.codeRegion"),
        transforme: selectPlacesTransformees(eb)(
          "dataEtablissement.codeRegion"
        ),
        differenceCapaciteScolaire: selectDifferenceScolaire(eb)(
          "dataEtablissement.codeRegion"
        ),
        differenceCapaciteApprentissage: selectDifferenceApprentissage(eb)(
          "dataEtablissement.codeRegion"
        ),
        placesOuvertesScolaire: selectPlacesOuvertesScolaire(eb)(
          "dataEtablissement.codeRegion"
        ),
        placesFermeesScolaire: selectPlacesFermeesScolaire(eb)(
          "dataEtablissement.codeRegion"
        ),
        placesOuvertesApprentissage: selectPlacesOuvertesApprentissage(eb)(
          "dataEtablissement.codeRegion"
        ),
        placesFermeesApprentissage: selectPlacesFermeesApprentissage(eb)(
          "dataEtablissement.codeRegion"
        ),
        codeRegion: eb.ref("dataEtablissement.codeRegion"),
        libelle: eb.ref("region.libelleRegion"),
      }).as("region"),
      jsonBuildObject({
        countDemande: selectNbDemandes(eb)("dataEtablissement.codeAcademie"),
        transforme: selectPlacesTransformees(eb)(
          "dataEtablissement.codeAcademie"
        ),
        differenceCapaciteScolaire: selectDifferenceScolaire(eb)(
          "dataEtablissement.codeAcademie"
        ),
        differenceCapaciteApprentissage: selectDifferenceApprentissage(eb)(
          "dataEtablissement.codeAcademie"
        ),
        placesOuvertesScolaire: selectPlacesOuvertesScolaire(eb)(
          "dataEtablissement.codeAcademie"
        ),
        placesFermeesScolaire: selectPlacesFermeesScolaire(eb)(
          "dataEtablissement.codeAcademie"
        ),
        placesOuvertesApprentissage: selectPlacesOuvertesApprentissage(eb)(
          "dataEtablissement.codeAcademie"
        ),
        placesFermeesApprentissage: selectPlacesFermeesApprentissage(eb)(
          "dataEtablissement.codeAcademie"
        ),
        codeAcademie: eb.ref("academie.codeAcademie"),
        libelle: eb.ref("academie.libelle"),
      }).as("academie"),
      jsonBuildObject({
        countDemande: selectNbDemandes(eb)("dataEtablissement.codeDepartement"),
        transforme: selectPlacesTransformees(eb)(
          "dataEtablissement.codeDepartement"
        ),
        differenceCapaciteScolaire: selectDifferenceScolaire(eb)(
          "dataEtablissement.codeDepartement"
        ),
        differenceCapaciteApprentissage: selectDifferenceApprentissage(eb)(
          "dataEtablissement.codeDepartement"
        ),
        placesOuvertesScolaire: selectPlacesOuvertesScolaire(eb)(
          "dataEtablissement.codeDepartement"
        ),
        placesFermeesScolaire: selectPlacesFermeesScolaire(eb)(
          "dataEtablissement.codeDepartement"
        ),
        placesOuvertesApprentissage: selectPlacesOuvertesApprentissage(eb)(
          "dataEtablissement.codeDepartement"
        ),
        placesFermeesApprentissage: selectPlacesFermeesApprentissage(eb)(
          "dataEtablissement.codeDepartement"
        ),
        codeDepartement: eb.ref("dataEtablissement.codeDepartement"),
        libelle: eb.ref("departement.libelle"),
      }).as("departement"),
    ])
    .where("demande.rentreeScolaire", "=", rentreeScolaire)
    .$call((q) => {
      if (!status) return q;
      return q.where("demande.status", "=", status);
    })
    .execute()
    .then(cleanNull);

export const getFiltersQuery = async () => {
  const base = kdb
    .selectFrom("demande")
    .innerJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .innerJoin("region", "region.codeRegion", "dataEtablissement.codeRegion")
    .innerJoin(
      "academie",
      "academie.codeAcademie",
      "dataEtablissement.codeAcademie"
    )
    .innerJoin(
      "departement",
      "departement.codeDepartement",
      "dataEtablissement.codeDepartement"
    )
    .distinct()
    .$castTo<{ label: string; value: string }>()
    .orderBy("label", "asc");

  const regions = await base
    .select(["region.codeRegion as value", "region.libelleRegion as label"])
    .where("region.codeRegion", "is not", null)
    .execute();

  const academies = await base
    .select(["academie.codeAcademie as value", "academie.libelle as label"])
    .where("academie.codeAcademie", "is not", null)
    .execute();

  const departements = await base
    .select([
      "departement.codeDepartement as value",
      "departement.libelle as label",
    ])
    .where("departement.codeDepartement", "is not", null)
    .execute();

  return {
    regions: regions.map(cleanNull),
    academies: academies.map(cleanNull),
    departements: departements.map(cleanNull),
  };
};
