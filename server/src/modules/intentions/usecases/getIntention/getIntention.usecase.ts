import type { Filters } from "./getIntention.query";
import { getIntentionQuery } from "./getIntention.query";

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
