import { faker } from "@faker-js/faker";
import type { Insertable } from "kysely";
import { CURRENT_RENTREE } from "shared";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import type { DemandeType } from "shared/enum/demandeTypeEnum";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import type { RequestUser } from "@/modules/core/model/User";
import { getCurrentCampagneQuery } from "@/modules/data/queries/getCurrentCampagne/getCurrentCampagne.query";
import { generateId, generateShortId } from "@/modules/utils/generateId";
import { cleanNull } from "@/utils/noNull";

export type Intention = Insertable<DB["intention"]>;


export function createIntentionBuilder(user: RequestUser, defaultIntention: Partial<Intention> = {}){
  const intention: Intention = {
    id: defaultIntention.id ?? generateId(),
    numero: defaultIntention.numero ?? generateShortId(),
    statut: defaultIntention.statut ?? "brouillon",
    updatedAt: defaultIntention.updatedAt ?? new Date(),
    createdBy: defaultIntention.createdBy ?? user.id,
    updatedBy: defaultIntention.updatedBy ?? user.id,
    uai: defaultIntention.uai ?? "0820917B", //
    cfd: defaultIntention.cfd ?? "32031309", // Professions immobilières
    rentreeScolaire: defaultIntention.rentreeScolaire ?? Number(CURRENT_RENTREE),
    typeDemande: defaultIntention.typeDemande ?? "ouverture_nette",
    mixte: defaultIntention?.mixte,
    coloration: defaultIntention?.coloration ?? false,
    reconversionRH: defaultIntention?.reconversionRH ?? false,
    codeDispositif: defaultIntention?.codeDispositif ?? "320",
    capaciteScolaire: defaultIntention?.capaciteScolaire ?? 12,
    capaciteScolaireActuelle: defaultIntention?.capaciteScolaireActuelle ?? 0,
    motif: defaultIntention?.motif ?? ["Ouverture nette"],
    campagneId: defaultIntention?.campagneId ?? faker.string.uuid(),
    ...defaultIntention,
  };

  return {
    withUai: (uai: string | null | undefined) => createIntentionBuilder(user, { ...intention, uai }),
    withCfd: (cfd: string | null | undefined) => createIntentionBuilder(user, { ...intention, cfd }),
    withId: (id: string  = generateId()) => createIntentionBuilder(user, { ...intention, id }),
    withNumero: (numero: string = generateShortId()) => createIntentionBuilder(user, { ...intention, numero }),
    withStatut: (statut: DemandeStatutType) => createIntentionBuilder(user, { ...intention, statut }),
    withCurrentCampagneId: async () => {
      const campagne = await getCurrentCampagneQuery();
      return createIntentionBuilder(user, { ...intention, campagneId: campagne.id });
    },
    withCampagneId: (campagneId: string | null | undefined) => createIntentionBuilder(user, { ...intention, campagneId }),
    withTypeDemande: (typeDemande: DemandeType) => createIntentionBuilder(user, { ...intention, typeDemande }),
    injectInDB: async () => {
      const result = await getKbdClient()
        .insertInto("intention")
        .values(intention)
        .returningAll()
        .executeTakeFirstOrThrow();

      return createIntentionBuilder(user, result);
    },
    toJSON: () => cleanNull(intention),
  };
}



export async function clearIntentions() {
  await getKbdClient().deleteFrom("avis").execute();
  await getKbdClient().deleteFrom("intentionAccessLog").execute();
  await getKbdClient().deleteFrom("changementStatut").execute();
  await getKbdClient().deleteFrom("intention").execute();
}
