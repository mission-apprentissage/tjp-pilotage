import type {FiltersSchema} from 'shared/routes/schemas/get.demande.numero.schema';
import type {z} from 'zod';

import type {RequestUser} from '@/modules/core/model/User';

import { getDemandeQuery } from "./getDemande.query";

export interface Filters extends z.infer<typeof FiltersSchema> {
  user: RequestUser;
}

const getDemandeFactory =
  (
    deps = {
      getDemandeQuery,
    }
  ) =>
    async ({ numero, user }: Filters) => {

      return await deps.getDemandeQuery({
        numero: numero,
        user,
      });
    };

export const getDemandeUsecase = getDemandeFactory();
