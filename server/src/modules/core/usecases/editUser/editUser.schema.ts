import { PERMISSIONS, Role } from "shared";
import { z } from "zod";

const BodySchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  email: z.string().email(),
  role: z.enum(Object.keys(PERMISSIONS) as [Role]),
  codeRegion: z.string().min(1).nullable(),
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
