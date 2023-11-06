import { RequestUser } from "../../../core/model/User";
import { dependencies } from "./dependencies";

const getCountRestitutionIntentionsStatsFactory =
  ({
    countRestitutionIntentionsStatsInDB = dependencies.countRestitutionIntentionsStatsInDB,
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
  }) => {
    const countStatsDemandesPromise =
      countRestitutionIntentionsStatsInDB(activeFilters);

    return await countStatsDemandesPromise;
  };

export const getCountRestitutionIntentionsStats =
  getCountRestitutionIntentionsStatsFactory({});
