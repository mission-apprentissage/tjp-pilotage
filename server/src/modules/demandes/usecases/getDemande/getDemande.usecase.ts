import type { Filters } from "./getDemande.query";
import { getDemandeQuery } from "./getDemande.query";

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
