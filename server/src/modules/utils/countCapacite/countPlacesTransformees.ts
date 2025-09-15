import type { ExpressionBuilder } from "kysely";
import { sql } from "kysely";

import type { DB } from "@/db/db";

import {
  countDifferenceCapaciteApprentissage,
  countDifferenceCapaciteApprentissageColoree,
  countDifferenceCapaciteScolaire,
  countDifferenceCapaciteScolaireColoree,
} from "./countDifferenceCapacite";
import {
  countPlacesColoreesFermeesApprentissage,
  countPlacesColoreesFermeesScolaire,
  countPlacesColoreesOuvertes,
  countPlacesColoreesOuvertesApprentissage,
  countPlacesColoreesOuvertesScolaire,
} from "./countPlacesColorees";
import { countPlacesFermeesApprentissage, countPlacesFermeesScolaire } from "./countPlacesFermees";
import {
  countPlacesOuvertes,
  countPlacesOuvertesApprentissage,
  countPlacesOuvertesScolaire,
} from "./countPlacesOuvertes";
import { inQ4 } from "./utils";

// PLACES TRANSFORMÉES

// PLACES TRANSFORMÉES NON COLORÉES

export const countPlacesNonColoreesTransformeesScolaire = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande">;
  avecColoration?: boolean
}) => sql<number>`
  ${countPlacesOuvertesScolaire({eb, avecColoration})} +
  ${countPlacesFermeesScolaire({eb, avecColoration})}
`;

export const countPlacesNonColoreesTransformeesApprentissage = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande">;
  avecColoration?: boolean
}) => sql<number>`
  ${countPlacesOuvertesApprentissage({eb, avecColoration})} +
  ${countPlacesFermeesApprentissage({eb, avecColoration})}
`;

export const countPlacesNonColoreesTransformees = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande">;
  avecColoration?: boolean
}) => sql<number>`
  ${countPlacesNonColoreesTransformeesScolaire({eb, avecColoration})} +
  ${countPlacesNonColoreesTransformeesApprentissage({eb, avecColoration})}
`;

// PLACES COLORÉES TRANSFORMÉES

export const countPlacesColoreesTransformeesScolaire = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande">;
  avecColoration?: boolean
}) => sql<number>`
    ${countPlacesColoreesOuvertesScolaire({eb, avecColoration})} +
    ${countPlacesColoreesFermeesScolaire({eb, avecColoration})}
    `;

export const countPlacesColoreesTransformeesScolaireQ4 = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
  avecColoration?: boolean
}) => eb.case().when(inQ4(eb)).then(countPlacesColoreesTransformeesScolaire({eb, avecColoration})).else(0).end();

export const countPlacesColoreesTransformeesApprentissage = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande">;
  avecColoration?: boolean
}) => sql<number>`
      ${countPlacesColoreesOuvertesApprentissage({eb, avecColoration})} +
      ${countPlacesColoreesFermeesApprentissage({eb, avecColoration})}
    `;

export const countPlacesColoreesTransformeesApprentissageQ4 = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
  avecColoration?: boolean
}) => eb.case().when(inQ4(eb)).then(countPlacesColoreesTransformeesApprentissage({eb, avecColoration})).else(0).end();

export const countPlacesColoreesTransformees = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande">;
  avecColoration?: boolean
 }) => sql<number>`
    ${countPlacesColoreesOuvertesScolaire({eb, avecColoration})} +
    ${countPlacesColoreesOuvertesApprentissage({eb, avecColoration})}
  `;

export const countPlacesColoreesTransformeesQ4 = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
  avecColoration?: boolean
}) => eb.case().when(inQ4(eb)).then(countPlacesColoreesTransformees({eb, avecColoration})).else(0).end();

// PLACES TRANSFORMÉES COLORÉES ET NON COLORÉES

export const countPlacesTransformeesScolaire = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande">;
  avecColoration?: boolean
 }) =>
  eb
    .case()
    .when(eb.val(!avecColoration))
    .then(countPlacesNonColoreesTransformeesScolaire(eb))
    // si diminution des places globales + diminution des places colorées => max de diminution (aucun cas en prod)
    .when(
      eb.and([
        sql<boolean>`${countDifferenceCapaciteScolaire(eb)} < 0`,
        sql<boolean>`${countDifferenceCapaciteScolaireColoree(eb)} < 0`,
      ])
    )
    .then(
      sql<number>`GREATEST(
        ABS(${countDifferenceCapaciteScolaire(eb)}),
        ABS(${countDifferenceCapaciteScolaireColoree(eb)})
      )`
    )
    // si augmentation des places globales + diminution des places colorées => somme des 2 transfo  (aucun cas en prod)
    .when(
      eb.and([
        sql<boolean>`${countDifferenceCapaciteScolaire(eb)} >= 0`,
        sql<boolean>`${countDifferenceCapaciteScolaireColoree(eb)} < 0`,
      ])
    )
    .then(
      sql<number>`
        ABS(${countDifferenceCapaciteScolaire(eb)}) +
        ABS(${countDifferenceCapaciteScolaireColoree(eb)})
      `
    )
    // si diminution des places globales + augmentation des places colorées => somme des 2 transfo
    .when(
      eb.and([
        sql<boolean>`${countDifferenceCapaciteScolaire(eb)} < 0`,
        sql<boolean>`${countDifferenceCapaciteScolaireColoree(eb)} >= 0`,
      ])
    )
    .then(
      sql<number>`
        ABS(${countDifferenceCapaciteScolaire(eb)}) +
        ABS(${countDifferenceCapaciteScolaireColoree(eb)})
      `
    )
    // si augmentation des places globales + augmentation des places colorées => max de augmentation
    .when(
      eb.and([
        sql<boolean>`${countDifferenceCapaciteScolaire(eb)} >= 0`,
        sql<boolean>`${countDifferenceCapaciteScolaireColoree(eb)} >= 0`,
      ])
    )
    .then(
      sql<number>`GREATEST(
        ABS(${countDifferenceCapaciteScolaire(eb)}),
        ABS(${countDifferenceCapaciteScolaireColoree(eb)})
      )`
    )
    .end();

