import { dependencies } from "./dependencies";

const getEtablissementsFactory =
  ({
    findEtablissementsInDb = dependencies.findEtablissementsInDb,
    findFiltersInDb = dependencies.findFiltersInDb,
  }) =>
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
    const etablissementsPromise = findEtablissementsInDb(activeFilters);
    const filtersPromise = findFiltersInDb(activeFilters);

    const { filters, count, etablissements } = {
      filters: await filtersPromise,
      ...(await etablissementsPromise),
    };

    return {
      count,
      filters,
      etablissements,
    };
  };

export const getEtablissements = getEtablissementsFactory({});
