import { getCurrentCampagneQuery } from "../../queries/getCurrentCampagne/getCurrentCampagne.query";
import { getDefaultCampagneQuery } from "./getDefaultCampagne.query";
const getDefaultCampagneFactory =
  (
    deps = {
      getDefaultCampagneQuery,
      getCurrentCampagneQuery,
    }
  ) =>
  async () => {
    const currentCampagne = await deps.getCurrentCampagneQuery();
    if (currentCampagne) {
      return currentCampagne;
    }
    return await deps.getDefaultCampagneQuery();
  };

export const getDefaultCampagneUsecase = getDefaultCampagneFactory();
