import Boom from "@hapi/boom";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import type { CampagneType} from 'shared/schema/campagneSchema';

import { getCampagneEnCours } from "@/modules/core/queries/getCampagneEnCours";

import { getAnotherCampagneByAnneeQuery,updateCampagneQuery } from "./editCampagne.query";

export const [editCampagneUsecase] = inject(
  { updateCampagneQuery, getCampagneEnCours, getAnotherCampagneByAnneeQuery },
  (deps) =>
    async ({ campagne }: {campagne: CampagneType }) => {
      const existingCampagne = await deps.getAnotherCampagneByAnneeQuery({ id: campagne.id, annee: campagne.annee });
      if (existingCampagne) {
        throw Boom.badRequest(`Une campagne existe déjà pour l'année ${campagne.annee}`, {
          id: existingCampagne.id,
          errors: {
            campagne_similaire_existante: `Une campagne existe déjà pour l'année ${campagne.annee}`,
          },
        });
      }
      return await deps.updateCampagneQuery({
        id: campagne.id,
        campagne,
      });
    }
);
