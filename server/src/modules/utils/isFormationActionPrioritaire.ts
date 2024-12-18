import type { ExpressionBuilder } from "kysely";
import { expressionBuilder } from "kysely";

import type { DB } from "@/db/schema";

export function isFormationActionPrioritaire<EB extends ExpressionBuilder<DB, keyof DB>>({
  cfdRef,
  codeDispositifRef,
  codeRegionRef,
}: {
  cfdRef: Parameters<EB["ref"]>[0];
  codeDispositifRef: Parameters<EB["ref"]>[0];
  codeRegionRef: Parameters<EB["ref"]>[0];
}) {
  const eb = expressionBuilder<DB, keyof DB>();
  return eb
    .selectFrom("actionPrioritaire")
    .select("actionPrioritaire.cfd")
    .whereRef("actionPrioritaire.cfd", "=", cfdRef)
    .whereRef("actionPrioritaire.codeDispositif", "=", codeDispositifRef)
    .whereRef("actionPrioritaire.codeRegion", "=", codeRegionRef)
    .limit(1);
}
