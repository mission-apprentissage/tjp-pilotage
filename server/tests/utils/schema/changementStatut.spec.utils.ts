// Créé un builder qui va permettre de pouvoir insérer en db un changement de statut
// et de récupérer un changement de statut
import type { Insertable } from "kysely";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import type { RequestUser } from "@/modules/core/model/User";
import { generateId } from "@/modules/utils/generateId";

export type ChangementStatut = Insertable<DB["changementStatut"]>;

export function buildChangementStatut(user?: RequestUser, defaultChangementStatut: Partial<ChangementStatut> = {}) {
  const changementStatut: ChangementStatut = {
    id: defaultChangementStatut.id ?? generateId(),
    intentionNumero: defaultChangementStatut.intentionNumero ?? "",
    statut: defaultChangementStatut.statut ?? "brouillon",
    updatedAt: defaultChangementStatut.updatedAt ?? new Date(),
    createdBy: defaultChangementStatut.createdBy ?? user?.id,
  };

  return {
    withNumero: (numero: string) =>
      buildChangementStatut(user, { ...changementStatut, intentionNumero: numero }),
    withStatut: (statut: DemandeStatutType) =>
      buildChangementStatut(user, { ...changementStatut, statut }),
    injectInDB: async () => {
      const result = await getKbdClient()
        .insertInto("changementStatut")
        .values(changementStatut)
        .returningAll()
        .executeTakeFirstOrThrow();
      return buildChangementStatut(user, result);
    },
    build: () => changementStatut,
  };
}

export async function clearChangementStatut() {
  await getKbdClient().deleteFrom("changementStatut").execute();
}
