import { RequestUser } from "../../../core/model/User";
import { dependencies } from "./dependencies";

const getStatsDemandesFactory =
  ({
    findStatsDemandesInDB = dependencies.findStatsDemandesInDB,
    findFiltersInDb = dependencies.findFiltersInDb,
  }) =>
  async (activeFilters: {
    status?: "draft" | "submitted";
    codeRegion?: string[];
    rentreeScolaire?: string;
    typeDemande?: string[];
    motif?: string[];
    cfd?: string[];
    codeNiveauDiplome?: string[];
    dispositif?: string[];
    filiere?: string[];
    coloration?: string;
    amiCMA?: string;
    secteur?: string;
    cfdFamille?: string[];
    codeDepartement?: string[];
    codeAcademie?: string[];
    commune?: string[];
    uai?: string[];
    compensation?: string;
    user: Pick<RequestUser, "id" | "role" | "codeRegion">;
    offset?: number;
    limit?: number;
    orderBy?: {
      order: "asc" | "desc";
      column: string;
    };
  }) => {
    const statsDemandesPromise = findStatsDemandesInDB(activeFilters);
    const filtersPromise = findFiltersInDb(activeFilters);

    const { filters, count, demandes } = {
      filters: await filtersPromise,
      ...(await statsDemandesPromise),
    };

    return {
      count,
      filters,
      demandes,
    };
  };

export const getStatsDemandes = getStatsDemandesFactory({});