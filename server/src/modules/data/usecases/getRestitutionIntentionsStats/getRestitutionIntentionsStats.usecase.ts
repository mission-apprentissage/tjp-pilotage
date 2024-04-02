import { cleanNull } from "../../../../utils/noNull";
import { getStatsSortieParRegionsEtNiveauDiplome } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
import { dependencies, Filters } from "./dependencies";

const getRestitutionIntentionsStatsFactory =
  ({
    findRestitutionIntentionsStatsInDB = dependencies.findRestitutionIntentionsStatsInDB,
    findFiltersInDb = dependencies.findFiltersInDb,
  }) =>
  async (activeFilters: Filters) => {
    const [{ count, demandes }, filters, statsSortie] = await Promise.all([
      findRestitutionIntentionsStatsInDB(activeFilters),
      findFiltersInDb(activeFilters),
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

export const getRestitutionIntentionsStats =
  getRestitutionIntentionsStatsFactory({});
