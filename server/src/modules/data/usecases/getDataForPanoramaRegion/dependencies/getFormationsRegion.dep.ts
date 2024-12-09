import { CURRENT_IJ_MILLESIME } from "shared";
import type { Filters } from "shared/routes/schemas/get.panorama.stats.region.schema";

import { withInsertionReg } from "@/modules/data/utils/tauxInsertion6mois";
import { cleanNull } from "@/utils/noNull";

import { getFormationsRegionBase } from "./getFormationsRegionBase.dep";

export const getFormationsRegion = async (filters: Filters) =>
  getFormationsRegionBase(filters)
    .having(
      (eb) =>
        withInsertionReg({
          eb,
          millesimeSortie: filters.millesimeSortie ?? CURRENT_IJ_MILLESIME,
          cfdRef: "formationEtablissement.cfd",
          codeDispositifRef: "formationEtablissement.codeDispositif",
          codeRegionRef: "etablissement.codeRegion",
        }),
      "is not",
      null
    )
    .execute()
    .then(cleanNull);
