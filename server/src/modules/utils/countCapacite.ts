import { ExpressionBuilder, ExpressionWrapper, RawBuilder, sql } from "kysely";
import { FIRST_ANNEE_CAMPAGNE } from "shared";
import { DemandeTypeEnum } from "shared/enum/demandeTypeEnum";
import { PositionQuadrantEnum } from "shared/enum/positionQuadrantEnum";
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import { DB } from "../../db/db";

export const exceptionColoration = ({
  eb,
  count,
}: {
  eb: ExpressionBuilder<DB, "demande">;
  count:
    | RawBuilder<number>
    | ExpressionWrapper<DB, "demande" | "campagne", number>;
}) =>
  eb
    .case()
    .when("demande.typeDemande", "=", DemandeTypeEnum.coloration)
    .then(0)
    .else(count)
    .end();

export const exceptionColorationIntention = ({
  eb,
  count,
}: {
  eb: ExpressionBuilder<DB, "intention">;
  count: RawBuilder<number>;
}) =>
  eb
    .case()
    .when("intention.typeDemande", "=", DemandeTypeEnum.coloration)
    .then(0)
    .else(count)
    .end();

const inQ1 = (
  eb: ExpressionBuilder<DB, "positionFormationRegionaleQuadrant">
) =>
  eb(
    eb.ref("positionFormationRegionaleQuadrant.positionQuadrant"),
    "=",
    PositionQuadrantEnum.Q1
  );

const inQ2 = (
  eb: ExpressionBuilder<DB, "positionFormationRegionaleQuadrant">
) =>
  eb(
    eb.ref("positionFormationRegionaleQuadrant.positionQuadrant"),
    "=",
    PositionQuadrantEnum.Q2
  );

const inQ1Q2 = (
  eb: ExpressionBuilder<DB, "positionFormationRegionaleQuadrant">
) =>
  eb(eb.ref("positionFormationRegionaleQuadrant.positionQuadrant"), "in", [
    PositionQuadrantEnum.Q1,
    PositionQuadrantEnum.Q2,
  ]);

const inQ3 = (
  eb: ExpressionBuilder<DB, "positionFormationRegionaleQuadrant">
) =>
  eb(
    eb.ref("positionFormationRegionaleQuadrant.positionQuadrant"),
    "=",
    PositionQuadrantEnum.Q3
  );

const inQ4 = (
  eb: ExpressionBuilder<DB, "positionFormationRegionaleQuadrant">
) =>
  eb(
    eb.ref("positionFormationRegionaleQuadrant.positionQuadrant"),
    "=",
    PositionQuadrantEnum.Q4
  );

const inQ3Q4 = (
  eb: ExpressionBuilder<DB, "positionFormationRegionaleQuadrant">
) =>
  eb(eb.ref("positionFormationRegionaleQuadrant.positionQuadrant"), "in", [
    PositionQuadrantEnum.Q3,
    PositionQuadrantEnum.Q4,
  ]);

const inTransitionEcologique = (eb: ExpressionBuilder<DB, "rome">) =>
  eb(eb.ref("rome.transitionEcologique"), "=", true);

export const countPlacesOuvertesTransitionEcologique = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`
      ${countPlacesOuvertesScolaireTransitionEcologique(eb)} +
      ${countPlacesOuvertesApprentissageTransitionEcologique(eb)}
    `,
  });

export const countPlacesOuvertesScolaireTransitionEcologique = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "rome">;
}) =>
  exceptionColoration({
    eb,
    count: eb
      .case()
      .when(inTransitionEcologique(eb))
      .then(countPlacesOuvertesScolaire(eb))
      .else(0)
      .end(),
  });

export const countPlacesOuvertesApprentissageTransitionEcologique = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "rome">;
}) =>
  exceptionColoration({
    eb,
    count: eb
      .case()
      .when(inTransitionEcologique(eb))
      .then(countPlacesOuvertesApprentissage(eb))
      .else(0)
      .end(),
  });

export const countPlacesOuvertes = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`
      ${countPlacesOuvertesScolaire(eb)} +
      ${countPlacesOuvertesApprentissage(eb)}
    `,
  });

export const countPlacesOuvertesQ1 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  exceptionColoration({
    eb,
    count: eb.case().when(inQ1(eb)).then(countPlacesOuvertes(eb)).else(0).end(),
  });

export const countPlacesOuvertesQ2 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  exceptionColoration({
    eb,
    count: eb.case().when(inQ2(eb)).then(countPlacesOuvertes(eb)).else(0).end(),
  });

export const countPlacesOuvertesQ1Q2 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  exceptionColoration({
    eb,
    count: eb
      .case()
      .when(inQ1Q2(eb))
      .then(countPlacesOuvertes(eb))
      .else(0)
      .end(),
  });

export const countPlacesOuvertesCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction" | "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`${countPlacesOuvertesScolaireCorrection(
      eb
    )} + ${countPlacesOuvertesApprentissageCorrection(eb)}`,
  });

