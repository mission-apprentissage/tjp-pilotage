import * as Boom from "@hapi/boom";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import type { CampagneType} from 'shared/schema/campagneSchema';

import { getCampagneEnCours } from "@/modules/core/queries/getCampagneEnCours";

import { getCampagneByAnneeQuery, insertCampagneQuery } from './createCampagne.query';



export const [createCampagne, createCampagneFactory] = inject(
  {
    insertCampagneQuery,
    getCampagneByAnneeQuery,
    getCampagneEnCours,
  },
  (deps) => async (campagne: CampagneType) => {
    const existingCampagne = await deps.getCampagneByAnneeQuery({ annee: campagne.annee });
    if (existingCampagne) {
      throw Boom.badRequest(`Une campagne existe déjà pour l'année ${campagne.annee}`, {
        id: existingCampagne.id,
        errors: {
          campagne_similaire_existante: `Une campagne existe déjà pour l'année ${campagne.annee}`,
        },
      });
    }
    await insertCampagneQuery({
      data: campagne,
    });
  }
);
