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
    const [{ formations, count }, filters] = await Promise.all([
      findFormationsInDb(activeFilters),
      findFiltersInDb(activeFilters),
    ]);

    return {
      count,
      filters,
      formations,
    };
  };

export const getFormations = getFormationsFactory({});
