import { cleanNull } from "../../../../utils/noNull";
import { getStatsSortieParRegionsEtNiveauDiplome } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
import { dependencies, Filters } from "./dependencies";

const getDemandesRestitutionIntentionsFactory =
  ({
    getDemandesRestitutionIntentionsQuery = dependencies.getDemandesRestitutionIntentionsQuery,
    getFilters = dependencies.getFilters,
  }) =>
  async (activeFilters: Filters) => {
    const [{ count, demandes }, filters, statsSortie] = await Promise.all([
      getDemandesRestitutionIntentionsQuery(activeFilters),
      getFilters(activeFilters),
      getStatsSortieParRegionsEtNiveauDiplome(activeFilters),
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
    };
  };

export const getDemandesRestitutionIntentionsUsecase =
  getDemandesRestitutionIntentionsFactory({});
