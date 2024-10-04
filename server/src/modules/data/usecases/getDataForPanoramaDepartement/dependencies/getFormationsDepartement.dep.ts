import { CURRENT_IJ_MILLESIME } from "shared";

import { cleanNull } from "../../../../../utils/noNull";
import { withInsertionReg } from "../../../utils/tauxInsertion6mois";
import { Filters } from "../getDataForPanoramaDepartement.schema";
import { getFormationsDepartementBase } from "./getFormationsDepartementBase.dep";

export const getFormationsDepartement = async (filters: Filters) =>
  getFormationsDepartementBase(filters)
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
