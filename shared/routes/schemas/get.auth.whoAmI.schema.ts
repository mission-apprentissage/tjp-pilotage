import { z } from "zod";

import { UserSchema } from "../../schema/userSchema";

export const whoAmISchema = {
  response: {
    200: z.object({
      user: UserSchema,
    }).optional(),
  },
};
