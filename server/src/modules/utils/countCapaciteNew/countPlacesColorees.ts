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

export const countPlacesColoreesOuvertesScolaire = ({ eb }: { eb: ExpressionBuilder<DB, "demande" | "campagne"> }) =>
  exceptionCampagne2023({
    eb,
    count: eb
      .case()
      // si diminution des places colorées => 0
      .when(sql<boolean>`${countDifferenceCapaciteScolaireColoree(eb)} < 0`)
      .then(eb.val(0))
      // si diminution des places globales + augmentation des places colorées => 0
      .when(
        eb.and([
          sql<boolean>`${countDifferenceCapaciteScolaire(eb)} < 0`,
          sql<boolean>`${countDifferenceCapaciteScolaireColoree(eb)} >= 0`,
        ]),
      )
      .then(sql<number>`ABS(${countDifferenceCapaciteScolaireColoree(eb)})`)
      // si augmentation des places globales + augmentation des places colorées => max de augmentation
      .when(
        eb.and([
          sql<boolean>`${countDifferenceCapaciteScolaire(eb)} >= 0`,
          sql<boolean>`${countDifferenceCapaciteScolaireColoree(eb)} >= 0`,
        ]),
      )
      .then(
        eb
          .case()
          .when(
            eb(
              sql<number>`ABS(${countDifferenceCapaciteScolaire(eb)})`,
              "<",
              sql<number>`ABS(${countDifferenceCapaciteScolaireColoree(eb)})`,
            ),
          )
          .then(sql<number>`ABS(${countDifferenceCapaciteScolaireColoree(eb)})`)
          .else(0)
          .end(),
      )
      .else(eb.val(0))
      .end(),
  });

export const countPlacesColoreesFermeesScolaire = ({ eb }: { eb: ExpressionBuilder<DB, "demande" | "campagne"> }) =>
  exceptionCampagne2023({
    eb,
    count: eb
      .case()
      // si diminution des places globales + diminution des places colorées => nombre de places colorées si supérieur à l'augmentation de capacité
      .when(
        eb.and([
          sql<boolean>`${countDifferenceCapaciteScolaire(eb)} < 0`,
          sql<boolean>`${countDifferenceCapaciteScolaireColoree(eb)} < 0`,
        ]),
      )
      .then(
        eb
          .case()
          .when(
            eb(
              sql<number>`ABS(${countDifferenceCapaciteScolaire(eb)})`,
              "<",
              sql<number>`ABS(${countDifferenceCapaciteScolaireColoree(eb)})`,
            ),
          )
          .then(sql<number>`ABS(${countDifferenceCapaciteScolaireColoree(eb)})`)
          .else(0)
          .end(),
      )
      // si augmentation des places globales + diminution des places colorées => nombre de places colorées
      .when(
        eb.and([
          sql<boolean>`${countDifferenceCapaciteScolaire(eb)} >= 0`,
          sql<boolean>`${countDifferenceCapaciteScolaireColoree(eb)} < 0`,
        ]),
      )
      .then(sql<number>`ABS(${countDifferenceCapaciteScolaireColoree(eb)})`)
      // si augmentation des places colorées => 0
      .when(sql<boolean>`${countDifferenceCapaciteScolaireColoree(eb)} >= 0`)
      .then(eb.val(0))
      .else(eb.val(0))
      .end(),
  });

export const countPlacesColoreesOuvertesScolaireQ3 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne" | "positionFormationRegionaleQuadrant">;
}) => eb.case().when(inQ3(eb)).then(countPlacesColoreesOuvertesScolaire(eb)).else(0).end();

export const countPlacesColoreesOuvertesScolaireQ4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne" | "positionFormationRegionaleQuadrant">;
}) => eb.case().when(inQ4(eb)).then(countPlacesColoreesOuvertesScolaire(eb)).else(0).end();

export const countPlacesColoreesOuvertesScolaireQ3Q4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne" | "positionFormationRegionaleQuadrant">;
}) => eb.case().when(inQ3Q4(eb)).then(countPlacesColoreesOuvertesScolaire(eb)).else(0).end();

