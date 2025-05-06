import * as Boom from "@hapi/boom";

import type { RequestUser } from "@/modules/core/model/User";
import { inject } from "@/utils/inject";

import { deleteCampagneRegionQuery } from "./deps/deleteCampagneRegion.dep";
import { getCampagneRegionQuery } from "./deps/getCampagneRegion.dep";

export const [deleteCampagneRegion, deleteCampagneRegionFactory] = inject(
  {
    getCampagneRegionQuery,
    deleteCampagneRegionQuery
  },
  (deps) => async ({id, user}:{id: string; user: RequestUser}) => {
    const campagneRegion = await deps.getCampagneRegionQuery(id);
    if (!campagneRegion) throw Boom.notFound("Campagne régionale non trouvée en base");
    if(user.codeRegion && campagneRegion.codeRegion !== user.codeRegion) throw Boom.forbidden("Vous n'avez pas les droits pour supprimer cette campagne régionale");
    await deps.deleteCampagneRegionQuery(id);
  }
);
