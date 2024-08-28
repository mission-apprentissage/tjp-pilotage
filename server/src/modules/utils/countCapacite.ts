import { ExpressionBuilder, ExpressionWrapper, RawBuilder, sql } from "kysely";

import { DB } from "../../db/db";

export const countOuvertures = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`${countOuverturesSco(
      eb
    )} + ${countOuverturesApprentissage(eb)}`,
  });

export const countOuverturesSco = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`
    CASE WHEN
    (${eb.ref("demande.capaciteScolaire")} - ${eb.ref(
      "demande.capaciteScolaireActuelle"
    )}) >= 0
    THEN (${eb.ref("demande.capaciteScolaire")} -
    ${eb.ref("demande.capaciteScolaireActuelle")})
    ELSE 0
    END`,
  });

export const countOuverturesApprentissage = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`
    CASE WHEN
    (${eb.ref("demande.capaciteApprentissage")} - ${eb.ref(
      "demande.capaciteApprentissageActuelle"
    )}) >= 0
    THEN (${eb.ref("demande.capaciteApprentissage")} -
    ${eb.ref("demande.capaciteApprentissageActuelle")})
    ELSE 0
    END`,
  });

export const countFermetures = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`${countFermeturesSco(
      eb
    )} + ${countFermeturesApprentissage(eb)}`,
  });

export const countFermeturesSco = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`
    CASE WHEN
    (${eb.ref("demande.capaciteScolaire")} - ${eb.ref(
      "demande.capaciteScolaireActuelle"
    )}) <= 0
    THEN abs(${eb.ref("demande.capaciteScolaire")} - ${eb.ref(
      "demande.capaciteScolaireActuelle"
    )})
    ELSE 0
    END`,
  });

export const countFermeturesApprentissage = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "campagne">;
}) =>
  exceptionColoration({
    eb,
    count: eb
      .case()
      .when(
        eb.and([
          eb(
            "demande.capaciteApprentissage",
            "<=",
            eb.ref("demande.capaciteApprentissageActuelle")
          ),
          eb("campagne.annee", "=", eb.val("2023")),
        ])
      )
      .then(
        sql<number>`abs(${eb.ref("demande.capaciteApprentissage")} - ${eb.ref(
          "demande.capaciteApprentissageActuelle"
        )})`
      )
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
    count: sql<number>`(${eb.ref("demande.capaciteScolaire")} - ${eb.ref(
      "demande.capaciteScolaireActuelle"
    )})`,
  });

export const countDifferenceCapaciteApprentissage = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`(${eb.ref("demande.capaciteApprentissage")} - ${eb.ref(
      "demande.capaciteApprentissageActuelle"
    )})`,
  });

export const countDifferenceCapacite = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`ABS(
      ${eb.ref("demande.capaciteScolaire")}
      -${eb.ref("demande.capaciteScolaireActuelle")})
      +GREATEST(${eb.ref("demande.capaciteApprentissage")}
      -${eb.ref("demande.capaciteApprentissageActuelle")}, 0)`,
  });

export const countDifferenceCapaciteScolaireIntention = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "intention">;
}) =>
  exceptionColorationIntention({
    eb,
    count: sql<number>`(${eb.ref("intention.capaciteScolaire")} - ${eb.ref(
      "intention.capaciteScolaireActuelle"
    )})`,
  });

export const countPlacesTransformeesCampagne2023 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  sql<number>`${countOuverturesSco(eb)} +
    ${countOuverturesApprentissage(eb)} -
    ${countFermeturesSco(eb)}`;

export const countDifferenceCapaciteApprentissageIntention = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "intention">;
}) =>
  exceptionColorationIntention({
    eb,
    count: sql<number>`(${eb.ref("intention.capaciteApprentissage")} - ${eb.ref(
      "intention.capaciteApprentissageActuelle"
    )})`,
  });

export const countOuverturesScolaireColoree = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  sql<number>`
    CASE WHEN
      (${eb.ref("demande.capaciteScolaireColoree")}) >= 0
    THEN
      (
        ${eb.ref("demande.capaciteScolaireColoree")}
      )
    ELSE 0
    END`;

export const countOuverturesApprentissageColoree = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  sql<number>`
    CASE WHEN
      (${eb.ref("demande.capaciteApprentissageColoree")}) >= 0
    THEN
      (
        ${eb.ref("demande.capaciteApprentissageColoree")}
      )
    ELSE 0
    END`;

export const countOuverturesColorees = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  sql<number>`${countOuverturesScolaireColoree(
    eb
  )} + ${countOuverturesApprentissageColoree(eb)}`;

const exceptionColoration = ({
  eb,
  count,
}: {
  eb: ExpressionBuilder<DB, "demande">;
  count:
    | RawBuilder<number>
    | ExpressionWrapper<DB, "demande" | "campagne", number>;
}) =>
  sql<number>`CASE WHEN ${eb.ref("demande.typeDemande")} = 'coloration'
    THEN 0
    ELSE ${count}
    END`;

const exceptionColorationIntention = ({
  eb,
  count,
}: {
  eb: ExpressionBuilder<DB, "intention">;
  count: RawBuilder<number>;
}) =>
  sql<number>`CASE WHEN ${eb.ref("intention.typeDemande")} = 'coloration'
      THEN 0
      ELSE ${count}
      END`;
