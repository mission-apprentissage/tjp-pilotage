import { MILLESIMES_IJ } from "shared";
import { PositionQuadrantEnum } from "shared/enum/positionQuadrantEnum";
import { z } from "zod";

import { cleanNull } from "../../../../utils/noNull";
import { RequestUser } from "../../../core/model/User";
import { getStatsSortieParRegionsEtNiveauDiplomeQuery } from "../../../data/queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../../data/services/getPositionQuadrant";
import { getCurrentCampagneQuery } from "../../queries/getCurrentCampagne/getCurrentCampagne.query";
import {
  getCampagneQuery,
  getCorrectionsQuery,
  getFiltersQuery,
  getStatsCorrectionsQuery,
} from "./deps";
import { FiltersSchema } from "./getCorrections.schema";

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
    const [stats, { count, corrections }, filters, statsSortie] =
      await Promise.all([
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
                  statsSortie[correction.codeRegion ?? ""][
                    correction.codeNiveauDiplome ?? ""
                  ] || {}
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
