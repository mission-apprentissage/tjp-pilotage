import { ExpressionBuilder, sql } from "kysely";

import { DB } from "../../db/schema";

export const countOuvertures = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  sql<number>`${countOuverturesSco(eb)} + ${countOuverturesApprentissage(eb)}`;

export const countOuverturesSco = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) => sql<number>`
    CASE WHEN
    (${eb.ref("demande.capaciteScolaire")} - ${eb.ref(
      "demande.capaciteScolaireActuelle"
    )}) >= 0
    THEN (${eb.ref("demande.capaciteScolaire")} -
    ${eb.ref("demande.capaciteScolaireActuelle")})
    ELSE 0
    END`;

export const countOuverturesApprentissage = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) => sql<number>`
    CASE WHEN
    (${eb.ref("demande.capaciteApprentissage")} - ${eb.ref(
      "demande.capaciteApprentissageActuelle"
    )}) >= 0
    THEN (${eb.ref("demande.capaciteApprentissage")} -
    ${eb.ref("demande.capaciteApprentissageActuelle")})
    ELSE 0
    END`;

export const countFermetures = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  sql<number>`${countFermeturesSco(eb)} + ${countFermeturesApprentissage(eb)}`;

export const countFermeturesSco = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) => sql<number>`
    CASE WHEN
    (${eb.ref("demande.capaciteScolaire")} - ${eb.ref(
      "demande.capaciteScolaireActuelle"
    )}) <= 0
    THEN abs(${eb.ref("demande.capaciteScolaire")} - ${eb.ref(
      "demande.capaciteScolaireActuelle"
    )})
    ELSE 0
    END`;

export const countFermeturesApprentissage = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) => sql<number>`
    CASE WHEN
    (${eb.ref("demande.capaciteApprentissage")} - ${eb.ref(
      "demande.capaciteApprentissageActuelle"
    )}) <= 0
    THEN abs(${eb.ref("demande.capaciteApprentissage")} - ${eb.ref(
      "demande.capaciteApprentissageActuelle"
    )})
    ELSE 0
    END`;

export const countDifferenceCapaciteScolaire = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  sql<number>`(${eb.ref("demande.capaciteScolaire")} - ${eb.ref(
    "demande.capaciteScolaireActuelle"
  )})`;

export const countDifferenceCapaciteApprentissage = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "demande">;
}) =>
  sql<number>`(${eb.ref("demande.capaciteApprentissage")} - ${eb.ref(
    "demande.capaciteApprentissageActuelle"
  )})`;
