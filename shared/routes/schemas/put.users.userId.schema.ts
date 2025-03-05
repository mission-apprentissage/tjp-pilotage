import { z } from "zod";

import { RoleZodType } from "../../enum/roleEnum";
import { UserFonctionZodType } from "../../enum/userFonctionEnum";

const BodySchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  email: z.string().email().toLowerCase(),
  role: RoleZodType,
  codeRegion: z.string().min(1).nullable(),
  enabled: z.boolean(),
  fonction: UserFonctionZodType.optional(),
});

export type BodySchema = z.infer<typeof BodySchema>;

export const editUserSchema = {
  params: z.object({
    userId: z.string(),
  }),
  body: BodySchema,
  response: {
    200: z.void(),
  },
};
