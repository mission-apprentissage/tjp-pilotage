import { Filters, getDemandeExpeQuery } from "./getDemandeExpe.query";

const getDemandeExpeFactory =
  (
    deps = {
      getDemandeExpeQuery,
    }
  ) =>
  async ({ numero, user }: Filters) => {
    return await deps.getDemandeExpeQuery({
      numero: numero,
      user,
    });
  };

export const getDemandeExpeUsecase = getDemandeExpeFactory();
