import Boom from "@hapi/boom";

import { getFilters, getNsf } from "./dependencies";

const getDomaineDeFormationFactory =
  (
    deps = {
      getNsf,
      getFilters,
    }
  ) =>
  async (codeNsf: string) => {
    const [nsf, filters] = await Promise.all([
      deps.getNsf(codeNsf),
      deps.getFilters(),
    ]);

    if (!nsf) {
      throw Boom.notFound(
        `Le domaine de formation avec le code ${codeNsf} est inconnue`
      );
    }

    return {
      codeNsf,
      libelleNsf: nsf.libelleNsf,
      filters,
    };
  };

export const getDomaineDeFormation = getDomaineDeFormationFactory();
