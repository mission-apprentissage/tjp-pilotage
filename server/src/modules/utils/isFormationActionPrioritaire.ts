import type { ExpressionBuilder } from "kysely";

import type { DB } from "@/db/schema";

export const isFormationActionPrioritaireDemande = (eb: ExpressionBuilder<DB, "demande">) =>
  eb
    .selectFrom("actionPrioritaire")
    .select("actionPrioritaire.cfd")
    .whereRef("actionPrioritaire.cfd", "=", "demande.cfd")
    .whereRef("actionPrioritaire.codeDispositif", "=", "demande.codeDispositif")
    .whereRef("actionPrioritaire.codeRegion", "=", "demande.codeRegion")
    .limit(1);

export const isFormationActionPrioritaireIntention = (eb: ExpressionBuilder<DB, "intention">) =>
  eb
    .selectFrom("actionPrioritaire")
    .select("actionPrioritaire.cfd")
    .whereRef("actionPrioritaire.cfd", "=", "intention.cfd")
    .whereRef("actionPrioritaire.codeDispositif", "=", "intention.codeDispositif")
    .whereRef("actionPrioritaire.codeRegion", "=", "intention.codeRegion")
    .limit(1);

export const isFormationActionPrioritaireEtablissement = (
  eb: ExpressionBuilder<DB, "formationEtablissement" | "etablissement">
) =>
  eb
    .selectFrom("actionPrioritaire")
    .select("actionPrioritaire.cfd")
    .whereRef("actionPrioritaire.cfd", "=", "formationEtablissement.cfd")
    .whereRef("actionPrioritaire.codeDispositif", "=", "formationEtablissement.codeDispositif")
    .whereRef("actionPrioritaire.codeRegion", "=", "etablissement.codeRegion")
    .limit(1);

export const isFormationActionPrioritaireDataEtablissement = (
  eb: ExpressionBuilder<DB, "formationEtablissement" | "dataEtablissement">
) =>
  eb
    .selectFrom("actionPrioritaire")
    .select("actionPrioritaire.cfd")
    .whereRef("actionPrioritaire.cfd", "=", "formationEtablissement.cfd")
    .whereRef("actionPrioritaire.codeDispositif", "=", "formationEtablissement.codeDispositif")
    .whereRef("actionPrioritaire.codeRegion", "=", "dataEtablissement.codeRegion")
    .limit(1);
