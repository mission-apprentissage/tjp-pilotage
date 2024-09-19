import { ExpressionBuilder, ExpressionWrapper, RawBuilder, sql } from "kysely";
import { DemandeTypeEnum } from "shared/enum/demandeTypeEnum";
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import { DB } from "../../db/db";

const inQ3Q4 = (
  eb: ExpressionBuilder<DB, "positionFormationRegionaleQuadrant">
) =>
  eb(eb.ref("positionFormationRegionaleQuadrant.positionQuadrant"), "in", [
    "Q3",
    "Q4",
  ]);

const inQ1Q2 = (
  eb: ExpressionBuilder<DB, "positionFormationRegionaleQuadrant">
) =>
  eb(eb.ref("positionFormationRegionaleQuadrant.positionQuadrant"), "in", [
    "Q1",
    "Q2",
  ]);

const inTransitionEcologique = (eb: ExpressionBuilder<DB, "rome">) =>
  eb(eb.ref("rome.transitionEcologique"), "=", true);

export const countOuverturesTransitionEcologique = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`
      ${countOuverturesScoTransitionEcologique(eb)} +
      ${countOuverturesApprentissageTransitionEcologique(eb)}
    `,
  });

export const countOuverturesScoTransitionEcologique = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "rome">;
}) =>
  exceptionColoration({
    eb,
    count: eb
      .case()
      .when(inTransitionEcologique(eb))
      .then(countOuverturesSco(eb))
      .else(0)
      .end(),
  });

export const countOuverturesApprentissageTransitionEcologique = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "rome">;
}) =>
  exceptionColoration({
    eb,
    count: eb
      .case()
      .when(inTransitionEcologique(eb))
      .then(countOuverturesApprentissage(eb))
      .else(0)
      .end(),
  });

export const countOuvertures = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`
      ${countOuverturesSco(eb)} +
      ${countOuverturesApprentissage(eb)}
    `,
  });

export const countOuverturesQ1Q2 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  exceptionColoration({
    eb,
    count: eb.case().when(inQ1Q2(eb)).then(countOuvertures(eb)).else(0).end(),
  });

export const countOuverturesSco = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`GREATEST(
      ${eb.ref("demande.capaciteScolaire")} - ${eb.ref(
        "demande.capaciteScolaireActuelle"
      )},
      0
    )`,
  });

export const countOuverturesScoQ1Q2 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  exceptionColoration({
    eb,
    count: eb
      .case()
      .when(inQ1Q2(eb))
      .then(countOuverturesSco(eb))
      .else(0)
      .end(),
  });

export const countOuverturesApprentissage = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`GREATEST(
      ${eb.ref("demande.capaciteApprentissage")} - ${eb.ref(
        "demande.capaciteApprentissageActuelle"
      )},
      0
    )`,
  });

export const countOuverturesApprentissageQ1Q2 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  exceptionColoration({
    eb,
    count: eb
      .case()
      .when(inQ1Q2(eb))
      .then(countOuverturesSco(eb))
      .else(0)
      .end(),
  });

export const countFermetures = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`
      ${countFermeturesSco(eb)} +
      ${countFermeturesApprentissage(eb)}
    `,
  });

export const countFermeturesQ3Q4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  exceptionColoration({
    eb,
    count: eb.case().when(inQ3Q4(eb)).then(countFermetures(eb)).else(0).end(),
  });

export const countFermeturesSco = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`ABS(
      LEAST(0,
        ${eb.ref("demande.capaciteScolaire")} -
        ${eb.ref("demande.capaciteScolaireActuelle")}
      )
    )`,
  });

export const countFermeturesScoQ3Q4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  exceptionColoration({
    eb,
    count: eb
      .case()
      .when(inQ3Q4(eb))
      .then(countFermeturesSco(eb))
      .else(0)
      .end(),
  });

export const countFermeturesApprentissage = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`ABS(
      LEAST(0,
        ${eb.ref("demande.capaciteApprentissage")} -
        ${eb.ref("demande.capaciteApprentissageActuelle")}
      )
    )`,
  });

