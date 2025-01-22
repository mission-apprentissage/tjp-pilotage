import type { FiltersSchema} from 'shared/routes/schemas/get.intention.numero.schema';
import type {z} from 'zod';

import type {RequestUser} from '@/modules/core/model/User';

import { getIntentionQuery } from "./getIntention.query";

export interface Filters extends z.infer<typeof FiltersSchema> {
  user: RequestUser;
}
const getIntentionFactory =
  (
    deps = {
      getIntentionQuery,
    }
  ) =>
    async ({ numero, user }: Filters) => {
      return await deps.getIntentionQuery({
        numero: numero,
        user,
      });
    };

export const getIntentionUsecase = getIntentionFactory();
