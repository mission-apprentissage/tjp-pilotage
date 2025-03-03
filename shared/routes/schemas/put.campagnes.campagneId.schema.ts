import { z } from "zod";

import {CampagneSchema} from '../../schema/campagneSchema';

export const editCampagneSchema = {
  body: CampagneSchema,
  response: {
    200: z.void(),
  },
};
