import { z } from "zod";

import {CampagneSchema} from '../../schema/campagneSchema';

export const createCampagneSchema = {
  body: CampagneSchema,
  response: {
    200: z.void(),
  },
};
