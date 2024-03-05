import { getStatsSortieParRegions } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
import { dependencies } from "./dependencies";

export const getAnalyseDetailleeEtablissementFactory =
  (
    deps = {
      getAnalyseDetailleeEtablissement:
        dependencies.getAnalyseDetailleeEtablissementQuery,
      getStatsSortieParRegions: getStatsSortieParRegions,
      getPositionQuadrant,
    }
  ) =>
  async (activeFilters: { uai: string; codeNiveauDiplome?: string[] }) => {
    const [
      { etablissement, formations, chiffresIJ, chiffresEntree, filters },
      statsSortie,
    ] = await Promise.all([
      deps.getAnalyseDetailleeEtablissement(activeFilters),
      deps.getStatsSortieParRegions({}),
    ]);

    return {
      etablissement,
      formations: formations.reduce(
        (acc, formation) => {
          acc[formation.offre] = formation;
          return acc;
        },
        {} as Record<string, (typeof formations)[0]>
      ),
      chiffresIJ: chiffresIJ.reduce(
        (acc, chiffreIj) => {
          if (!acc[chiffreIj.offre]) {
            acc[chiffreIj.offre] = {};
          }
          acc[chiffreIj.offre][chiffreIj.millesimeSortie] = {
            ...chiffreIj,
            positionQuadrant: deps.getPositionQuadrant(
              {
                tauxInsertion: chiffreIj.tauxInsertion ?? 0,
                tauxPoursuite: chiffreIj.tauxPoursuite ?? 0,
              },
              statsSortie[etablissement.codeRegion ?? ""] || {}
            ),
          };
          return acc;
        },
        {} as Record<
          string,
          Record<
            string,
            (typeof chiffresIJ)[number] & { positionQuadrant: string }
          >
        >
      ),
      chiffresEntree: chiffresEntree.reduce(
        (acc, chiffreEntree) => {
          if (!acc[chiffreEntree.offre]) {
            acc[chiffreEntree.offre] = {};
          }
          acc[chiffreEntree.offre][chiffreEntree.rentreeScolaire] =
            chiffreEntree;
          return acc;
        },
        {} as Record<string, Record<string, (typeof chiffresEntree)[0]>>
      ),
      statsSortie: statsSortie[etablissement.codeRegion ?? ""] || {},
      filters,
    };
  };

export const getAnalyseDetailleeEtablissement =
  getAnalyseDetailleeEtablissementFactory();
