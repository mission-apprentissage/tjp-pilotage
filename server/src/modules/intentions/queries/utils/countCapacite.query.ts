import { ExpressionBuilder, sql } from "kysely";

import { DB } from "../../../../db/schema";

export const countDifferenceCapaciteScolaire = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  sql<number>`abs(${eb.ref("demande.capaciteScolaire")} - ${eb.ref(
    "demande.capaciteScolaireActuelle"
  )})`;

export const countDifferenceCapaciteApprentissage = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  sql<number>`
  CASE WHEN
  ${eb.ref("demande.capaciteApprentissage")} - ${eb.ref(
    "demande.capaciteApprentissageActuelle"
  )} > 0
  THEN abs(${eb.ref("demande.capaciteApprentissage")} - ${eb.ref(
    "demande.capaciteApprentissageActuelle"
  )})
  ELSE 0
  END
  `;

export const countDifferenceCapaciteColoration = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  sql<number>`${eb.ref("demande.capaciteScolaireColoree")} + ${eb.ref(
    "demande.capaciteApprentissageColoree"
  )}`;

export const countDifferenceCapacite = ({
  eb,
  countColoration = false,
}: {
  eb: ExpressionBuilder<DB, "demande">;
  countColoration?: boolean;
}) =>
  sql<number>`${countDifferenceCapaciteScolaire(
    eb
  )} + ${countDifferenceCapaciteApprentissage} + ${
    countColoration ? countDifferenceCapaciteColoration(eb) : 0
  }`;
