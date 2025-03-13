import type { ExpressionBuilder } from "kysely";
import { sql } from "kysely";

import type { DB } from "@/db/db";

import {
  countDifferenceCapaciteApprentissage,
  countDifferenceCapaciteApprentissageColoree,
  countDifferenceCapaciteScolaire,
  countDifferenceCapaciteScolaireColoree,
} from "./countDifferenceCapacite";
import { exceptionCampagne2023, inQ3, inQ3Q4, inQ4 } from "./utils";

export const countPlacesColoreesOuvertesScolaire = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne">;
  avecColoration?: boolean
}) =>
  exceptionCampagne2023({
    eb,
    count: eb
      .case()
      .when(eb.val(!avecColoration))
      .then(eb.val(0))
      // si diminution des places colorées => 0
      .when(sql<boolean>`${countDifferenceCapaciteScolaireColoree(eb)} <= 0`)
      .then(eb.val(0))
      // si diminution des places globales + augmentation des places colorées => somme des augmentations
      .when(
        eb.and([
          sql<boolean>`${countDifferenceCapaciteScolaire(eb)} < 0`,
          sql<boolean>`${countDifferenceCapaciteScolaireColoree(eb)} >= 0`,
        ])
      )
      .then(sql<number>`ABS(${countDifferenceCapaciteScolaireColoree(eb)})`)
      // si augmentation des places globales + augmentation des places colorées => nombre de places colorées si supérieur à l'augmentation de capacité
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
              "<",
              sql<number>`ABS(${countDifferenceCapaciteScolaireColoree(eb)})`
            )
          )
          .then(sql<number>`ABS(${countDifferenceCapaciteScolaireColoree(eb)})`)
          .else(eb.val(0))
          .end()
      )
      .else(eb.val(0))
      .end(),
  });

export const countPlacesColoreesFermeesScolaire = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne">;
  avecColoration?: boolean
}) =>
  exceptionCampagne2023({
    eb,
    count: eb
      .case()
      .when(eb.val(!avecColoration))
      .then(eb.val(0))
      // si augmentation des places colorées => 0
      .when(sql<boolean>`${countDifferenceCapaciteScolaireColoree(eb)} > 0`)
      .then(eb.val(0))
      // si diminution des places globales + diminution des places colorées => nombre de places colorées si supérieur à l'augmentation de capacité
      .when(
        eb.and([
          sql<boolean>`${countDifferenceCapaciteScolaire(eb)} < 0`,
          sql<boolean>`${countDifferenceCapaciteScolaireColoree(eb)} < 0`,
        ])
      )
      .then(
        eb
          .case()
          .when(
            eb(
              sql<number>`ABS(${countDifferenceCapaciteScolaire(eb)})`,
              "<",
              sql<number>`ABS(${countDifferenceCapaciteScolaireColoree(eb)})`
            )
          )
          .then(sql<number>`ABS(${countDifferenceCapaciteScolaireColoree(eb)})`)
          .else(eb.val(0))
          .end()
      )
      // si augmentation des places globales + diminution des places colorées => somme des diminutions
      .when(
        eb.and([
          sql<boolean>`${countDifferenceCapaciteScolaire(eb)} >= 0`,
          sql<boolean>`${countDifferenceCapaciteScolaireColoree(eb)} < 0`,
        ])
      )
      .then(sql<number>`ABS(${countDifferenceCapaciteScolaireColoree(eb)})`)
      .else(eb.val(0))
      .end(),
  });

export const countPlacesColoreesOuvertesScolaireQ3 = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne" | "positionFormationRegionaleQuadrant">;
  avecColoration?: boolean
}) => eb.case().when(inQ3(eb)).then(countPlacesColoreesOuvertesScolaire({eb, avecColoration })).else(eb.val(0)).end();

export const countPlacesColoreesOuvertesScolaireQ4 = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne" | "positionFormationRegionaleQuadrant">;
  avecColoration?: boolean
}) => eb.case().when(inQ4(eb)).then(countPlacesColoreesOuvertesScolaire({eb, avecColoration })).else(eb.val(0)).end();

