import { cleanNull } from "../../../../utils/noNull";
import { getCurrentCampagneQuery } from "../../queries/getCurrentCampagne/getCurrentCampagne.query";
import { getStatsSortieParRegionsEtNiveauDiplomeQuery } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
import { dependencies, Filters } from "./dependencies";

const getDemandesRestitutionIntentionsFactory =
  (
    deps = {
      getDemandesRestitutionIntentionsQuery:
        dependencies.getDemandesRestitutionIntentionsQuery,
      getFilters: dependencies.getFilters,
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
                  demande,
                  statsSortie[demande.codeRegion ?? ""][
                    demande.codeNiveauDiplome ?? ""
                  ] || {}
                )
              : "Hors quadrant",
        })
      ),
      campagne,
    };
  };

export const getDemandesRestitutionIntentionsUsecase =
  getDemandesRestitutionIntentionsFactory();
