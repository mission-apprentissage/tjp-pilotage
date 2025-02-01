import { z } from "zod";

import { RoleZodType } from "../../enum/roleEnum";
import { UserFonctionZodType } from "../../enum/userFonctionEnum";

const BodySchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  email: z.string().email().toLowerCase(),
  role: RoleZodType,
  codeRegion: z.string().min(1).optional(),
  fonction: UserFonctionZodType.optional(),
});

export type BodySchema = z.infer<typeof BodySchema>;

export const createUserSchema = {
  body: BodySchema,
  response: {
    200: z.void(),
  },
};
