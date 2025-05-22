
import {z} from 'zod';

import { RoleZodType } from "../enum/roleEnum";
import { UserFonctionZodType } from '../enum/userFonctionEnum';


export const UserSchema = z.object({
  email: z.string(),
  id: z.string(),
  role: RoleZodType.optional(),
  codeRegion: z.string().optional(),
  uais: z.array(z.string()).optional(),
  fonction: UserFonctionZodType.optional()
});

export type UserType = z.infer<typeof UserSchema>;
