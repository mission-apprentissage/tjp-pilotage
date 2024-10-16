import Boom from "@hapi/boom";

import type { QueryFilters } from "@/modules/data/usecases/getDomaineDeFormation/getDomaineDeFormation.schema";

import { getFormation } from "./dependencies";

const getFormationFactory =
  (
    deps = {
      getFormation,
    }
  ) =>
  async (cfd: string, { codeAcademie, codeRegion, codeDepartement }: QueryFilters) => {
    const formation = await deps.getFormation({
      cfd,
      codeRegion,
      codeDepartement,
      codeAcademie,
    });

    if (!formation) {
      throw Boom.notFound(`La formation avec le cfd ${cfd} est inconnue`);
    }

    return formation;
  };

export const getFormationUsecase = getFormationFactory();
