import { z } from "zod";

import {CampagneSchema} from '../../schema/campagneSchema';

export const getCampagnesSchema = {
  response: {
    200: z.array(CampagneSchema),
  },
};
