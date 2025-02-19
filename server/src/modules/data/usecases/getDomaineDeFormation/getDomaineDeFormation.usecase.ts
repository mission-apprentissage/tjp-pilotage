import * as Boom from "@hapi/boom";
import type { QueryFilters } from "shared/routes/schemas/get.domaine-de-formation.codeNsf.schema";

import { getFilters, getFormations, getNsf } from "./dependencies";

const getDomaineDeFormationFactory =
  (
    deps = {
      getNsf,
      getFilters,
      getFormations,
    }
  ) =>
    async (codeNsf: string, queryFilters: QueryFilters) => {
      const { codeRegion, codeDepartement, codeAcademie } = queryFilters;
      const [nsf, filters, formations] = await Promise.all([
        deps.getNsf(codeNsf),
        deps.getFilters(),
        deps.getFormations({
          codeNsf,
          codeRegion,
          codeDepartement,
          codeAcademie,
        }),
      ]);

      if (!nsf) {
        throw Boom.notFound(`Le domaine de formation avec le code ${codeNsf} est inconnue`);
      }

      return {
        codeNsf,
        libelleNsf: nsf.libelleNsf,
        filters,
        formations,
      };
    };

export const getDomaineDeFormation = getDomaineDeFormationFactory();
