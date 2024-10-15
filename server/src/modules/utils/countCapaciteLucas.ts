import { ExpressionBuilder, ExpressionWrapper, RawBuilder, sql } from "kysely";
import { PositionQuadrantEnum } from "shared/enum/positionQuadrantEnum";
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";
import { FIRST_ANNEE_CAMPAGNE } from "shared/time/FIRST_ANNEE_CAMPAGNE";

import { DB } from "../../db/db";

// UTILITAIRES

export const exceptionCampagne2023 = ({
  eb,
  count,
}: {
  eb: ExpressionBuilder<DB, "campagne">;
  count:
    | RawBuilder<number>
    | ExpressionWrapper<DB, "demande" | "campagne", number>;
}) =>
  eb
    .case()
    .when("campagne.annee", "=", FIRST_ANNEE_CAMPAGNE)
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

// PLACES OUVERTES

export const countPlacesOuvertesTransitionEcologique = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) => sql<number>`
      ${countPlacesOuvertesScolaireTransitionEcologique(eb)} +
      ${countPlacesOuvertesApprentissageTransitionEcologique(eb)}
    `;

export const countPlacesOuvertesScolaireTransitionEcologique = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "rome">;
}) =>
  eb
    .case()
    .when(inTransitionEcologique(eb))
    .then(countPlacesOuvertesScolaire(eb))
    .else(0)
    .end();

export const countPlacesOuvertesApprentissageTransitionEcologique = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "rome">;
}) =>
  eb
    .case()
    .when(inTransitionEcologique(eb))
    .then(countPlacesOuvertesApprentissage(eb))
    .else(0)
    .end();

export const countPlacesOuvertes = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) => sql<number>`
      ${countPlacesOuvertesScolaire(eb)} +
      ${countPlacesOuvertesApprentissage(eb)}
    `;

export const countPlacesOuvertesQ1 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) => eb.case().when(inQ1(eb)).then(countPlacesOuvertes(eb)).else(0).end();

export const countPlacesOuvertesQ2 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) => eb.case().when(inQ2(eb)).then(countPlacesOuvertes(eb)).else(0).end();

export const countPlacesOuvertesQ1Q2 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) => eb.case().when(inQ1Q2(eb)).then(countPlacesOuvertes(eb)).else(0).end();

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
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) => sql<number>`
  GREATEST(0,
    ${eb.ref("demande.capaciteScolaire")} -
    ${eb.ref("demande.capaciteScolaireActuelle")}
  )`;

export const countPlacesOuvertesScolaireQ1 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  eb.case().when(inQ1(eb)).then(countPlacesOuvertesScolaire(eb)).else(0).end();

export const countPlacesOuvertesScolaireQ2 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  eb.case().when(inQ2(eb)).then(countPlacesOuvertesScolaire(eb)).else(0).end();

export const countPlacesOuvertesScolaireQ1Q2 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  eb
    .case()
    .when(inQ1Q2(eb))
    .then(countPlacesOuvertesScolaire(eb))
    .else(0)
    .end();

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
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) => sql<number>`
  GREATEST(0,
    ${eb.ref("demande.capaciteApprentissage")} -
    ${eb.ref("demande.capaciteApprentissageActuelle")}
  )`;

export const countPlacesOuvertesApprentissageQ1 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  eb.case().when(inQ1(eb)).then(countPlacesOuvertesScolaire(eb)).else(0).end();

export const countPlacesOuvertesApprentissageQ2 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  eb.case().when(inQ2(eb)).then(countPlacesOuvertesScolaire(eb)).else(0).end();

export const countPlacesOuvertesApprentissageQ1Q2 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  eb
    .case()
    .when(inQ1Q2(eb))
    .then(countPlacesOuvertesScolaire(eb))
    .else(0)
    .end();

export const countPlacesOuvertesApprentissageCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction">;
}) => sql<number>`
  GREATEST(0,
    ${eb.ref("correction.capaciteApprentissage")} -
    ${eb.ref("correction.capaciteApprentissageActuelle")}
  )`;

