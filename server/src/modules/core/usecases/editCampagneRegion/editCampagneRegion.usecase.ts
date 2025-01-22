import Boom from "@hapi/boom";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";
import type { CampagneRegionSchema } from "shared/routes/schemas/put.campagnes-region.campagneRegionId.schema";

import { getCampagneEnCours } from "@/modules/core/queries/getCampagneEnCours";
import { getCampagneRegionEnCours } from "@/modules/core/queries/getCampagneRegionEnCours";

import { updateCampagneRegionQuery } from "./editCampagneRegion.query";

export const [editCampagneRegionUsecase] = inject(
  { updateCampagneRegionQuery, getCampagneEnCours, getCampagneRegionEnCours },
  (deps) =>
    async ({
      campagneRegion
    }: {
      campagneRegion: CampagneRegionSchema
    }) => {
      const campagneEnCours = await deps.getCampagneEnCours();
      if (!campagneEnCours) {
        throw Boom.badRequest("Aucune campagne nationale n'est en cours", {
          errors: {
            aucune_campagne_en_cours_existante:
                "Aucune campagne nationale n'est en cours",
          },
        });
      }
      const campagneRegionEnCours = await deps.getCampagneRegionEnCours(campagneRegion);
      if (campagneRegionEnCours && campagneRegion.statut === CampagneStatutEnum["en cours"]) {
        throw Boom.badRequest("Une campagne régionale est déjà en cours", {
          id: campagneRegionEnCours.id,
          errors: {
            campagne_en_cours_existante:
                "Une campagne régionale est déjà en cours, veuillez la clôturer avant d'en créer une nouvelle.",
          },
        });
      }

      return await deps.updateCampagneRegionQuery({
        id: campagneRegion.id,
        campagneRegion,
      });
    }
);
