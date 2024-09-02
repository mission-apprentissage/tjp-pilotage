import { ExpressionBuilder, ExpressionWrapper, RawBuilder, sql } from "kysely";
import { DemandeTypeEnum } from "shared/enum/demandeTypeEnum";

import { DB } from "../../db/db";

const inQ3Q4 = (
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">
) =>
  eb(eb.ref("positionFormationRegionaleQuadrant.positionQuadrant"), "in", [
    "Q3",
    "Q4",
  ]);

export const countOuverturesTransitionEcologique = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "rome">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`${countOuverturesScoTransitionEcologique(
      eb
    )} + ${countOuverturesApprentissageTransitionEcologique(eb)}`,
  });

export const countOuverturesScoTransitionEcologique = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "rome">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`
    CASE WHEN
    (${eb.ref("demande.capaciteScolaire")} - ${eb.ref(
      "demande.capaciteScolaireActuelle"
    )}) >= 0 AND (${eb.ref("rome.transitionEcologique")} = ${sql<true>`true`})
    THEN (${eb.ref("demande.capaciteScolaire")} -
    ${eb.ref("demande.capaciteScolaireActuelle")})
    ELSE 0
    END`,
  });

export const countOuverturesApprentissageTransitionEcologique = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "rome">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`
    CASE WHEN
    (${eb.ref("demande.capaciteApprentissage")} - ${eb.ref(
      "demande.capaciteApprentissageActuelle"
    )}) >= 0 AND (${eb.ref("rome.transitionEcologique")} = ${sql<true>`true`})
    THEN (${eb.ref("demande.capaciteApprentissage")} -
    ${eb.ref("demande.capaciteApprentissageActuelle")})
    ELSE 0
    END`,
  });

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

export const countFermeturesScoQ3Q4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  exceptionColoration({
    eb,
    count: eb
      .case()
      .when(
        eb.and([
          eb(
            sql<number>`${eb.ref("demande.capaciteScolaire")} - ${eb.ref(
              "demande.capaciteScolaireActuelle"
            )}`,
            ">=",
            eb.val(0)
          ),
          inQ3Q4(eb),
        ])
      )
      .then(
        eb.fn<number>("abs", [
          sql<number>`${eb.ref("demande.capaciteScolaire")} - ${eb.ref(
            "demande.capaciteScolaireActuelle"
          )}`,
        ])
      )
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
    count: eb
      .case()
      .when(
        eb.and([
          eb(
            "demande.capaciteApprentissage",
            "<=",
            eb.ref("demande.capaciteApprentissageActuelle")
          ),
          eb("campagne.annee", "!=", eb.val("2023")),
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
      .when(
        eb.and([
          eb(
            "demande.capaciteApprentissage",
            "<=",
            eb.ref("demande.capaciteApprentissageActuelle")
          ),
          eb("campagne.annee", "!=", eb.val("2023")),
          inQ3Q4(eb),
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
  eb
    .case()
    .when(
      eb.and([
        eb("demande.capaciteScolaireColoree", ">=", 0),
        eb("demande.typeDemande", "=", eb.val(DemandeTypeEnum.coloration)),
      ])
    )
    .then(eb.ref("demande.capaciteScolaireColoree"))
    .else(0)
    .end();

export const countOuverturesScolaireColoreeQ3Q4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  eb
    .case()
    .when(
      eb.and([
        eb("demande.capaciteScolaireColoree", ">=", 0),
        eb("demande.typeDemande", "=", eb.val(DemandeTypeEnum.coloration)),
        inQ3Q4(eb),
      ])
    )
    .then(eb.ref("demande.capaciteScolaireColoree"))
    .else(0)
    .end();

export const countOuverturesApprentissageColoree = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  eb
    .case()
    .when(
      eb.and([
        eb("demande.capaciteApprentissageColoree", ">=", 0),
        eb("demande.typeDemande", "=", eb.val(DemandeTypeEnum.coloration)),
      ])
    )
    .then(eb.ref("demande.capaciteApprentissageColoree"))
    .else(0)
    .end();

export const countOuverturesApprentissageColoreeQ3Q4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  eb
    .case()
    .when(
      eb.and([
        eb("demande.capaciteApprentissageColoree", ">=", 0),
        eb("demande.typeDemande", "=", eb.val(DemandeTypeEnum.coloration)),
        inQ3Q4(eb),
      ])
    )
    .then(eb.ref("demande.capaciteApprentissageColoree"))
    .else(0)
    .end();

export const countOuverturesColorees = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  sql<number>`${countOuverturesScolaireColoree(
    eb
  )} + ${countOuverturesApprentissageColoree(eb)}`;

export const countOuverturesColoreesQ3Q4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  sql<number>`${countOuverturesScolaireColoreeQ3Q4(
    eb
  )} + ${countOuverturesApprentissageColoreeQ3Q4(eb)}`;

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
