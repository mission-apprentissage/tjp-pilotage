import type { MILLESIMES_IJ } from "shared";
import { PositionQuadrantEnum } from "shared/enum/positionQuadrantEnum";
import type { FiltersSchema } from "shared/routes/schemas/get.corrections.schema";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";
import { getCurrentCampagneQuery } from "@/modules/corrections/queries/getCurrentCampagne/getCurrentCampagne.query";
import { getStatsSortieParRegionsEtNiveauDiplomeQuery } from "@/modules/data/queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "@/modules/data/services/getPositionQuadrant";
import { cleanNull } from "@/utils/noNull";

import { getCampagneQuery, getCorrectionsQuery, getFiltersQuery, getStatsCorrectionsQuery } from "./deps";

export interface Filters extends z.infer<typeof FiltersSchema> {
  user: RequestUser;
  millesimeSortie?: (typeof MILLESIMES_IJ)[number];
}

const getCorrectionsFactory =
  (
    deps = {
      getCorrectionsQuery,
      getStatsCorrectionsQuery,
      getCurrentCampagneQuery,
      getCampagneQuery,
      getFiltersQuery,
      getStatsSortieParRegionsEtNiveauDiplomeQuery,
    }
  ) =>
  async (activeFilters: Filters) => {
    const [stats, { count, corrections }, filters, statsSortie] = await Promise.all([
      deps.getStatsCorrectionsQuery(activeFilters),
      deps.getCorrectionsQuery(activeFilters),
      deps.getFiltersQuery(activeFilters),
      deps.getStatsSortieParRegionsEtNiveauDiplomeQuery(activeFilters),
    ]);

    return {
      corrections: corrections.map((correction) =>
        cleanNull({
          ...correction,
          positionQuadrant:
            statsSortie && statsSortie[correction.codeRegion ?? ""]
              ? getPositionQuadrant(
                  {
                    ...correction,
                    tauxInsertion: correction.tauxInsertionRegional,
                    tauxPoursuite: correction.tauxPoursuiteRegional,
                  },
                  statsSortie[correction.codeRegion ?? ""][correction.codeNiveauDiplome ?? ""] || {}
                )
              : PositionQuadrantEnum["Hors quadrant"],
        })
      ),
      count,
      stats,
      filters,
    };
  };

export const getCorrectionsUsecase = getCorrectionsFactory();
