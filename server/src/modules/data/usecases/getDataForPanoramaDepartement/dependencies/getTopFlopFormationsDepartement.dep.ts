import { CURRENT_IJ_MILLESIME } from "shared";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";
import type { Filters } from "shared/routes/schemas/get.panorama.stats.departement.schema";

import { withTauxDevenirFavorableReg } from "@/modules/data/utils/tauxDevenirFavorable";
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
    .then((formations) =>
      formations.map((formation) =>
        cleanNull({
          ...formation,
          formationSpecifique: {
            [TypeFormationSpecifiqueEnum["Action prioritaire"]]:
              !!formation[TypeFormationSpecifiqueEnum["Action prioritaire"]],
            [TypeFormationSpecifiqueEnum["Transition démographique"]]:
              !!formation[TypeFormationSpecifiqueEnum["Transition démographique"]],
            [TypeFormationSpecifiqueEnum["Transition écologique"]]:
              !!formation[TypeFormationSpecifiqueEnum["Transition écologique"]],
            [TypeFormationSpecifiqueEnum["Transition numérique"]]:
              !!formation[TypeFormationSpecifiqueEnum["Transition numérique"]],
          },
        })
      )
    );
