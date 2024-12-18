import { CURRENT_IJ_MILLESIME } from "shared";
import type { Filters } from "shared/routes/schemas/get.panorama.stats.departement.schema";

import { withTauxDevenirFavorableReg } from "@/modules/data/utils/tauxDevenirFavorable";
import { formatFormationSpecifique } from "@/modules/utils/formatFormationSpecifique";
import { cleanNull } from "@/utils/noNull";

import { getFormationsDepartementBase } from "./getFormationsDepartementBase.dep";

export const getTopFlopFormationsDepartement = async (filters: Filters) =>
  getFormationsDepartementBase(filters)
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
    .then(cleanNull)
    .then((formations) =>
      formations.map((formation) => ({
        ...formation,
        formationSpecifique: formatFormationSpecifique(formation),
      }))
    );
