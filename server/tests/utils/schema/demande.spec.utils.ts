import { faker } from "@faker-js/faker";
import type { Insertable } from "kysely";
import { CURRENT_RENTREE } from "shared";
import type {DemandeStatutType} from "shared/enum/demandeStatutEnum";
import { DemandeStatutEnum  } from "shared/enum/demandeStatutEnum";
import type {TypeDemandeType} from "shared/enum/demandeTypeEnum";
import { DemandeTypeEnum  } from "shared/enum/demandeTypeEnum";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import type { RequestUser } from "@/modules/core/model/User";
import { generateId, generateShortId } from "@/modules/utils/generateId";
import {getCurrentCampagne} from '@/modules/utils/getCurrentCampagne';
import { cleanNull } from "@/utils/noNull";

export type Demande = Insertable<DB["demande"]>;

export function createDemandeBuilder(
  user: RequestUser,
  defaultDemande: Partial<Demande> = {}
) {
  const demande: Demande = {
    id: defaultDemande.id ?? generateId(),
    numero: defaultDemande.numero ?? generateShortId(),
    statut: defaultDemande.statut ?? DemandeStatutEnum["brouillon"],
    updatedAt: defaultDemande.updatedAt ?? new Date(),
    createdBy: defaultDemande.createdBy ?? user.id,
    updatedBy: defaultDemande.updatedBy ?? user.id,
    uai: defaultDemande.uai ?? "0820917B", //
    codeRegion: defaultDemande.codeRegion ?? "76", //
    cfd: defaultDemande.cfd ?? "32031309", // Professions immobilières
    rentreeScolaire:
      defaultDemande.rentreeScolaire ?? Number(CURRENT_RENTREE),
    typeDemande: defaultDemande.typeDemande ?? DemandeTypeEnum["ouverture_nette"],
    mixte: defaultDemande?.mixte,
    coloration: defaultDemande?.coloration ?? false,
    reconversionRH: defaultDemande?.reconversionRH ?? false,
    codeDispositif: defaultDemande?.codeDispositif ?? "320",
    capaciteScolaire: defaultDemande?.capaciteScolaire ?? 12,
    capaciteScolaireActuelle: defaultDemande?.capaciteScolaireActuelle ?? 0,
    motif: defaultDemande?.motif ?? ["Ouverture nette"],
    campagneId: defaultDemande?.campagneId ?? faker.string.uuid(),
    isOldDemande: defaultDemande?.isOldDemande ?? false,
    ...defaultDemande,
  };

  return {
    withUai: (uai: string | undefined) =>
      createDemandeBuilder(user, { ...demande, uai }),
    withCfd: (cfd: string | null | undefined) =>
      createDemandeBuilder(user, { ...demande, cfd }),
    withId: (id: string = generateId()) =>
      createDemandeBuilder(user, { ...demande, id }),
    withNumero: (numero: string = generateShortId()) =>
      createDemandeBuilder(user, { ...demande, numero }),
    withStatut: (statut: DemandeStatutType) =>
      createDemandeBuilder(user, { ...demande, statut }),
    withCurrentCampagneId: async () => {
      const campagne = await getCurrentCampagne(user);
      return createDemandeBuilder(user, {
        ...demande,
        campagneId: campagne.id,
      });
    },
    withCampagneId: (campagneId: string | null | undefined) =>
      createDemandeBuilder(user, { ...demande, campagneId }),
    withTypeDemande: (typeDemande: TypeDemandeType) =>
      createDemandeBuilder(user, { ...demande, typeDemande }),
    withCodeRegion: (codeRegion: string | undefined) =>
      createDemandeBuilder(user, { ...demande, codeRegion }),
    injectInDB: async () => {
      const result = await getKbdClient()
        .insertInto("demande")
        .values(demande)
        .returningAll()
        .executeTakeFirstOrThrow();

      return createDemandeBuilder(user, result);
    },
    build: () => cleanNull(demande),
  };
}

export async function clearDemandes() {
  await getKbdClient().deleteFrom("avis").execute();
  await getKbdClient().deleteFrom("demandeAccessLog").execute();
  await getKbdClient().deleteFrom("changementStatut").execute();
  await getKbdClient().deleteFrom("demande").execute();
}
