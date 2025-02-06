import Boom from "@hapi/boom";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import type { CampagneRegionSchema } from "shared/routes/schemas/put.campagnes-region.campagneRegionId.schema";

import { getCampagneEnCours } from "@/modules/core/queries/getCampagneEnCours";
import { getCampagneRegionEnCours } from "@/modules/core/queries/getCampagneRegionEnCours";

import {getAnotherCampagneRegionByAnneeAndCodeRegionQuery,getCampagneOfCampagneRegionQuery, updateCampagneRegionQuery } from './editCampagneRegion.query';


export const [editCampagneRegionUsecase] = inject(
  {
    updateCampagneRegionQuery,
    getCampagneOfCampagneRegionQuery,
    getCampagneEnCours,
    getCampagneRegionEnCours,
    getAnotherCampagneRegionByAnneeAndCodeRegionQuery
  },
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
      const campagneOfCampagneRegion = await deps.getCampagneOfCampagneRegionQuery({id : campagneRegion.id});
      if (!campagneOfCampagneRegion) {
        throw Boom.notFound(`Aucune campagne nationale pour la campagne régionale ${campagneRegion.id}`);
      }
      const existingCampagneRegion = await deps.getAnotherCampagneRegionByAnneeAndCodeRegionQuery({
        id: campagneRegion.id,
        annee: campagneOfCampagneRegion.annee,
        codeRegion: campagneRegion.codeRegion,
      });
      if (existingCampagneRegion) {
        throw Boom.badRequest(`Une campagne existe déjà pour l'année ${campagneOfCampagneRegion.annee}`, {
          id: existingCampagneRegion.id,
          errors: {
            campagne_region_similaire_existante: `Une autre campagne régionale existe déjà pour l'année ${campagneOfCampagneRegion.annee}`,
          },
        });
      }

      return await deps.updateCampagneRegionQuery({
        id: campagneRegion.id,
        campagneRegion,
      });
    }
);
