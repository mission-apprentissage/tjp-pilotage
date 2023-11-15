import { RequestUser } from "../../../core/model/User";
import { dependencies } from "./dependencies";

const getRestitutionIntentionsStatsFactory =
  ({
    findRestitutionIntentionsStatsInDB = dependencies.findRestitutionIntentionsStatsInDB,
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
    const [{ count, demandes }, filters] = await Promise.all([
      findRestitutionIntentionsStatsInDB(activeFilters),
      findFiltersInDb(activeFilters),
    ]);

    return {
      count,
      filters,
      demandes,
    };
  };

export const getRestitutionIntentionsStats =
  getRestitutionIntentionsStatsFactory({});
