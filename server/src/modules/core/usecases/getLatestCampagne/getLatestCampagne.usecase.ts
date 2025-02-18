// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";

import { getLatestCampagneQuery } from "./getLatestCampagne.query";

export const [getLatestCampagneUsecase] = inject(
  {
    getLatestCampagneQuery,
  },
  (deps) => async () => {
    return deps.getLatestCampagneQuery();
  }
);
