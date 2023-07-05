import { dependencies } from "./dependencies";

const getFormationsFactory =
  ({
    findFormationsInDb = dependencies.findFormationsInDb,
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
    rentreeScolaire?: string[];
    cfdFamille?: string[];
    CPC?: string[];
    CPCSecteur?: string[];
    CPCSousSecteur?: string[];
    libelleFiliere?: string[];
    orderBy?: { order: "asc" | "desc"; column: string };
    withEmptyFormations?: boolean;
  }) => {
    const formationsPromise = findFormationsInDb(activeFilters);
    const filtersPromise = findFiltersInDb(activeFilters);

    const { filters, count, formations } = {
      filters: await filtersPromise,
      ...(await formationsPromise),
    };

    return {
      count,
      filters,
      formations,
    };
  };

export const getFormations = getFormationsFactory({});
