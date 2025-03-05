import * as Boom from "@hapi/boom";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import type { CampagneRegionSchema } from "shared/routes/schemas/post.campagnes-region.campagneRegionId.schema";
import type { CampagneType } from "shared/schema/campagneSchema";
import {isCampagneEnCours} from 'shared/utils/campagneUtils';

import { getCampagneEnCours } from "@/modules/core/queries/getCampagneEnCours";
import { getCampagneRegionEnCours } from "@/modules/core/queries/getCampagneRegionEnCours";
import { getSimilarCampagneRegion } from "@/modules/core/queries/getSimilarCampagneRegion";

import { insertCampagneRegion } from "./createCampagneRegion.query";

export const [createCampagneRegion, createCampagneRegionFactory] = inject(
  {
    insertCampagneRegion,
    getSimilarCampagneRegion,
    getCampagneRegionEnCours,
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
    const campagneRegionEnCours = await deps.getCampagneRegionEnCours(campagneRegion);
    if (campagneRegionEnCours && isCampagneEnCours(campagneRegion as unknown as CampagneType)) {
      throw Boom.badRequest("Une campagne régionale est déjà en cours", {
        id: campagneRegionEnCours.id,
        errors: {
          campagne_en_cours_existante:
            "Une campagne régionale est déjà en cours, veuillez la clôturer avant d'en créer une nouvelle.",
        },
      });
    }
    await insertCampagneRegion({
      data: campagneRegion,
    });
  }
);
