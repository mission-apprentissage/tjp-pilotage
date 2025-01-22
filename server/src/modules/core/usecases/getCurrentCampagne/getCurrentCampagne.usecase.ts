import Boom from "@hapi/boom";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";

import type { RequestUser } from "@/modules/core/model/User";
import {getCurrentCampagne} from '@/modules/utils/getCurrentCampagne';



export const [getCurrentCampagneUsecase] = inject(
  {
    getCurrentCampagne,
  },
  (deps) => async (user: RequestUser) => {
    const campagneEnCours = await deps.getCurrentCampagne(user);
    if (!campagneEnCours) {
      throw Boom.badRequest("Aucune campagne nationale n'est en cours", {
        errors: {
          aucune_campagne_en_cours_existante:
            "Aucune campagne nationale n'est en cours",
        },
      });
    }
    return campagneEnCours;
  }
);
