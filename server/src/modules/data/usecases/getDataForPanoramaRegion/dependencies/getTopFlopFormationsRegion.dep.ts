import { CURRENT_IJ_MILLESIME } from "shared";

import { cleanNull } from "../../../../../utils/noNull";
import { withTauxDevenirFavorableReg } from "../../../utils/tauxDevenirFavorable";
import { Filters } from "../getDataForPanoramaRegion.schema";
import { getFormationsRegionBase } from "./getFormationsRegionBase.dep";

export const getTopFlopFormationsRegion = async (filters: Filters) =>
  getFormationsRegionBase(filters)
    .having(
      (eb) =>
        withTauxDevenirFavorableReg({
          eb,
          millesimeSortie: filters.millesimeSortie ?? CURRENT_IJ_MILLESIME,
          cfdRef: "formationEtablissement.cfd",
          codeDispositifRef: "formationEtablissement.dispositifId",
          codeRegionRef: "etablissement.codeRegion",
        }),
      "is not",
      null
    )
    .execute()
    .then(cleanNull);
