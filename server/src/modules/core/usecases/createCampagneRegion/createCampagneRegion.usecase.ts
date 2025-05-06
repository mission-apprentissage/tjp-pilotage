import * as Boom from "@hapi/boom";
import type { CampagneRegionSchema } from "shared/routes/schemas/post.campagnes-region.campagneRegionId.schema";

import { getCampagneEnCours } from "@/modules/core/queries/getCampagneEnCours";
import { getSimilarCampagneRegion } from "@/modules/core/queries/getSimilarCampagneRegion";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "@/utils/inject";

import { insertCampagneRegion } from "./createCampagneRegion.query";

export const [createCampagneRegion, createCampagneRegionFactory] = inject(
  {
    insertCampagneRegion,
    getSimilarCampagneRegion,
    getCampagneEnCours
  },
  (deps) => async (campagneRegion: CampagneRegionSchema) => {
    const campagneEnCours = await deps.getCampagneEnCours();
    if (!campagneEnCours) {
      throw Boom.badRequest("Aucune campagne nationale n'est en cours", {
        errors: {
          aucune_campagne_en_cours_existante:
            "Aucune campagne nationale n'est en cours",
        },
      });
    }
    const existingCampagneRegion = await deps.getSimilarCampagneRegion({ data: campagneRegion });
    if (existingCampagneRegion) {
      throw Boom.badRequest(
        `Une campagne régionale similaire existe déjà pour l'année ${existingCampagneRegion.annee}
        et pour la région ${existingCampagneRegion.region}`,
        {
          id: existingCampagneRegion.id,
          errors: {
            campagne_similaire_existante:
              `Une campagne similaire existe déjà pour l'année ${existingCampagneRegion.annee}
              et pour la région ${existingCampagneRegion.region}`,
          },
        });
    }
    await insertCampagneRegion({
      data: campagneRegion,
    });
  }
);
