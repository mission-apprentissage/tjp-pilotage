import type { ExpressionBuilder } from "kysely";
import { sql } from "kysely";
import { FIRST_ANNEE_CAMPAGNE } from "shared";
import { DemandeTypeEnum } from "shared/enum/demandeTypeEnum";

import type { DB } from "@/db/db";

import {
  countDifferenceCapaciteApprentissage,
  countDifferenceCapaciteApprentissageColoree,
  countDifferenceCapaciteScolaire,
  countDifferenceCapaciteScolaireColoree,
} from "./countDifferenceCapacite";
import { inQ1, inQ1Q2, inQ2, inTransitionEcologique } from "./utils";

// PLACES OUVERTES

export const countPlacesOuvertesTransitionEcologique = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne" | "formationView">;
  avecColoration?: boolean;
}) => sql<number>`
    ${countPlacesOuvertesScolaireTransitionEcologique({eb, avecColoration})} +
    ${countPlacesOuvertesApprentissageTransitionEcologique({eb, avecColoration})}
  `;

export const countPlacesOuvertesScolaireTransitionEcologique = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne" | "formationView">;
  avecColoration?: boolean;
}) => eb
  .case()
  .when(inTransitionEcologique(eb))
  .then(countPlacesOuvertesScolaire({eb, avecColoration}))
  .else(0)
  .end();

export const countPlacesOuvertesApprentissageTransitionEcologique = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne" | "formationView">;
  avecColoration?: boolean;
}) => eb
  .case()
  .when(inTransitionEcologique(eb))
  .then(countPlacesOuvertesApprentissage({eb, avecColoration}))
  .else(0)
  .end();

export const countPlacesOuvertes = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne">;
  avecColoration?: boolean;
}) => sql<number>`
    ${countPlacesOuvertesScolaire({eb, avecColoration})} +
    ${countPlacesOuvertesApprentissage({eb, avecColoration})}
  `;

export const countPlacesOuvertesQ1 = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant" | "campagne">;
  avecColoration?: boolean;
}) => eb.case().when(inQ1(eb)).then(countPlacesOuvertes({eb, avecColoration})).else(0).end();

export const countPlacesOuvertesQ2 = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant" | "campagne">;
  avecColoration?: boolean;
}) => eb.case().when(inQ2(eb)).then(countPlacesOuvertes({eb, avecColoration})).else(0).end();

export const countPlacesOuvertesQ1Q2 = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant" | "campagne">;
  avecColoration?: boolean;
}) => eb.case().when(inQ1Q2(eb)).then(countPlacesOuvertes({eb, avecColoration})).else(0).end();

export const countPlacesOuvertesCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction" | "demande">;
}) =>
  sql<number>`
    ${countPlacesOuvertesScolaireCorrection(eb)} +
    ${countPlacesOuvertesApprentissageCorrection(eb)}
  `;

export const countPlacesOuvertesScolaire = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne">;
  avecColoration?: boolean;
}) =>
  eb
    .case()
    // Si la coloration n'est pas comprise dans le calcul du taux de transformation,
    // on renvoit simplement la différence des capacités scolaires si celle-ci est positive
    .when(eb.val(!avecColoration))
    .then(
      eb.case()
        .when(sql<boolean>`${countDifferenceCapaciteScolaire(eb)} >= 0`)
        .then(sql<number>`ABS(${countDifferenceCapaciteScolaire(eb)})`)
        .else(eb.val(0))
        .end()
    )
    .when(
      eb.and([
        eb("campagne.annee", "=", FIRST_ANNEE_CAMPAGNE),
        sql<boolean>`${countDifferenceCapaciteScolaire(eb)} >= 0`,
      ])
    )
    .then(sql<number>`ABS(${countDifferenceCapaciteScolaire(eb)})`)
    .when("typeDemande", "=", DemandeTypeEnum["coloration"])
    .then(eb.val(0))
    // si diminution des places globales + diminution des places colorées => pas d'ouverture de places
    .when(
      eb.and([
        sql<boolean>`${countDifferenceCapaciteScolaire(eb)} < 0`,
        sql<boolean>`${countDifferenceCapaciteScolaireColoree(eb)} < 0`,
      ])
    )
    .then(eb.val(0))
    // si augmentation des places globales + diminution des places colorées => augmentation de places
    .when(
      eb.and([
        sql<boolean>`${countDifferenceCapaciteScolaire(eb)} >= 0`,
        sql<boolean>`${countDifferenceCapaciteScolaireColoree(eb)} < 0`,
      ])
    )
    .then(countDifferenceCapaciteScolaire(eb))
    // si diminution des places globales + augmentation des places colorées => pas d'ouverture de places
    .when(
      eb.and([
        sql<boolean>`${countDifferenceCapaciteScolaire(eb)} < 0`,
        sql<boolean>`${countDifferenceCapaciteScolaireColoree(eb)} >= 0`,
      ])
    )
    .then(eb.val(0))
    // si augmentation des places globales + augmentation des places colorées => max de augmentation
    .when(
      eb.and([
        sql<boolean>`${countDifferenceCapaciteScolaire(eb)} >= 0`,
        sql<boolean>`${countDifferenceCapaciteScolaireColoree(eb)} >= 0`,
      ])
    )
    .then(
      eb
        .case()
        .when(
          eb(
            sql<number>`ABS(${countDifferenceCapaciteScolaire(eb)})`,
            ">=",
            sql<number>`ABS(${countDifferenceCapaciteScolaireColoree(eb)})`
          )
        )
        .then(sql<number>`ABS(${countDifferenceCapaciteScolaire(eb)})`)
        .else(0)
        .end()
    )
    .end();

