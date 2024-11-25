import type { ExpressionBuilder } from "kysely";
import { sql } from "kysely";
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

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
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) => sql<number>`
  ${countPlacesOuvertesScolaire(eb)} +
  ${countPlacesFermeesScolaire(eb)}
`;

export const countPlacesNonColoreesTransformeesApprentissage = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) => sql<number>`
  ${countPlacesOuvertesApprentissage(eb)} +
  ${countPlacesFermeesApprentissage(eb)}
`;

export const countPlacesNonColoreesTransformees = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) => sql<number>`
      ${countPlacesNonColoreesTransformeesScolaire(eb)} +
      ${countPlacesNonColoreesTransformeesApprentissage(eb)}
    `;

// PLACES COLORÉES TRANSFORMÉES

export const countPlacesColoreesTransformeesScolaire = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) => sql<number>`
    ${countPlacesColoreesOuvertesScolaire(eb)} +
    ${countPlacesColoreesFermeesScolaire(eb)}
    `;

export const countPlacesColoreesTransformeesScolaireQ4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) => eb.case().when(inQ4(eb)).then(countPlacesColoreesTransformeesScolaire(eb)).else(0).end();

export const countPlacesColoreesTransformeesApprentissage = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) => sql<number>`
      ${countPlacesColoreesOuvertesApprentissage(eb)} +
      ${countPlacesColoreesFermeesApprentissage(eb)}
    `;

export const countPlacesColoreesTransformeesApprentissageQ4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) => eb.case().when(inQ4(eb)).then(countPlacesColoreesTransformeesApprentissage(eb)).else(0).end();

export const countPlacesColoreesTransformees = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) => sql<number>`
    ${countPlacesColoreesOuvertesScolaire(eb)} +
    ${countPlacesColoreesOuvertesApprentissage(eb)}
  `;

export const countPlacesColoreesTransformeesQ4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) => eb.case().when(inQ4(eb)).then(countPlacesColoreesTransformees(eb)).else(0).end();

// PLACES TRANSFORMÉES COLORÉES ET NON COLORÉES

export const countPlacesTransformeesScolaire = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  eb
    .case()
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

export const countPlacesTransformeesApprentissage = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  eb
    .case()
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

export const countPlacesTransformees = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) => sql<number>`
    ${countPlacesNonColoreesTransformees(eb)} +
    ${countPlacesColoreesTransformees(eb)}
  `;

// En 2023, les places transformées sont les places ouvertes + les places fermées scolaires
// les places colorées ne sont pas comptabilisées tout comme les places fermées en apprentissage
const countPlacesTransformeesCampagne2023 = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  sql<number>`
    ${countPlacesOuvertes(eb)} +
    ${countPlacesFermeesScolaire(eb)}
  `;

// En 2024, les places transformées sont les places ouvertes et fermées + les places colorées ouvertes
// les places colorées fermées ne sont pas comptabilisées
const countPlacesTransformeesCampagne2024 = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) => sql<number>`
    ${countPlacesNonColoreesTransformees(eb)} +
    ${countPlacesColoreesOuvertes(eb)}
  `;

export const countPlacesTransformeesParCampagne = ({ eb }: { eb: ExpressionBuilder<DB, "demande" | "campagne"> }) =>
  eb
    .case()
    .when("campagne.annee", "=", "2023")
    .then(countPlacesTransformeesCampagne2023(eb))
    .when("campagne.annee", "=", "2024")
    .then(countPlacesTransformeesCampagne2024(eb))
    .else(countPlacesTransformees(eb))
    .end();

export const getTauxTransformation = ({
  demandeAlias,
  effectifAlias,
  campagne = CURRENT_ANNEE_CAMPAGNE,
}: {
  demandeAlias: string;
  effectifAlias: string;
  campagne?: string;
}) => {
  switch (campagne) {
    case "2023":
      return sql<number>`
        ${sql.table(demandeAlias)}.placesTransformees::INTEGER /
        ${sql.table(effectifAlias)}.effectif::INTEGER
      `;
    default:
      return sql<number>`
        ${sql.table(demandeAlias)}.placesTransformeesCampagne2023::INTEGER /
        ${sql.table(effectifAlias)}.effectif::FLOAT
      `;
  }
};
