import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import type { JsonValue } from "@/db/schema";

export const createIndicateurEntree = async (
  indicateurEntree: Omit<Insertable<DB["indicateurEntree"]>, "effectifs" | "capacites" | "premiersVoeux"> & {
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
  await getKbdClient()
    .insertInto("indicateurEntree")
    .values(formatted)
    .onConflict((oc) => oc.column("formationEtablissementId").column("rentreeScolaire").doUpdateSet(formatted))
    .execute();
};
