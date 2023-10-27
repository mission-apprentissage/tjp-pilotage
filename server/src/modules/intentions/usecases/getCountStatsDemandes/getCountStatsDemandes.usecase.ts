import { RequestUser } from "../../../core/model/User";
import { dependencies } from "./dependencies";

const getCountStatsDemandesFactory =
  ({ countStatsDemandesInDB = dependencies.countStatsDemandesInDB }) =>
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
    const countStatsDemandesPromise = countStatsDemandesInDB(activeFilters);

    return await countStatsDemandesPromise;
  };

export const getCountStatsDemandes = getCountStatsDemandesFactory({});
