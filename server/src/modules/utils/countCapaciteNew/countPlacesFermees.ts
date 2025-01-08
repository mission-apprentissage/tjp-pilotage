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
import { inQ3, inQ3Q4, inQ4 } from "./utils";

export const countPlacesFermees = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) => sql<number>`
    ${countPlacesFermeesScolaire(eb)} +
    ${countPlacesFermeesApprentissage(eb)}
  `;

export const countPlacesFermeesQ3 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) => eb.case().when(inQ3(eb)).then(countPlacesFermees(eb)).else(0).end();

export const countPlacesFermeesQ4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) => eb.case().when(inQ4(eb)).then(countPlacesFermees(eb)).else(0).end();

export const countPlacesFermeesQ4ParCampagne = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne" | "positionFormationRegionaleQuadrant">;
}) => eb.case().when(inQ4(eb)).then(countPlacesFermeesParCampagne(eb)).else(0).end();

export const countPlacesFermeesQ3Q4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) => eb.case().when(inQ3Q4(eb)).then(countPlacesFermees(eb)).else(0).end();

export const countPlacesFermeesCorrection = ({ eb }: { eb: ExpressionBuilder<DB, "correction" | "demande"> }) =>
  sql<number>`
    ${countPlacesFermeesScolaireCorrection(eb)} +
    ${countPlacesFermeesApprentissageCorrection(eb)}
  `;

export const countPlacesFermeesScolaire = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  eb
    .case()
    // si type demande = coloration => pas de fermeture de places
    .when("typeDemande", "=", DemandeTypeEnum["coloration"])
    .then(eb.val(0))
    // si diminution des places globales + diminution des places colorées => max de diminution
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
            ">=",
            sql<number>`ABS(${countDifferenceCapaciteScolaireColoree(eb)})`,
          ),
        )
        .then(sql<number>`ABS(${countDifferenceCapaciteScolaire(eb)})`)
        .else(0)
        .end(),
    )
    // si augmentation des places globales + diminution des places colorées => aucune diminution des places
    .when(
      eb.and([
        sql<boolean>`${countDifferenceCapaciteScolaire(eb)} >= 0`,
        sql<boolean>`${countDifferenceCapaciteScolaireColoree(eb)} < 0`,
      ]),
    )
    .then(eb.val(0))
    // si diminution des places globales + augmentation des places colorées => diminution globale
    .when(
      eb.and([
        sql<boolean>`${countDifferenceCapaciteScolaire(eb)} < 0`,
        sql<boolean>`${countDifferenceCapaciteScolaireColoree(eb)} >= 0`,
      ]),
    )
    .then(
      sql<number>`
        ABS(${countDifferenceCapaciteScolaire(eb)})
      `,
    )
    // si augmentation des places globales + augmentation des places colorées => aucune diminution de places
    .when(
      eb.and([
        sql<boolean>`${countDifferenceCapaciteScolaire(eb)} >= 0`,
        sql<boolean>`${countDifferenceCapaciteScolaireColoree(eb)} >= 0`,
      ]),
    )
    .then(eb.val(0))
    .end();

export const countPlacesFermeesParCampagne = ({ eb }: { eb: ExpressionBuilder<DB, "demande" | "campagne"> }) =>
  eb
    .case()
    .when("campagne.annee", "=", FIRST_ANNEE_CAMPAGNE)
    .then(countPlacesFermeesScolaire(eb))
    .else(countPlacesFermees(eb))
    .end();

export const countPlacesFermeesScolaireCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction" | "demande">;
}) => sql<number>`ABS(
        LEAST(0,
          ${eb.ref("correction.capaciteScolaire")} -
          ${eb.ref("correction.capaciteScolaireActuelle")}
        )
      )`;

export const countPlacesFermeesScolaireQ3 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) => eb.case().when(inQ3(eb)).then(countPlacesFermeesScolaire(eb)).else(0).end();

export const countPlacesFermeesScolaireQ4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) => eb.case().when(inQ4(eb)).then(countPlacesFermeesScolaire(eb)).else(0).end();

export const countPlacesFermeesScolaireQ3Q4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) => eb.case().when(inQ3Q4(eb)).then(countPlacesFermeesScolaire(eb)).else(0).end();

export const countPlacesFermeesApprentissage = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  eb
    .case()
    // si type demande = coloration => pas de fermeture de places
    .when("typeDemande", "=", DemandeTypeEnum["coloration"])
    .then(eb.val(0))
    // si diminution des places globales + diminution des places colorées => max de diminution
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
            ">=",
            sql<number>`ABS(${countDifferenceCapaciteApprentissageColoree(eb)})`,
          ),
        )
        .then(sql<number>`ABS(${countDifferenceCapaciteScolaire(eb)})`)
        .else(0)
        .end(),
    )
    // si augmentation des places globales + diminution des places colorées => aucune diminution des places
    .when(
      eb.and([
        sql<boolean>`${countDifferenceCapaciteApprentissage(eb)} >= 0`,
        sql<boolean>`${countDifferenceCapaciteApprentissageColoree(eb)} < 0`,
      ]),
    )
    .then(eb.val(0))
    // si diminution des places globales + augmentation des places colorées => diminution globale
    .when(
      eb.and([
        sql<boolean>`${countDifferenceCapaciteApprentissage(eb)} < 0`,
        sql<boolean>`${countDifferenceCapaciteApprentissageColoree(eb)} >= 0`,
      ]),
    )
    .then(
      sql<number>`
        ABS(${countDifferenceCapaciteApprentissage(eb)})
      `,
    )
    // si augmentation des places globales + augmentation des places colorées => aucune diminution de places
    .when(
      eb.and([
        sql<boolean>`${countDifferenceCapaciteApprentissage(eb)} >= 0`,
        sql<boolean>`${countDifferenceCapaciteApprentissageColoree(eb)} >= 0`,
      ]),
    )
    .then(eb.val(0))
    .end();

export const countPlacesFermeesApprentissageCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction">;
}) => sql<number>`ABS(
      LEAST(0,
        ${eb.ref("correction.capaciteApprentissage")} -
        ${eb.ref("correction.capaciteApprentissageActuelle")}
      )
    )`;

export const countPlacesFermeesApprentissageQ3 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) => eb.case().when(inQ3(eb)).then(countPlacesFermeesApprentissage(eb)).else(0).end();

export const countPlacesFermeesApprentissageQ4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) => eb.case().when(inQ4(eb)).then(countPlacesFermeesApprentissage(eb)).else(0).end();

export const countPlacesFermeesApprentissageQ3Q4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) => eb.case().when(inQ3Q4(eb)).then(countPlacesFermeesApprentissage(eb)).else(0).end();
