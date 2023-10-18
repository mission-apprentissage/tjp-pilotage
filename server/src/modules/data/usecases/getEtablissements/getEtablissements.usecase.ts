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
    const [{ etablissements, count }, filters] = await Promise.all([
      deps.findEtablissementsInDb(activeFilters),
      deps.findFiltersInDb(activeFilters),
    ]);

    return {
      count,
      filters,
      etablissements,
    };
  };

export const getEtablissements = getEtablissementsFactory();