export const countPlacesOuvertesScolaire = ({
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

export const countPlacesOuvertesScolaireQ1 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  exceptionColoration({
    eb,
    count: eb
      .case()
      .when(inQ1(eb))
      .then(countPlacesOuvertesScolaire(eb))
      .else(0)
      .end(),
  });

export const countPlacesOuvertesScolaireQ2 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  exceptionColoration({
    eb,
    count: eb
      .case()
      .when(inQ2(eb))
      .then(countPlacesOuvertesScolaire(eb))
      .else(0)
      .end(),
  });

export const countPlacesOuvertesScolaireQ1Q2 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  exceptionColoration({
    eb,
    count: eb
      .case()
      .when(inQ1Q2(eb))
      .then(countPlacesOuvertesScolaire(eb))
      .else(0)
      .end(),
  });

export const countPlacesOuvertesScolaireCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction" | "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`
      CASE WHEN
      (${eb.ref("correction.capaciteScolaire")} - ${eb.ref(
        "correction.capaciteScolaireActuelle"
      )}) >= 0
      THEN (${eb.ref("correction.capaciteScolaire")} -
      ${eb.ref("correction.capaciteScolaireActuelle")})
      ELSE 0
      END`,
  });

export const countPlacesOuvertesApprentissage = ({
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

export const countPlacesOuvertesApprentissageQ1 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  exceptionColoration({
    eb,
    count: eb
      .case()
      .when(inQ1(eb))
      .then(countPlacesOuvertesScolaire(eb))
      .else(0)
      .end(),
  });

export const countPlacesOuvertesApprentissageQ2 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  exceptionColoration({
    eb,
    count: eb
      .case()
      .when(inQ2(eb))
      .then(countPlacesOuvertesScolaire(eb))
      .else(0)
      .end(),
  });

export const countPlacesOuvertesApprentissageQ1Q2 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  exceptionColoration({
    eb,
    count: eb
      .case()
      .when(inQ1Q2(eb))
      .then(countPlacesOuvertesScolaire(eb))
      .else(0)
      .end(),
  });

export const countPlacesOuvertesApprentissageCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction" | "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`
        CASE WHEN
        (${eb.ref("correction.capaciteApprentissage")} - ${eb.ref(
          "correction.capaciteApprentissageActuelle"
        )}) >= 0
        THEN (${eb.ref("correction.capaciteApprentissage")} -
        ${eb.ref("correction.capaciteApprentissageActuelle")})
        ELSE 0
        END`,
  });

export const countPlacesFermees = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`
      ${countPlacesFermeesScolaire(eb)} +
      ${countPlacesFermeesApprentissage(eb)}
    `,
  });

export const countPlacesFermeesQ3 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  exceptionColoration({
    eb,
    count: eb.case().when(inQ3(eb)).then(countPlacesFermees(eb)).else(0).end(),
  });

export const countPlacesFermeesQ4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  exceptionColoration({
    eb,
    count: eb.case().when(inQ4(eb)).then(countPlacesFermees(eb)).else(0).end(),
  });

export const countPlacesFermeesQ4ParCampagne = ({
  eb,
}: {
  eb: ExpressionBuilder<
    DB,
    "demande" | "campagne" | "positionFormationRegionaleQuadrant"
  >;
}) =>
  exceptionColoration({
    eb,
    count: eb
      .case()
      .when(inQ4(eb))
      .then(countPlacesFermeesParCampagne(eb))
      .else(0)
      .end(),
  });

export const countPlacesFermeesQ3Q4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  exceptionColoration({
    eb,
    count: eb
      .case()
      .when(inQ3Q4(eb))
      .then(countPlacesFermees(eb))
      .else(0)
      .end(),
  });

export const countPlacesFermeesCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction" | "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`${countPlacesFermeesScolaireCorrection(
      eb
    )} + ${countPlacesFermeesApprentissageCorrection(eb)}`,
  });

export const countPlacesFermeesScolaire = ({
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

export const countPlacesFermeesScolaireCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction" | "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`ABS(
        LEAST(0,
          ${eb.ref("correction.capaciteScolaire")} -
          ${eb.ref("correction.capaciteScolaireActuelle")}
        )
      )`,
  });

export const countPlacesFermeesScolaireQ3 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  exceptionColoration({
    eb,
    count: eb
      .case()
      .when(inQ3(eb))
      .then(countPlacesFermeesScolaire(eb))
      .else(0)
      .end(),
  });

export const countPlacesFermeesScolaireQ4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  exceptionColoration({
    eb,
    count: eb
      .case()
      .when(inQ4(eb))
      .then(countPlacesFermeesScolaire(eb))
      .else(0)
      .end(),
  });

export const countPlacesFermeesScolaireQ3Q4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  exceptionColoration({
    eb,
    count: eb
      .case()
      .when(inQ3Q4(eb))
      .then(countPlacesFermeesScolaire(eb))
      .else(0)
      .end(),
  });

