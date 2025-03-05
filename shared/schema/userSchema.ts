
import {z} from 'zod';

import { RoleZodType } from "../enum/roleEnum";


export const UserSchema = z.object({
  email: z.string(),
  id: z.string(),
  role: RoleZodType.optional(),
  codeRegion: z.string().optional(),
  uais: z.array(z.string()).optional(),
});

export type UserType = z.infer<typeof UserSchema>;
