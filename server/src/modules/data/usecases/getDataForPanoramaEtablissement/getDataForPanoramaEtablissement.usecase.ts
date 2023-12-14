import { cleanNull } from "../../../../utils/noNull";
import { getStatsSortieParRegions } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
import { dependencies } from "./dependencies";

export const getDataForPanoramaEtablissementFactory =
  (
    deps = {
      getFormationsEtablissement: dependencies.getFormationsEtablissement,
      getStatsSortieParRegions: getStatsSortieParRegions,
    }
  ) =>
  async (activeFilters: {
    uai: string;
    orderBy?: { column: string; order: "asc" | "desc" };
  }) => {
    const [etablissement, statsSortie] = await Promise.all([
      deps.getFormationsEtablissement(activeFilters),
      getStatsSortieParRegions({}),
    ]);

    return (
      etablissement &&
      cleanNull({
        ...etablissement,
        formations: etablissement?.formations?.map((formation) =>
          cleanNull({
            ...formation,
            positionQuadrant: getPositionQuadrant(
              formation,
              statsSortie[etablissement.codeRegion ?? ""] || {}
            ),
          })
        ),
      })
    );
  };

export const getDataForPanoramaEtablissement =
  getDataForPanoramaEtablissementFactory();