export const countPlacesTransformeesApprentissage = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande">;
  avecColoration?: boolean
 }) =>
  eb
    .case()
    .when(eb.val(!avecColoration))
    .then(countPlacesNonColoreesTransformeesApprentissage(eb))
    // si diminution des places globales + diminution des places colorées => max de diminution (aucun cas en prod)
    .when(
      eb.and([
        sql<boolean>`${countDifferenceCapaciteApprentissage(eb)} < 0`,
        sql<boolean>`${countDifferenceCapaciteApprentissageColoree(eb)} < 0`,
      ])
    )
    .then(
      sql<number>`GREATEST(
        ABS(${countDifferenceCapaciteApprentissage(eb)}),
        ABS(${countDifferenceCapaciteApprentissageColoree(eb)})
      )`
    )
    // si augmentation des places globales + diminution des places colorées => somme des 2 transfo  (aucun cas en prod)
    .when(
      eb.and([
        sql<boolean>`${countDifferenceCapaciteApprentissage(eb)} >= 0`,
        sql<boolean>`${countDifferenceCapaciteApprentissageColoree(eb)} < 0`,
      ])
    )
    .then(
      sql<number>`
        ABS(${countDifferenceCapaciteApprentissage(eb)}) +
        ABS(${countDifferenceCapaciteApprentissageColoree(eb)})
      `
    )
    // si diminution des places globales + augmentation des places colorées => somme des 2 transfo
    .when(
      eb.and([
        sql<boolean>`${countDifferenceCapaciteApprentissage(eb)} < 0`,
        sql<boolean>`${countDifferenceCapaciteApprentissageColoree(eb)} >= 0`,
      ])
    )
    .then(
      sql<number>`
        ABS(${countDifferenceCapaciteApprentissage(eb)}) +
        ABS(${countDifferenceCapaciteApprentissageColoree(eb)})
      `
    )
    // si augmentation des places globales + augmentation des places colorées => max de augmentation
    .when(
      eb.and([
        sql<boolean>`${countDifferenceCapaciteApprentissage(eb)} >= 0`,
        sql<boolean>`${countDifferenceCapaciteApprentissageColoree(eb)} >= 0`,
      ])
    )
    .then(
      sql<number>`GREATEST(
        ABS(${countDifferenceCapaciteApprentissage(eb)}),
        ABS(${countDifferenceCapaciteApprentissageColoree(eb)})
      )`
    )
    .end();

export const countPlacesTransformees = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande">;
  avecColoration?: boolean
}) =>
  eb
    .case()
    .when(eb.val(!avecColoration))
    .then(countPlacesNonColoreesTransformees(eb))
    .else(
      sql<number>`
        ${countPlacesTransformeesScolaire({eb})} +
        ${countPlacesTransformeesApprentissage({eb})}
      `
    )
    .end();

// En 2023, les places transformées sont les places ouvertes + les places fermées scolaires
// les places colorées ne sont pas comptabilisées tout comme les places fermées en apprentissage
const countPlacesTransformeesCampagne2023 = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande">;
  avecColoration?: boolean
 }) =>
  sql<number>`
    ${countPlacesOuvertes({eb, avecColoration})} +
    ${countPlacesFermeesScolaire({eb, avecColoration})}
  `;

// En 2024, les places transformées sont les places ouvertes et fermées + les places colorées ouvertes
// les places colorées fermées ne sont pas comptabilisées
const countPlacesTransformeesCampagne2024 = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande">;
  avecColoration?: boolean
 }) => sql<number>`
    ${countPlacesNonColoreesTransformees({eb, avecColoration})} +
    ${countPlacesColoreesOuvertes({eb, avecColoration})}
  `;

export const countPlacesTransformeesParCampagne = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne">;
  avecColoration?: boolean
 }) =>
  eb
    .case()
    .when("campagne.annee", "=", "2023")
    .then(countPlacesTransformeesCampagne2023({eb, avecColoration}))
    .when("campagne.annee", "=", "2024")
    .then(countPlacesTransformeesCampagne2024({eb, avecColoration}))
    .else(countPlacesTransformees({eb, avecColoration}))
    .end();

export const getTauxTransformation = ({
  demandeAlias,
  effectifAlias,
  campagne,
}: {
  demandeAlias: string;
  effectifAlias: string;
  campagne: string;
}) => {
  if(campagne === "2023") return sql<number>`
    ${sql.table(demandeAlias)}.placesTransformeesCampagne2023::INTEGER /
    ${sql.table(effectifAlias)}.effectif::INTEGER
  `;

  return sql<number>`
      ${sql.table(demandeAlias)}.placesTransformees::INTEGER /
      ${sql.table(effectifAlias)}.effectif::FLOAT
    `;
};
