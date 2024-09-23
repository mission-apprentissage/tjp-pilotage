import { PERMISSIONS, Role } from "shared";
import { z } from "zod";

const BodySchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  email: z.string().email().toLowerCase(),
  role: z.enum(Object.keys(PERMISSIONS) as [Role]),
  codeRegion: z.string().min(1).optional(),
});

export type BodySchema = z.infer<typeof BodySchema>;

export const createUserSchema = {
  body: BodySchema,
  response: {
    200: z.void(),
  },
};