export const countPlacesFermeesApprentissage = ({
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

export const countPlacesFermeesApprentissageCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction" | "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`ABS(
      LEAST(0,
        ${eb.ref("correction.capaciteApprentissage")} -
        ${eb.ref("correction.capaciteApprentissageActuelle")}
      )`,
  });

export const countPlacesFermeesApprentissageQ3 = ({
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
      .when(inQ3(eb))
      .then(countPlacesFermeesApprentissage(eb))
      .else(0)
      .end(),
  });

export const countPlacesFermeesApprentissageQ4 = ({
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
      .when(inQ4(eb))
      .then(countPlacesFermeesApprentissage(eb))
      .else(0)
      .end(),
  });

export const countPlacesFermeesApprentissageQ3Q4 = ({
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
      .then(countPlacesFermeesApprentissage(eb))
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

export const countDifferenceCapaciteScolaireCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction" | "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`(${eb.ref("correction.capaciteScolaire")} - ${eb.ref(
      "correction.capaciteScolaireActuelle"
    )})`,
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

export const countDifferenceCapaciteApprentissageCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction" | "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`(
      ${eb.ref("correction.capaciteApprentissage")} -
      ${eb.ref("correction.capaciteApprentissageActuelle")}
    )`,
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

export const countPlacesColoreesScolaire = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  eb
    .case()
    .when("demande.typeDemande", "=", eb.val(DemandeTypeEnum.coloration))
    .then(
      sql<number>`
        GREATEST(${eb.ref("demande.capaciteScolaireColoree")}, 0)
      `
    )
    .else(0)
    .end();

export const countPlacesColoreesScolaireQ3 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  eb.case().when(inQ3(eb)).then(countPlacesColoreesScolaire(eb)).else(0).end();

export const countPlacesColoreesScolaireQ4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  eb.case().when(inQ4(eb)).then(countPlacesColoreesScolaire(eb)).else(0).end();

export const countPlacesColoreesScolaireQ3Q4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  eb
    .case()
    .when(inQ3Q4(eb))
    .then(countPlacesColoreesScolaire(eb))
    .else(0)
    .end();

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

export const countPlacesColoreesApprentissageQ3 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  eb
    .case()
    .when(inQ3(eb))
    .then(countPlacesColoreesApprentissage(eb))
    .else(0)
    .end();

export const countPlacesColoreesApprentissageQ4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  eb
    .case()
    .when(inQ4(eb))
    .then(countPlacesColoreesApprentissage(eb))
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
    ${countPlacesColoreesScolaire(eb)} +
    ${countPlacesColoreesApprentissage(eb)}
  `;

export const countPlacesColoreesQ3 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  sql<number>`${countPlacesColoreesScolaireQ3(
    eb
  )} + ${countPlacesColoreesApprentissageQ3(eb)}`;

export const countPlacesColoreesQ4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  sql<number>`${countPlacesColoreesScolaireQ4(
    eb
  )} + ${countPlacesColoreesApprentissageQ4(eb)}`;

export const countPlacesColoreesQ3Q4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  sql<number>`${countPlacesColoreesScolaireQ3Q4(
    eb
  )} + ${countPlacesColoreesApprentissageQ3Q4(eb)}`;

export const countPlacesColoreesScolairelaireCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction" | "demande">;
}) =>
  eb
    .case()
    .when("demande.typeDemande", "=", eb.val(DemandeTypeEnum.coloration))
    .then(
      sql<number>`
        GREATEST(${eb.ref("correction.capaciteScolaireColoree")}, 0)
      `
    )
    .else(0)
    .end();

export const countPlacesColoreesApprentissageCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction" | "demande">;
}) =>
  eb
    .case()
    .when("demande.typeDemande", "=", eb.val(DemandeTypeEnum.coloration))
    .then(
      sql<number>`
          GREATEST(${eb.ref("correction.capaciteApprentissageColoree")}, 0)
        `
    )
    .else(0)
    .end();

export const countPlacesColoreesCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction" | "demande">;
}) =>
  sql<number>`
    ${countPlacesColoreesScolairelaireCorrection(eb)} +
    ${countPlacesColoreesApprentissageCorrection(eb)}
  `;

export const countPlacesTransformeesCampagne2023 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  sql<number>`
    ${countPlacesOuvertes(eb)} +
    ${countPlacesFermeesScolaire(eb)}
  `;

export const countPlacesTransformees = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  sql<number>`
    ${countPlacesOuvertes(eb)} +
    ${countPlacesFermees(eb)} +
    ${countPlacesColorees(eb)}
  `;

export const countPlacesFermeesParCampagne = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne">;
}) =>
  eb
    .case()
    .when("campagne.annee", "=", FIRST_ANNEE_CAMPAGNE)
    .then(countPlacesFermeesScolaire(eb))
    .else(countPlacesFermees(eb))
    .end();

export const countPlacesTransformeesParCampagne = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne">;
}) =>
  eb
    .case()
    .when("campagne.annee", "=", FIRST_ANNEE_CAMPAGNE)
    .then(countPlacesTransformeesCampagne2023(eb))
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
    case FIRST_ANNEE_CAMPAGNE:
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
