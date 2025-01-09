import type { Insertable } from "kysely";
import type { AvisStatutType } from "shared/enum/avisStatutEnum";
import type { AvisTypeType } from "shared/enum/avisTypeEnum";

import type { DB } from "@/db/db";
import type { RequestUser } from "@/modules/core/model/User";
import { generateId, generateShortId } from "@/modules/utils/generateId";

export type Avis = Insertable<DB["avis"]>;

export function buildAvis(user?: RequestUser, defaultAvis: Partial<Avis> = {}) {
  const avis: Avis = {
    id: defaultAvis.id ?? generateId(),
    intentionNumero: defaultAvis.intentionNumero ?? generateShortId(),
    statutAvis: defaultAvis.statutAvis ?? "favorable",
    typeAvis: defaultAvis.typeAvis ?? "préalable",
    isVisibleParTous: defaultAvis.isVisibleParTous ?? true,
    updatedAt: defaultAvis.updatedAt ?? new Date(),
    createdBy: defaultAvis.createdBy ?? user?.id,
    updatedBy: defaultAvis.updatedBy ?? user?.id,
  };

  return {
    withNumero: (numero: string) =>
      buildAvis(user, { ...avis, intentionNumero: numero }),
    withType: (type: AvisTypeType) =>
      buildAvis(user, { ...avis, typeAvis: type }),
    withStatus: (status: AvisStatutType) =>
      buildAvis(user, { ...avis, statutAvis: status }),
    build: () => avis,
  };
}
