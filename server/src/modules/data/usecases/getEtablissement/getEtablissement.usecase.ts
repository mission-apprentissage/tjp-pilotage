import { inject } from "injecti";

import { cleanNull } from "../../../../utils/noNull";
import { getStatsSortieParRegions } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
import { dependencies } from "./dependencies";

export const [getEtablissement] = inject(
  { getEtablissementInD: dependencies.getEtablissementInDb },
  (deps) =>
    async (activeFilters: {
      uai: string;
      orderBy?: { column: string; order: "asc" | "desc" };
    }) => {
      const [etablissement, statsSortie] = await Promise.all([
        deps.getEtablissementInD(activeFilters),
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
    }
);
