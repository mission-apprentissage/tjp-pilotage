import { z } from "zod";

import {OrderZodType} from '../../enum/orderEnum';
import { RoleZodType } from "../../enum/roleEnum";
import {  UserFonctionZodType } from "../../enum/userFonctionEnum";

export const UserSchema = z.object({
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
  fonction: UserFonctionZodType.optional(),
});

export const getUsersSchema = {
  querystring: z.object({
    offset: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    search: z.string().optional(),
    order: OrderZodType.optional(),
    orderBy: UserSchema.keyof().optional(),
  }),
  response: {
    200: z.object({
      count: z.number(),
      users: z.array(UserSchema),
    }),
  },
};
