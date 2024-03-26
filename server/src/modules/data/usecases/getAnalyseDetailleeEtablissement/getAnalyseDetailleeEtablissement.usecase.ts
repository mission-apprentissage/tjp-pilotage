import { getStatsSortieParRegions } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
import {
  getChiffresEntree,
  getChiffresIj,
  getEtablissement,
  getFilters,
  getFormations,
} from "./dependencies";

export const getAnalyseDetailleeEtablissementFactory =
  (
    deps = {
      getFormations,
      getEtablissement,
      getChiffresEntree,
      getChiffresIj,
      getFilters,
      getStatsSortieParRegions,
      getPositionQuadrant,
    }
  ) =>
  async (activeFilters: {
    uai: string;
    codeNiveauDiplome?: string[];
    voie?: string[];
  }) => {
    const [
      formations,
      etablissement,
      chiffresEntree,
      chiffresIJ,
      filters,
      statsSortie,
    ] = await Promise.all([
      deps.getFormations(activeFilters),
      deps.getEtablissement(activeFilters),
      deps.getChiffresEntree(activeFilters),
      deps.getChiffresIj(activeFilters),
      deps.getFilters(activeFilters),
      deps.getStatsSortieParRegions({}),
    ]);

    const formationsObject: Record<string, (typeof formations)[0]> = {};
    formations.forEach((formation) => {
      formationsObject[formation.offre] = formation;
    });

    const chiffresIJObject: Record<
      string,
      Record<string, (typeof chiffresIJ)[number] & { positionQuadrant: string }>
    > = {};

    chiffresIJ.forEach((chiffres) => {
      if (!chiffresIJObject[chiffres.offre]) {
        chiffresIJObject[chiffres.offre] = {};
      }
      chiffresIJObject[chiffres.offre][chiffres.millesimeSortie] = {
        ...chiffres,
        positionQuadrant: deps.getPositionQuadrant(
          {
            tauxInsertion: chiffres.tauxInsertion ?? 0,
            tauxPoursuite: chiffres.tauxPoursuite ?? 0,
          },
          statsSortie[etablissement.codeRegion ?? ""] || {}
        ),
      };
    });

    const chiffresEntreeObject: Record<
      string,
      Record<string, (typeof chiffresEntree)[number]>
    > = {};

    chiffresEntree.forEach((chiffres) => {
      if (!chiffresEntreeObject[chiffres.offre]) {
        chiffresEntreeObject[chiffres.offre] = {};
      }
      chiffresEntreeObject[chiffres.offre][chiffres.rentreeScolaire] = chiffres;
    });

    return {
      etablissement,
      formations: formationsObject,
      chiffresIJ: chiffresIJObject,
      chiffresEntree: chiffresEntreeObject,
      statsSortie: statsSortie[etablissement.codeRegion ?? ""] || {},
      filters,
    };
  };

export const getAnalyseDetailleeEtablissement =
  getAnalyseDetailleeEtablissementFactory();
