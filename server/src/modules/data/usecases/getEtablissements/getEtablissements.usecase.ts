import { getStatsSortieParRegionsEtNiveauDiplome } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
import { dependencies } from "./dependencies";

const getEtablissementsFactory =
  (
    deps = {
      findEtablissementsInDb: dependencies.findEtablissementsInDb,
      findFiltersInDb: dependencies.findFiltersInDb,
    }
  ) =>
  async (activeFilters: {
    offset?: number;
    limit?: number;
    codeRegion?: string[];
    codeAcademie?: string[];
    codeDepartement?: string[];
    codeDiplome?: string[];
    codeDispositif?: string[];
    commune?: string[];
    cfd?: string[];
    cfdFamille?: string[];
    uai?: string[];
    secteur?: string[];
    orderBy?: { order: "asc" | "desc"; column: string };
  }) => {
    const [{ etablissements, count }, filters, statsSortie] = await Promise.all(
      [
        deps.findEtablissementsInDb(activeFilters),
        deps.findFiltersInDb(activeFilters),
        getStatsSortieParRegionsEtNiveauDiplome(activeFilters),
      ]
    );

    return {
      count,
      filters,
      etablissements: etablissements.map((etablissement) => ({
        ...etablissement,
        positionQuadrant:
          statsSortie && statsSortie[etablissement.codeRegion ?? ""]
            ? getPositionQuadrant(
                etablissement,
                statsSortie[etablissement.codeRegion ?? ""][
                  etablissement.codeNiveauDiplome ?? ""
                ] || {}
              )
            : "Hors quadrant",
        libelleFamille:
          etablissement.typeFamille === "2nde_commune"
            ? etablissement.libelleFamilleSC
            : etablissement.libelleFamille,
      })),
    };
  };

export const getEtablissements = getEtablissementsFactory();
