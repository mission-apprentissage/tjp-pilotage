import { ExpressionBuilder, ExpressionWrapper, RawBuilder, sql } from "kysely";
import { DemandeTypeEnum } from "shared/enum/demandeTypeEnum";

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

export const countPlacesOuvertesTransitionEcologique = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`${countPlacesOuvertesScolaireTransitionEcologique(
      eb
    )} + ${countPlacesOuvertesApprentissageTransitionEcologique(eb)}`,
  });

export const countPlacesOuvertesScolaireTransitionEcologique = ({
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

export const countPlacesOuvertesApprentissageTransitionEcologique = ({
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

export const countPlacesOuvertes = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`${countPlacesOuvertesScolaire(
      eb
    )} + ${countPlacesOuvertesApprentissage(eb)}`,
  });

// TODO: remplacer par GREATEST((${eb.ref("demande.capaciteScolaire")} - ${eb.ref("demande.capaciteScolaireActuelle")}),0)
export const countPlacesOuvertesScolaire = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  exceptionColoration({
    eb,
    count: eb
      .case()
      .when(
        sql<number>`${eb.ref("demande.capaciteScolaire")} - ${eb.ref(
          "demande.capaciteScolaireActuelle"
        )}`,
        ">=",
        eb.val(0)
      )
      .then(
        sql<number>`${eb.ref("demande.capaciteScolaire")} -
    ${eb.ref("demande.capaciteScolaireActuelle")}`
      )
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
      .when(
        eb.and([
          eb(
            sql<number>`${eb.ref("demande.capaciteScolaire")} - ${eb.ref(
              "demande.capaciteScolaireActuelle"
            )}`,
            ">=",
            eb.val(0)
          ),
          eb(inQ1Q2(eb), "=", true),
        ])
      )
      .then(
        sql<number>`${eb.ref("demande.capaciteScolaire")} -
      ${eb.ref("demande.capaciteScolaireActuelle")}`
      )
      .else(0)
      .end(),
  });

export const countPlacesOuvertesApprentissage = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  exceptionColoration({
    eb,
    count: eb
      .case()
      .when(
        sql<number>`${eb.ref("demande.capaciteApprentissage")} - ${eb.ref(
          "demande.capaciteApprentissageActuelle"
        )}`,
        ">=",
        eb.val(0)
      )
      .then(
        sql<number>`${eb.ref("demande.capaciteApprentissage")} -
  ${eb.ref("demande.capaciteApprentissageActuelle")}`
      )
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
      .when(
        eb.and([
          eb(
            sql<number>`${eb.ref("demande.capaciteApprentissage")} - ${eb.ref(
              "demande.capaciteApprentissageActuelle"
            )}`,
            ">=",
            eb.val(0)
          ),
          inQ1Q2(eb),
        ])
      )
      .then(
        sql<number>`${eb.ref("demande.capaciteApprentissage")} -
    ${eb.ref("demande.capaciteApprentissageActuelle")}`
      )
      .else(0)
      .end(),
  });

export const countPlacesFermees = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  exceptionColoration({
    eb,
    count: sql<number>`${countPlacesFermeesScolaire(
      eb
    )} + ${countPlacesFermeesApprentissage(eb)}`,
  });

export const countPlacesFermeesScolaire = ({
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

export const countPlacesFermeesScolaireQ3Q4 = ({
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

export const countPlacesFermeesApprentissage = ({
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

export const countPlacesTransformees = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  sql<number>`${countPlacesOuvertesScolaire(eb)} + ${countPlacesFermeesScolaire(
    eb
  )} + ${countPlacesOuvertesApprentissage(
    eb
  )} + ${countPlacesFermeesApprentissage(eb)} + ${countPlacesOuvertesColorees(
    eb
  )}`;

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
  sql<number>`${countPlacesOuvertesScolaire(eb)} +
    ${countPlacesOuvertesApprentissage(eb)} -
    ${countPlacesFermeesScolaire(eb)}`;

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

export const countPlacesOuvertesScolairelaireColoree = ({
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

export const countPlacesOuvertesScolairelaireColoreeQ3Q4 = ({
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

export const countPlacesOuvertesApprentissageColoree = ({
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

export const countPlacesOuvertesApprentissageColoreeQ3Q4 = ({
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

export const countPlacesOuvertesColorees = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  sql<number>`${countPlacesOuvertesScolairelaireColoree(
    eb
  )} + ${countPlacesOuvertesApprentissageColoree(eb)}`;

export const countPlacesOuvertesColoreesQ3Q4 = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande" | "positionFormationRegionaleQuadrant">;
}) =>
  sql<number>`${countPlacesOuvertesScolairelaireColoreeQ3Q4(
    eb
  )} + ${countPlacesOuvertesApprentissageColoreeQ3Q4(eb)}`;

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
