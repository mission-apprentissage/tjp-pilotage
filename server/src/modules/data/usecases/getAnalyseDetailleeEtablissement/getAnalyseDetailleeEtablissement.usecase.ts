import { dependencies } from "./dependencies";

export const getAnalyseDetailleeEtablissementFactory =
  (
    deps = {
      getAnalyseDetailleeEtablissement:
        dependencies.getAnalyseDetailleeEtablissementQuery,
    }
  ) =>
  async (activeFilters: { uai: string; codeNiveauDiplome?: string[] }) => {
    const { formations, chiffresIj, chiffresEntree, filters } =
      await deps.getAnalyseDetailleeEtablissement(activeFilters);

    return {
      formations: formations.reduce(
        (acc, formation) => {
          acc[formation.offre] = formation;
          return acc;
        },
        {} as Record<string, (typeof formations)[0]>
      ),
      chiffresIj: chiffresIj.reduce(
        (acc, chiffreIj) => {
          if (!acc[chiffreIj.offre]) {
            acc[chiffreIj.offre] = {};
          }
          acc[chiffreIj.offre][chiffreIj.millesimeSortie] = chiffreIj;
          return acc;
        },
        {} as Record<string, Record<string, (typeof chiffresIj)[0]>>
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
      filters,
    };
  };

export const getAnalyseDetailleeEtablissement =
  getAnalyseDetailleeEtablissementFactory();
