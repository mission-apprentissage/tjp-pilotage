import { getCurrentCampagneQuery } from "../../queries/getCurrentCampagne/getCurrentCampagne.query";
const getDefaultCampagneFactory =
  (
    deps = {
      getCurrentCampagneQuery,
    }
  ) =>
  async () => {
    const currentCampagne = await deps.getCurrentCampagneQuery();
    return currentCampagne;
  };

export const getDefaultCampagneUsecase = getDefaultCampagneFactory();