export const countPlacesOuvertesScolaireQ1 = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant" | "campagne">;
  avecColoration?: boolean;
}) => eb.case().when(inQ1(eb)).then(countPlacesOuvertesScolaire({eb, avecColoration})).else(0).end();

export const countPlacesOuvertesScolaireQ2 = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant" | "campagne">;
  avecColoration?: boolean;
}) => eb.case().when(inQ2(eb)).then(countPlacesOuvertesScolaire({eb, avecColoration})).else(0).end();

export const countPlacesOuvertesScolaireQ1Q2 = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant" | "campagne">;
  avecColoration?: boolean;
}) => eb.case().when(inQ1Q2(eb)).then(countPlacesOuvertesScolaire({eb, avecColoration})).else(0).end();

export const countPlacesOuvertesScolaireCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction">;
}) => sql<number>`
  GREATEST(0,
    ${eb.ref("correction.capaciteScolaire")} -
    ${eb.ref("correction.capaciteScolaireActuelle")}
  )`;

export const countPlacesOuvertesApprentissage = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne">;
  avecColoration?: boolean;
}) =>
  eb
    .case()
    .when(eb.val(!avecColoration))
    .then(
      eb
        .case()
        .when(sql<boolean>`${countDifferenceCapaciteApprentissage(eb)} >= 0`)
        .then(sql<number>`ABS(${countDifferenceCapaciteApprentissage(eb)})`)
        .else(eb.val(0))
        .end()
    )
    .when(
      eb.and([
        eb("campagne.annee", "=", FIRST_ANNEE_CAMPAGNE),
        sql<boolean>`${countDifferenceCapaciteApprentissage(eb)} >= 0`,
      ])
    )
    .then(sql<number>`ABS(${countDifferenceCapaciteApprentissage(eb)})`)
    // si type demande = coloration => pas d'ouverture de places
    .when("typeDemande", "=", DemandeTypeEnum["coloration"])
    .then(eb.val(0))
    // si diminution des places globales + diminution des places colorées => pas d'ouverture de places
    .when(
      eb.and([
        sql<boolean>`${countDifferenceCapaciteApprentissage(eb)} < 0`,
        sql<boolean>`${countDifferenceCapaciteApprentissageColoree(eb)} < 0`,
      ])
    )
    .then(eb.val(0))
    // si augmentation des places globales + diminution des places colorées => augmentation de places
    .when(
      eb.and([
        sql<boolean>`${countDifferenceCapaciteApprentissage(eb)} >= 0`,
        sql<boolean>`${countDifferenceCapaciteApprentissageColoree(eb)} < 0`,
      ])
    )
    .then(
      sql<number>`
        ABS(${countDifferenceCapaciteApprentissage(eb)})
      `
    )
    // si diminution des places globales + augmentation des places colorées =>  => pas d'ouverture de places
    .when(
      eb.and([
        sql<boolean>`${countDifferenceCapaciteApprentissage(eb)} < 0`,
        sql<boolean>`${countDifferenceCapaciteApprentissageColoree(eb)} >= 0`,
      ])
    )
    .then(eb.val(0))
    // si augmentation des places globales + augmentation des places colorées => max de augmentation
    .when(
      eb.and([
        sql<boolean>`${countDifferenceCapaciteApprentissage(eb)} >= 0`,
        sql<boolean>`${countDifferenceCapaciteApprentissageColoree(eb)} >= 0`,
      ])
    )
    .then(
      eb
        .case()
        .when(
          eb(
            sql<number>`ABS(${countDifferenceCapaciteApprentissage(eb)})`,
            ">=",
            sql<number>`ABS(${countDifferenceCapaciteApprentissageColoree(eb)})`
          )
        )
        .then(sql<number>`ABS(${countDifferenceCapaciteApprentissage(eb)})`)
        .else(0)
        .end()
    )
    .end();

export const countPlacesOuvertesApprentissageQ1 = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant" | "campagne">;
  avecColoration?: boolean;
}) => eb.case().when(inQ1(eb)).then(countPlacesOuvertesApprentissage({eb, avecColoration})).else(0).end();

export const countPlacesOuvertesApprentissageQ2 = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant" | "campagne">;
  avecColoration?: boolean;
}) => eb.case().when(inQ2(eb)).then(countPlacesOuvertesApprentissage({eb, avecColoration})).else(0).end();

export const countPlacesOuvertesApprentissageQ1Q2 = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant" | "campagne">;
  avecColoration?: boolean;
}) => eb.case().when(inQ1Q2(eb)).then(countPlacesOuvertesScolaire({eb, avecColoration})).else(0).end();

export const countPlacesOuvertesApprentissageCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction">;
}) => sql<number>`
  GREATEST(0,
    ${eb.ref("correction.capaciteApprentissage")} -
    ${eb.ref("correction.capaciteApprentissageActuelle")}
  )`;
