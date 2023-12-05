import { cleanNull } from "../../../../utils/noNull";
import { RequestUser } from "../../../core/model/User";
import { getStatsSortieParRegionsEtNiveauDiplome } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
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
    CPCSecteur?: string[];
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
    voie?: "scolaire" | "apprentissage";
  }) => {
    const [{ count, demandes }, filters, statsSortie] = await Promise.all([
      findRestitutionIntentionsStatsInDB(activeFilters),
      findFiltersInDb(activeFilters),
      getStatsSortieParRegionsEtNiveauDiplome(activeFilters),
    ]);

    return {
      count,
      filters,
      demandes: demandes?.map((demande) =>
        cleanNull({
          ...demande,
          positionQuadrant:
            statsSortie && statsSortie[demande.codeRegion ?? ""]
              ? getPositionQuadrant(
                  demande,
                  statsSortie[demande.codeRegion ?? ""][
                    demande.codeNiveauDiplome ?? ""
                  ] || {}
                )
              : "Hors quadrant",
        })
      ),
    };
  };

export const getRestitutionIntentionsStats =
  getRestitutionIntentionsStatsFactory({});
