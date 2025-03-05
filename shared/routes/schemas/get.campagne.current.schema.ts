import { z } from 'zod';

import {CampagneSchema} from '../../schema/campagneSchema';

export const getCurrentCampagneSchema = {
  response: {
    200: z.object({
      current: CampagneSchema,
      previous: CampagneSchema
    }),
  },
};
