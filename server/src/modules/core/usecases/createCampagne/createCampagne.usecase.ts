import * as Boom from "@hapi/boom";
import type { createCampagneSchema } from "shared/routes/schemas/post.campagnes.campagneId.schema";
import type {z} from 'zod';

import { getCampagneEnCours } from "@/modules/core/queries/getCampagneEnCours";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "@/utils/inject";

import { getCampagneByAnneeQuery, insertCampagneQuery } from './createCampagne.query';



export const [createCampagne, createCampagneFactory] = inject(
  {
    insertCampagneQuery,
    getCampagneByAnneeQuery,
    getCampagneEnCours,
  },
  (deps) => async (campagne: z.infer<typeof createCampagneSchema.body>) => {
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