// PLACES FERMÉES

export const countPlacesFermees = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) => sql<number>`
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
export const countPlacesFermeesQ3Q4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) => eb.case().when(inQ3Q4(eb)).then(countPlacesFermees(eb)).else(0).end();

export const countPlacesFermeesCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction" | "demande">;
}) =>
  sql<number>`
    ${countPlacesFermeesScolaireCorrection(eb)} +
    ${countPlacesFermeesApprentissageCorrection(eb)}
  `;

export const countPlacesFermeesScolaire = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) => sql<number>`ABS(
        LEAST(0,
          ${eb.ref("demande.capaciteScolaire")} -
          ${eb.ref("demande.capaciteScolaireActuelle")}
        )
      )`;

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
}) =>
  eb.case().when(inQ3(eb)).then(countPlacesFermeesScolaire(eb)).else(0).end();

export const countPlacesFermeesScolaireQ4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  eb.case().when(inQ4(eb)).then(countPlacesFermeesScolaire(eb)).else(0).end();

export const countPlacesFermeesScolaireQ3Q4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  eb.case().when(inQ3Q4(eb)).then(countPlacesFermeesScolaire(eb)).else(0).end();

export const countPlacesFermeesApprentissage = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne">;
}) =>
  exceptionCampagne2023({
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
  eb: ExpressionBuilder<
    DB,
    "demande" | "campagne" | "positionFormationRegionaleQuadrant"
  >;
}) =>
  eb
    .case()
    .when(inQ3(eb))
    .then(countPlacesFermeesApprentissage(eb))
    .else(0)
    .end();

export const countPlacesFermeesApprentissageQ4 = ({
  eb,
}: {
  eb: ExpressionBuilder<
    DB,
    "demande" | "campagne" | "positionFormationRegionaleQuadrant"
  >;
}) =>
  eb
    .case()
    .when(inQ4(eb))
    .then(countPlacesFermeesApprentissage(eb))
    .else(0)
    .end();

export const countPlacesFermeesApprentissageQ3Q4 = ({
  eb,
}: {
  eb: ExpressionBuilder<
    DB,
    "demande" | "campagne" | "positionFormationRegionaleQuadrant"
  >;
}) =>
  eb
    .case()
    .when(inQ3Q4(eb))
    .then(countPlacesFermeesApprentissage(eb))
    .else(0)
    .end();

// DIFFÉRENCES CAPACITÉS

export const countDifferenceCapaciteScolaire = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) => sql<number>`
      ${eb.ref("demande.capaciteScolaire")} -
      ${eb.ref("demande.capaciteScolaireActuelle")}
    `;

export const countDifferenceCapaciteScolaireCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction">;
}) =>
  sql<number>`
    ${eb.ref("correction.capaciteScolaire")} -
    ${eb.ref("correction.capaciteScolaireActuelle")}
  `;

export const countDifferenceCapaciteApprentissage = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) => sql<number>`
      ${eb.ref("demande.capaciteApprentissage")} -
      ${eb.ref("demande.capaciteApprentissageActuelle")}
    `;

export const countDifferenceCapaciteApprentissageCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction">;
}) => sql<number>`(
      ${eb.ref("correction.capaciteApprentissage")} -
      ${eb.ref("correction.capaciteApprentissageActuelle")}
    )`;

export const countDifferenceCapaciteScolaireIntention = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "intention">;
}) => sql<number>`
      ${eb.ref("intention.capaciteScolaire")} -
      ${eb.ref("intention.capaciteScolaireActuelle")}
    `;

export const countDifferenceCapaciteApprentissageIntention = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "intention">;
}) => sql<number>`
      ${eb.ref("intention.capaciteApprentissage")} -
      ${eb.ref("intention.capaciteApprentissageActuelle")}
    `;

// PLACES COLORÉES

// PLACES COLORÉES OUVERTES

export const countPlacesColoreesOuvertesScolaire = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) => sql<number>`
    GREATEST(0,
      ${eb.ref("demande.capaciteScolaireColoree")} -
      ${eb.ref("demande.capaciteScolaireColoreeActuelle")}
    )`;

export const countPlacesColoreesFermeesScolaire = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) => sql<number>`ABS(
    LEAST(0,
      ${eb.ref("demande.capaciteScolaireColoree")} -
      ${eb.ref("demande.capaciteScolaireColoreeActuelle")}
    )
  )`;

export const countPlacesColoreesOuvertesScolaireQ3 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  eb
    .case()
    .when(inQ3(eb))
    .then(countPlacesColoreesOuvertesScolaire(eb))
    .else(0)
    .end();

export const countPlacesColoreesOuvertesScolaireQ4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  eb
    .case()
    .when(inQ4(eb))
    .then(countPlacesColoreesOuvertesScolaire(eb))
    .else(0)
    .end();

export const countPlacesColoreesOuvertesScolaireQ3Q4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  eb
    .case()
    .when(inQ3Q4(eb))
    .then(countPlacesColoreesOuvertesScolaire(eb))
    .else(0)
    .end();

export const countPlacesColoreesOuvertesApprentissage = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) => sql<number>`
  GREATEST(0,
    ${eb.ref("demande.capaciteApprentissageColoree")} -
    ${eb.ref("demande.capaciteApprentissageColoreeActuelle")}
  )`;

export const countPlacesColoreesFermeesApprentissage = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) => sql<number>`
  ABS(
    LEAST(0,
      ${eb.ref("demande.capaciteApprentissageColoree")} -
      ${eb.ref("demande.capaciteApprentissageColoreeActuelle")}
    )
  )`;

export const countPlacesColoreesOuvertesApprentissageQ3 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  eb
    .case()
    .when(inQ3(eb))
    .then(countPlacesColoreesOuvertesApprentissage(eb))
    .else(0)
    .end();

export const countPlacesColoreesOuvertesApprentissageQ4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  eb
    .case()
    .when(inQ4(eb))
    .then(countPlacesColoreesOuvertesApprentissage(eb))
    .else(0)
    .end();

export const countPlacesColoreesOuvertesApprentissageQ3Q4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  eb
    .case()
    .when(inQ3Q4(eb))
    .then(countPlacesColoreesOuvertesApprentissage(eb))
    .else(0)
    .end();

export const countPlacesColoreesOuvertes = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
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

export const countPlacesColoreesOuvertesCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction">;
}) =>
  sql<number>`
    ${countPlacesColoreesOuvertesScolaireCorrection(eb)} +
    ${countPlacesColoreesOuvertesApprentissageCorrection(eb)}
  `;

// PLACES COLORÉES FERMÉES

export const countPlacesColoreesFermees = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
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

export const countPlacesNonColoreesTransformees = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) => sql<number>`
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
}) =>
  eb
    .case()
    .when(inQ4(eb))
    .then(countPlacesColoreesTransformeesScolaire(eb))
    .else(0)
    .end();

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
}) =>
  eb
    .case()
    .when(inQ4(eb))
    .then(countPlacesColoreesTransformeesApprentissage(eb))
    .else(0)
    .end();

export const countPlacesColoreesTransformees = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) => sql<number>`
    ${countPlacesColoreesTransformeesScolaire(eb)} +
    ${countPlacesColoreesTransformeesApprentissage(eb)}
  `;

export const countPlacesColoreesTransformeesQ4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  eb
    .case()
    .when(inQ4(eb))
    .then(countPlacesColoreesTransformees(eb))
    .else(0)
    .end();

// PLACES TRANSFORMÉES COLORÉES ET NON COLORÉES

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
    GREATEST(
      ${countPlacesColoreesTransformees(eb)},
      ${countPlacesNonColoreesTransformees(eb)}
    )
  `;

export const countPlacesTransformeesParCampagne = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne">;
}) =>
  eb
    .case()
    .when("campagne.annee", "=", "2023")
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
