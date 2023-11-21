import { Insertable } from "kysely";

import { kdb } from "../../../../../../db/db";
import { DB, JsonValue } from "../../../../../../db/schema";

export const createIndicateurEntree = async (
  indicateurEntree: Omit<
    Insertable<DB["indicateurEntree"]>,
    "effectifs" | "capacites" | "premiersVoeux"
  > & {
    effectifs: JsonValue;
    capacites: JsonValue;
    premiersVoeux: JsonValue;
  }
) => {
  const formatted = {
    ...indicateurEntree,
    effectifs: JSON.stringify(indicateurEntree.effectifs),
    capacites: JSON.stringify(indicateurEntree.capacites),
    premiersVoeux: JSON.stringify(indicateurEntree.premiersVoeux),
  } as const;
  await kdb
    .insertInto("indicateurEntree")
    .values(formatted)
    .onConflict((oc) =>
      oc
        .column("formationEtablissementId")
        .column("rentreeScolaire")
        .doUpdateSet(formatted)
    )
    .execute();
};
