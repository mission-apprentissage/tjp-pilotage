import { RequestUser } from "../../../core/model/User";
import { dependencies } from "./dependencies";

const countRestitutionIntentionsStatsFactory =
  ({
    countRestitutionIntentionsStatsInDB = dependencies.countRestitutionIntentionsStatsInDB,
  }) =>
  async (activeFilters: {
    status?: ("draft" | "submitted" | "refused")[];
    codeRegion?: string[];
    rentreeScolaire?: string;
    typeDemande?: string[];
    motif?: string[];
    cfd?: string[];
    codeNiveauDiplome?: string[];
    dispositif?: string[];
    CPC?: string[];
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
    voie?: "scolaire" | "apprentissage";
  }) => {
    const countStatsDemandesPromise =
      countRestitutionIntentionsStatsInDB(activeFilters);

    return await countStatsDemandesPromise;
  };

export const countRestitutionIntentionsStats =
  countRestitutionIntentionsStatsFactory({});
