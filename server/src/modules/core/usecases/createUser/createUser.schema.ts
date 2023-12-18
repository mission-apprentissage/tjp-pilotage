import { PERMISSIONS, Role } from "shared";
import { z } from "zod";

const BodySchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.string(),
  role: z.enum(Object.keys(PERMISSIONS) as [Role]),
  codeRegion: z.string().optional(),
});

export type BodySchema = z.infer<typeof BodySchema>;

export const createUserSchema = {
  body: BodySchema,
  response: {
    200: z.void(),
  },
};
