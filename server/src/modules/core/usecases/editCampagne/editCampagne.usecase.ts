import * as Boom from "@hapi/boom";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";
import type { BodySchema } from "shared/routes/schemas/put.campagnes.campagneId.schema";

import { getCampagneEnCours } from "@/modules/core/queries/getCampagneEnCours";

import { updateCampagneQuery } from "./editCampagne.query";

export const [editCampagneUsecase] = inject(
  { updateCampagneQuery, getCampagneEnCours },
  (deps) =>
    async ({ campagneId, campagne }: { campagneId: string; campagne: BodySchema }) => {
      const campagneEnCours = await deps.getCampagneEnCours();
      if (campagneEnCours && campagneEnCours.id !== campagneId && campagne.statut === CampagneStatutEnum["en cours"]) {
        throw Boom.badRequest("Une campagne est déjà en cours", {
          id: campagneEnCours.id,
          errors: {
            campagne_en_cours_existante:
              "Une campagne est déjà en cours, veuillez la clôturer avant d'en créer une nouvelle.",
          },
        });
      }
      return await deps.updateCampagneQuery({
        campagneId,
        campagne,
      });
    }
);