export const countPlacesColoreesOuvertesApprentissage = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne">;
}) =>
  exceptionCampagne2023({
    eb,
    count: eb
      .case()
      // si diminution des places colorées => 0
      .when(sql<boolean>`${countDifferenceCapaciteApprentissageColoree(eb)} < 0`)
      .then(eb.val(0))
      // si diminution des places globales + augmentation des places colorées => 0
      .when(
        eb.and([
          sql<boolean>`${countDifferenceCapaciteApprentissage(eb)} < 0`,
          sql<boolean>`${countDifferenceCapaciteApprentissageColoree(eb)} >= 0`,
        ]),
      )
      .then(sql<number>`ABS(${countDifferenceCapaciteApprentissageColoree(eb)})`)
      // si augmentation des places globales + augmentation des places colorées => max de augmentation
      .when(
        eb.and([
          sql<boolean>`${countDifferenceCapaciteApprentissage(eb)} >= 0`,
          sql<boolean>`${countDifferenceCapaciteApprentissageColoree(eb)} >= 0`,
        ]),
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
              `,
            ),
          )
          .then(sql<number>`ABS(${countDifferenceCapaciteApprentissageColoree(eb)})`)
          .else(0)
          .end(),
      )
      .else(eb.val(0))
      .end(),
  });

export const countPlacesColoreesFermeesApprentissage = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne">;
}) =>
  exceptionCampagne2023({
    eb,
    count: eb
      .case()
      // si diminution des places globales + diminution des places colorées => nombre de places colorées si supérieur à l'augmentation de capacité
      .when(
        eb.and([
          sql<boolean>`${countDifferenceCapaciteApprentissage(eb)} < 0`,
          sql<boolean>`${countDifferenceCapaciteApprentissageColoree(eb)} < 0`,
        ]),
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
              `,
            ),
          )
          .then(sql<number>`ABS(${countDifferenceCapaciteApprentissageColoree(eb)})`)
          .else(0)
          .end(),
      )
      // si augmentation des places globales + diminution des places colorées => nombre de places colorées
      .when(
        eb.and([
          sql<boolean>`${countDifferenceCapaciteApprentissage(eb)} >= 0`,
          sql<boolean>`${countDifferenceCapaciteApprentissageColoree(eb)} < 0`,
        ]),
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
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne" | "positionFormationRegionaleQuadrant">;
}) => eb.case().when(inQ3(eb)).then(countPlacesColoreesOuvertesApprentissage(eb)).else(0).end();

export const countPlacesColoreesOuvertesApprentissageQ4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne" | "positionFormationRegionaleQuadrant">;
}) => eb.case().when(inQ4(eb)).then(countPlacesColoreesOuvertesApprentissage(eb)).else(0).end();

export const countPlacesColoreesOuvertesApprentissageQ3Q4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne" | "positionFormationRegionaleQuadrant">;
}) => eb.case().when(inQ3Q4(eb)).then(countPlacesColoreesOuvertesApprentissage(eb)).else(0).end();

export const countPlacesColoreesOuvertes = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  sql<number>`
    ${countPlacesColoreesOuvertesScolaire(eb)} +
    ${countPlacesColoreesOuvertesApprentissage(eb)}
  `;

export const countPlacesColoreesOuvertesQ3 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  sql<number>`
    ${countPlacesColoreesOuvertesScolaireQ3(eb)} +
    ${countPlacesColoreesOuvertesApprentissageQ3(eb)}
  `;

export const countPlacesColoreesOuvertesQ4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  sql<number>`
    ${countPlacesColoreesOuvertesScolaireQ4(eb)} +
    ${countPlacesColoreesOuvertesApprentissageQ4(eb)}
  `;

export const countPlacesColoreesOuvertesQ3Q4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  sql<number>`
    ${countPlacesColoreesOuvertesScolaireQ3Q4(eb)} +
    ${countPlacesColoreesOuvertesApprentissageQ3Q4(eb)}
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

export const countPlacesColoreesFermees = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  sql<number>`
    ${countPlacesColoreesFermeesScolaire(eb)} +
    ${countPlacesColoreesFermeesApprentissage(eb)}
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

export const countPlacesColoreesScolaire = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  sql<number>`
    ${countPlacesColoreesOuvertesScolaire(eb)} +
    ${countPlacesColoreesFermeesScolaire(eb)}
  `;

export const countPlacesColoreesApprentissage = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  sql<number>`
    ${countPlacesColoreesOuvertesApprentissage(eb)} +
    ${countPlacesColoreesFermeesApprentissage(eb)}
  `;

export const countPlacesColorees = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  sql<number>`
    ${countPlacesColoreesScolaire(eb)} +
    ${countPlacesColoreesApprentissage(eb)}
  `;

export const countPlacesColoreesQ4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) => eb.case().when(inQ4(eb)).then(countPlacesColorees(eb)).else(0).end();