export const countFermeturesApprentissageQ3Q4 = ({
  eb,
}: {
  eb: ExpressionBuilder<
    DB,
    "demande" | "positionFormationRegionaleQuadrant" | "campagne"
  >;
}) =>
  exceptionColoration({
    eb,
    count: eb
      .case()
      .when(inQ3Q4(eb))
      .then(countFermeturesApprentissage(eb))
      .else(0)
      .end(),
  });

export const countDifferenceCapaciteScolaire = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`
      ${eb.ref("demande.capaciteScolaire")} -
      ${eb.ref("demande.capaciteScolaireActuelle")}
    `,
  });

export const countDifferenceCapaciteApprentissage = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`
      ${eb.ref("demande.capaciteApprentissage")} -
      ${eb.ref("demande.capaciteApprentissageActuelle")}
    `,
  });

export const countDifferenceCapaciteScolaireIntention = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "intention">;
}) =>
  exceptionColorationIntention({
    eb,
    count: sql<number>`
      ${eb.ref("intention.capaciteScolaire")} -
      ${eb.ref("intention.capaciteScolaireActuelle")}
    `,
  });

export const countDifferenceCapaciteApprentissageIntention = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "intention">;
}) =>
  exceptionColorationIntention({
    eb,
    count: sql<number>`
      ${eb.ref("intention.capaciteApprentissage")} -
      ${eb.ref("intention.capaciteApprentissageActuelle")}
    `,
  });

export const countPlacesColoreesSco = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  eb
    .case()
    .when("demande.typeDemande", "=", eb.val(DemandeTypeEnum.coloration))
    .then(
      sql<number>`
        GREATEST(${eb.ref("demande.capaciteApprentissageColoree")}, 0)
      `
    )
    .else(0)
    .end();

export const countPlacesColoreesScoQ3Q4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) => eb.case().when(inQ3Q4(eb)).then(countPlacesColoreesSco(eb)).else(0).end();

export const countPlacesColoreesApprentissage = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  eb
    .case()
    .when("demande.typeDemande", "=", eb.val(DemandeTypeEnum.coloration))
    .then(
      sql<number>`
        GREATEST(${eb.ref("demande.capaciteApprentissageColoree")}, 0)
      `
    )
    .else(0)
    .end();

export const countPlacesColoreesApprentissageQ3Q4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  eb
    .case()
    .when(inQ3Q4(eb))
    .then(countPlacesColoreesApprentissage(eb))
    .else(0)
    .end();

export const countPlacesColorees = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  sql<number>`
    ${countPlacesColoreesSco(eb)} +
    ${countPlacesColoreesApprentissage(eb)}
  `;

export const countPlacesColoreesQ3Q4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  sql<number>`${countPlacesColoreesScoQ3Q4(
    eb
  )} + ${countPlacesColoreesApprentissageQ3Q4(eb)}`;

export const exceptionColoration = ({
  eb,
  count,
}: {
  eb: ExpressionBuilder<DB, "demande">;
  count:
    | RawBuilder<number>
    | ExpressionWrapper<DB, "demande" | "campagne", number>;
}) =>
  sql<number>`CASE WHEN ${eb.ref("demande.typeDemande")} = ${eb.val(
    DemandeTypeEnum.coloration
  )}
    THEN 0
    ELSE ${count}
    END`;

export const exceptionColorationIntention = ({
  eb,
  count,
}: {
  eb: ExpressionBuilder<DB, "intention">;
  count: RawBuilder<number>;
}) =>
  sql<number>`CASE WHEN ${eb.ref("intention.typeDemande")} = ${eb.val(
    DemandeTypeEnum.coloration
  )}
      THEN 0
      ELSE ${count}
      END`;

export const countPlacesTransformeesCampagne2023 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  sql<number>`
    ${countOuvertures(eb)} +
    ${countFermeturesSco(eb)}
  `;

export const countPlacesTransformees = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`
        ${countOuvertures(eb)} +
        ${countFermetures(eb)} +
        ${countPlacesColorees(eb)}
      `,
  });

export const countPlacesTransformeesParCampagne = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne">;
}) =>
  exceptionColoration({
    eb,
    count: eb
      .case()
      .when("campagne.annee", "=", "2023")
      .then(countPlacesTransformeesCampagne2023(eb))
      .else(countPlacesTransformees(eb))
      .end(),
  });

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