export const countPlacesColoreesOuvertesScolaireQ3Q4 = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne" | "positionFormationRegionaleQuadrant">;
  avecColoration?: boolean
}) => eb.case().when(inQ3Q4(eb)).then(countPlacesColoreesOuvertesScolaire({eb, avecColoration })).else(eb.val(0)).end();

export const countPlacesColoreesOuvertesApprentissage = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne">;
  avecColoration?: boolean
}) =>
  exceptionCampagne2023({
    eb,
    count: eb
      .case()
      .when(eb.val(!avecColoration))
      .then(eb.val(0))
      // si diminution des places colorées => 0
      .when(sql<boolean>`${countDifferenceCapaciteApprentissageColoree(eb)} < 0`)
      .then(eb.val(0))
      // si diminution des places globales + augmentation des places colorées => somme des augmentations
      .when(
        eb.and([
          sql<boolean>`${countDifferenceCapaciteApprentissage(eb)} < 0`,
          sql<boolean>`${countDifferenceCapaciteApprentissageColoree(eb)} >= 0`,
        ])
      )
      .then(sql<number>`ABS(${countDifferenceCapaciteApprentissageColoree(eb)})`)
      // si augmentation des places globales + augmentation des places colorées => nombre de places colorées si supérieur à l'augmentation de capacité
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
              "<",
              sql<number>`
                ABS(${countDifferenceCapaciteApprentissageColoree(eb)})
              `
            )
          )
          .then(sql<number>`ABS(${countDifferenceCapaciteApprentissageColoree(eb)})`)
          .else(eb.val(0))
          .end()
      )
      .else(eb.val(0))
      .end(),
  });

export const countPlacesColoreesFermeesApprentissage = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne">;
  avecColoration?: boolean
}) =>
  exceptionCampagne2023({
    eb,
    count: eb
      .case()
      .when(eb.val(!avecColoration))
      .then(eb.val(0))
      // si diminution des places globales + diminution des places colorées => nombre de places colorées si supérieur à l'augmentation de capacité
      .when(
        eb.and([
          sql<boolean>`${countDifferenceCapaciteApprentissage(eb)} < 0`,
          sql<boolean>`${countDifferenceCapaciteApprentissageColoree(eb)} < 0`,
        ])
      )
      .then(
        eb
          .case()
          .when(
            eb(
              sql<number>`ABS(${countDifferenceCapaciteApprentissage(eb)})`,
              "<",
              sql<number>`
                ABS(${countDifferenceCapaciteApprentissageColoree(eb)})
              `
            )
          )
          .then(sql<number>`ABS(${countDifferenceCapaciteApprentissageColoree(eb)})`)
          .else(eb.val(0))
          .end()
      )
      // si augmentation des places globales + diminution des places colorées => nombre de places colorées
      .when(
        eb.and([
          sql<boolean>`${countDifferenceCapaciteApprentissage(eb)} >= 0`,
          sql<boolean>`${countDifferenceCapaciteApprentissageColoree(eb)} < 0`,
        ])
      )
      .then(sql<number>`ABS(${countDifferenceCapaciteApprentissageColoree(eb)})`)
      // si augmentation des places colorées => 0
      .when(sql<boolean>`${countDifferenceCapaciteApprentissageColoree(eb)} >= 0`)
      .then(eb.val(0))
      .else(eb.val(0))
      .end(),
  });

export const countPlacesColoreesOuvertesApprentissageQ3 = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne" | "positionFormationRegionaleQuadrant">;
  avecColoration?: boolean
}) => eb
  .case()
  .when(inQ3(eb))
  .then(countPlacesColoreesOuvertesApprentissage({eb, avecColoration }))
  .else(eb.val(0))
  .end();

export const countPlacesColoreesOuvertesApprentissageQ4 = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne" | "positionFormationRegionaleQuadrant">;
  avecColoration?: boolean
}) => eb
  .case()
  .when(inQ4(eb))
  .then(countPlacesColoreesOuvertesApprentissage({eb, avecColoration }))
  .else(eb.val(0))
  .end();

export const countPlacesColoreesOuvertesApprentissageQ3Q4 = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne" | "positionFormationRegionaleQuadrant">;
  avecColoration?: boolean
}) => eb
  .case()
  .when(inQ3Q4(eb))
  .then(countPlacesColoreesOuvertesApprentissage({eb, avecColoration }))
  .else(eb.val(0))
  .end();

