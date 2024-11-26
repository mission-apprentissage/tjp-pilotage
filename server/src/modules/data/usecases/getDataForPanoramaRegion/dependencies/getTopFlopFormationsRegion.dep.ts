import { CURRENT_IJ_MILLESIME } from "shared";

import type { Filters } from "@/modules/data/usecases/getDataForPanoramaRegion/getDataForPanoramaRegion.schema";
import { withTauxDevenirFavorableReg } from "@/modules/data/utils/tauxDevenirFavorable";
import { cleanNull } from "@/utils/noNull";

import { getFormationsRegionBase } from "./getFormationsRegionBase.dep";

export const getTopFlopFormationsRegion = async (filters: Filters) =>
  getFormationsRegionBase(filters)
    .having(
      (eb) =>
        withTauxDevenirFavorableReg({
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
