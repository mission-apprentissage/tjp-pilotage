
import {z} from 'zod';

import {CampagneSchema} from '../../schema/campagneSchema';

export const getCampagneSchema = {
  params: z.object({
    campagneId: z.string(),
  }),
  response: {
    200: CampagneSchema,
  },
};
