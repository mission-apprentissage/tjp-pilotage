import { PERMISSIONS, Role } from "shared";
import { z } from "zod";

export const getUsersSchema = {
  querystring: z.object({
    offset: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    search: z.string().optional(),
  }),
  response: {
    200: z.object({
      count: z.number(),
      users: z.array(
        z.object({
          id: z.string(),
          firstname: z.string().optional(),
          lastname: z.string().optional(),
          email: z.string(),
          role: z.enum(Object.keys(PERMISSIONS) as [Role]).optional(),
          codeRegion: z.string().optional(),
          createdAt: z.string().optional(),
        })
      ),
    }),
  },
};
