import * as Boom from "@hapi/boom";

import type { RequestUser } from "@/modules/core/model/User";
import {getCurrentCampagne, getPreviousCampagne} from '@/modules/utils/getCurrentCampagne';
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "@/utils/inject";



export const [getCurrentCampagneUsecase] = inject(
  {
    getCurrentCampagne,
    getPreviousCampagne
  },
  (deps) => async (user?: RequestUser) => {
    const campagneEnCours = await deps.getCurrentCampagne(user);
    if (!campagneEnCours) {
      throw Boom.badRequest("Aucune campagne nationale n'est en cours", {
        errors: {
          aucune_campagne_en_cours_existante:
            "Aucune campagne nationale n'est en cours",
        },
      });
    }
    const campagneTerminee = await getPreviousCampagne();

    return {
      current: campagneEnCours,
      previous: campagneTerminee
    };
  }
);
