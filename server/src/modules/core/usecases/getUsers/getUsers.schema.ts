import type { Role } from "shared";
import { PERMISSIONS } from "shared";
import { z } from "zod";

const UserSchema = z.object({
  id: z.string(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string(),
  role: z.enum(Object.keys(PERMISSIONS) as [Role]).optional(),
  codeRegion: z.string().optional(),
  libelleRegion: z.string().optional(),
  createdAt: z.string().optional(),
  uais: z.array(z.string()).optional(),
  enabled: z.boolean(),
});

export const getUsersSchema = {
  querystring: z.object({
    offset: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    search: z.string().optional(),
    order: z.enum(["asc", "desc"]).optional(),
    orderBy: UserSchema.keyof().optional(),
  }),
  response: {
    200: z.object({
      count: z.number(),
      users: z.array(UserSchema),
    }),
  },
};
