import { MILLESIMES_IJ } from "shared";
import { z } from "zod";

import { cleanNull } from "../../../../utils/noNull";
import { RequestUser } from "../../../core/model/User";
import { getCurrentCampagneQuery } from "../../queries/getCurrentCampagne/getCurrentCampagne.query";
import { getStatsSortieParRegionsEtNiveauDiplomeQuery } from "../../queries/getStatsSortie/getStatsSortie";
import {
  getPositionQuadrant,
  HORS_QUADRANT,
} from "../../services/getPositionQuadrant";
import { getDemandesRestitutionIntentionsQuery } from "./deps/getDemandesRestitutionIntentions.query";
import { getFilters } from "./deps/getFilters.query";
import { FiltersSchema } from "./getDemandesRestitutionIntentions.schema";

export interface Filters extends z.infer<typeof FiltersSchema> {
  user: RequestUser;
  millesimeSortie?: (typeof MILLESIMES_IJ)[number];
}

const getDemandesRestitutionIntentionsFactory =
  (
    deps = {
      getDemandesRestitutionIntentionsQuery:
        getDemandesRestitutionIntentionsQuery,
      getFilters: getFilters,
      getCurrentCampagneQuery,
      getStatsSortieParRegionsEtNiveauDiplomeQuery,
    }
  ) =>
  async (activeFilters: Filters) => {
    const campagne = await deps.getCurrentCampagneQuery();
    const anneeCampagne = activeFilters?.campagne ?? campagne.annee;
    const [{ count, demandes }, filters, statsSortie] = await Promise.all([
      deps.getDemandesRestitutionIntentionsQuery({
        ...activeFilters,
        campagne: anneeCampagne,
      }),
      deps.getFilters({ ...activeFilters, campagne: anneeCampagne }),
      deps.getStatsSortieParRegionsEtNiveauDiplomeQuery(activeFilters),
    ]);

    return {
      count,
      filters,
      demandes: demandes?.map((demande) =>
        cleanNull({
          ...demande,
          positionQuadrant:
            statsSortie && statsSortie[demande.codeRegion ?? ""]
              ? getPositionQuadrant(
                  {
                    ...demande,
                    tauxInsertion: demande.tauxInsertionRegional,
                    tauxPoursuite: demande.tauxPoursuiteRegional,
                  },
                  statsSortie[demande.codeRegion ?? ""][
                    demande.codeNiveauDiplome ?? ""
                  ] || {}
                )
              : HORS_QUADRANT,
        })
      ),
      campagne,
    };
  };

export const getDemandesRestitutionIntentionsUsecase =
  getDemandesRestitutionIntentionsFactory();
