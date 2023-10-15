import { RequestUser } from "../../../core/model/User";
import { dependencies } from "./dependencies";

const getCountStatsDemandesFactory =
  ({
    countStatsDemandesInDB = dependencies.countStatsDemandesInDB,
  }) =>
    async (activeFilters: {
      user: Pick<RequestUser, "id" | "role" | "codeRegion">;
      status?: "draft" | "submitted";
      codeRegion?: string[];
      codeAcademie?: string[];
      codeDepartement?: string[];
      rentreeScolaire?: string;
      codeNiveauDiplome?: string[];
      coloration?: string;
      secteur?: string;
    }) => {
      const countStatsDemandesPromise = countStatsDemandesInDB(activeFilters);

      return await countStatsDemandesPromise;
    };

export const getCountStatsDemandes = getCountStatsDemandesFactory({});