export const countPlacesColoreesOuvertes = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande">;
  avecColoration?: boolean
}) =>
  sql<number>`
    ${countPlacesColoreesOuvertesScolaire({eb, avecColoration })} +
    ${countPlacesColoreesOuvertesApprentissage({eb, avecColoration })}
  `;

export const countPlacesColoreesOuvertesQ3 = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
  avecColoration?: boolean
}) =>
  sql<number>`
    ${countPlacesColoreesOuvertesScolaireQ3({eb, avecColoration })} +
    ${countPlacesColoreesOuvertesApprentissageQ3({eb, avecColoration })}
  `;

export const countPlacesColoreesOuvertesQ4 = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
  avecColoration?: boolean
}) =>
  sql<number>`
    ${countPlacesColoreesOuvertesScolaireQ4({eb, avecColoration })} +
    ${countPlacesColoreesOuvertesApprentissageQ4({eb, avecColoration })}
  `;

export const countPlacesColoreesOuvertesQ3Q4 = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
  avecColoration?: boolean
}) =>
  sql<number>`
    ${countPlacesColoreesOuvertesScolaireQ3Q4({eb, avecColoration })} +
    ${countPlacesColoreesOuvertesApprentissageQ3Q4({eb, avecColoration })}
  `;

export const countPlacesColoreesOuvertesScolaireCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction">;
}) => sql<number>`
    GREATEST(0,
      ${eb.ref("correction.capaciteScolaireColoree")} -
      ${eb.ref("correction.capaciteScolaireColoreeActuelle")}
    )`;

export const countPlacesColoreesOuvertesApprentissageCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction">;
}) => sql<number>`
    GREATEST(0,
      ${eb.ref("correction.capaciteApprentissageColoree")} -
      ${eb.ref("correction.capaciteApprentissageColoreeActuelle")}
    )`;

export const countPlacesColoreesOuvertesCorrection = ({ eb }: { eb: ExpressionBuilder<DB, "correction"> }) =>
  sql<number>`
    ${countPlacesColoreesOuvertesScolaireCorrection(eb)} +
    ${countPlacesColoreesOuvertesApprentissageCorrection(eb)}
  `;

// PLACES COLORÉES FERMÉES

export const countPlacesColoreesFermees = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande">;
  avecColoration?: boolean
}) =>
  sql<number>`
    ${countPlacesColoreesFermeesScolaire({eb, avecColoration })} +
    ${countPlacesColoreesFermeesApprentissage({eb, avecColoration })}
  `;

export const countPlacesColoreesFermeesScolaireCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction">;
}) => sql<number>`
  ABS(
    LEAST(0,
      ${eb.ref("correction.capaciteScolaireColoree")} -
      ${eb.ref("correction.capaciteScolaireColoreeActuelle")}
    )
  )`;

export const countPlacesColoreesFermeesApprentissageCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction">;
}) => sql<number>`
  ABS(
    LEAST(0,
      ${eb.ref("correction.capaciteApprentissageColoree")} -
      ${eb.ref("correction.capaciteApprentissageColoreeActuelle")}
    )
  )`;

export const countPlacesColoreesScolaire = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande">;
  avecColoration?: boolean
}) =>
  sql<number>`
    ${countPlacesColoreesOuvertesScolaire({eb, avecColoration })} +
    ${countPlacesColoreesFermeesScolaire({eb, avecColoration })}
  `;

export const countPlacesColoreesApprentissage = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande">;
  avecColoration?: boolean
}) =>
  sql<number>`
    ${countPlacesColoreesOuvertesApprentissage({eb, avecColoration })} +
    ${countPlacesColoreesFermeesApprentissage({eb, avecColoration })}
  `;

export const countPlacesColorees = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande">;
  avecColoration?: boolean
}) =>
  sql<number>`
    ${countPlacesColoreesScolaire({eb, avecColoration })} +
    ${countPlacesColoreesApprentissage({eb, avecColoration })}
  `;

export const countPlacesColoreesQ4 = ({
  eb,
  avecColoration = true
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
  avecColoration?: boolean
}) => eb
  .case()
  .when(inQ4(eb))
  .then(countPlacesColorees({eb, avecColoration}))
  .else(eb.val(0))
  .end();
