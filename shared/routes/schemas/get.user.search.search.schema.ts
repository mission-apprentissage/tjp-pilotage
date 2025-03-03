import { z } from "zod";

import { RoleZodType } from "../../enum/roleEnum";

const UserSchema = z.object({
  id: z.string(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string(),
  role: RoleZodType.optional(),
  codeRegion: z.string().optional(),
  libelleRegion: z.string().optional(),
  createdAt: z.string().optional(),
  uais: z.array(z.string()).optional(),
  enabled: z.boolean(),
});

export const searchUserSchema = {
  params: z.object({
    search: z.string(),
  }),
  response: {
    200: z.array(UserSchema),
  },
};
