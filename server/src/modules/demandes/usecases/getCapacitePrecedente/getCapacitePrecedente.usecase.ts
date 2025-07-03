import type { FiltersSchema} from 'shared/routes/schemas/get.capacite-precedente.schema';
import type { z } from 'zod';

import { getCapacitePrecedenteQuery } from "./getCapacitePrecedente.query";

export type Filters = z.infer<typeof FiltersSchema>;

const getCapacitePrecedenteFactory =
  (
    deps = {
      getCapacitePrecedenteQuery,
    }
  ) =>
    async (filters: Filters) => await deps.getCapacitePrecedenteQuery(filters);

export const getCapacitePrecedenteUsecase = getCapacitePrecedenteFactory();
