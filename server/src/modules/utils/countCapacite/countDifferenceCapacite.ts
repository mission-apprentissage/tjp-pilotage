import type { ExpressionBuilder } from "kysely";
import { sql } from "kysely";

import type { DB } from "@/db/db";

// DIFFÉRENCES CAPACITÉS

export const countDifferenceCapaciteScolaire = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  sql<number>`
    ${eb.ref("demande.capaciteScolaire")} -
    ${eb.ref("demande.capaciteScolaireActuelle")}
  `;

export const countDifferenceCapaciteScolaireColoree = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  sql<number>`
    ${eb.ref("demande.capaciteScolaireColoree")} -
    ${eb.ref("demande.capaciteScolaireColoreeActuelle")}
  `;

export const countDifferenceCapaciteScolaireCorrection = ({ eb }: { eb: ExpressionBuilder<DB, "correction"> }) =>
  sql<number>`
    ${eb.ref("correction.capaciteScolaire")} -
    ${eb.ref("correction.capaciteScolaireActuelle")}
  `;

export const countDifferenceCapaciteApprentissage = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  sql<number>`
      ${eb.ref("demande.capaciteApprentissage")} -
      ${eb.ref("demande.capaciteApprentissageActuelle")}
    `;

export const countDifferenceCapaciteApprentissageColoree = ({ eb }: { eb: ExpressionBuilder<DB, "demande"> }) =>
  sql<number>`
    ${eb.ref("demande.capaciteApprentissageColoree")} -
    ${eb.ref("demande.capaciteApprentissageColoreeActuelle")}
  `;

export const countDifferenceCapaciteApprentissageCorrection = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "correction">;
}) => sql<number>`
    ${eb.ref("correction.capaciteApprentissage")} -
    ${eb.ref("correction.capaciteApprentissageActuelle")}
  `;

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
