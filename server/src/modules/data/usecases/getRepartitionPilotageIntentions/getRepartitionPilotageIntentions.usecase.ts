import _ from "lodash";
import { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { z } from "zod";

import { RequestUser } from "../../../core/model/User";
import { getDomainesQuery } from "./deps/getDomainesQuery";
import { getNiveauxDiplomeQuery } from "./deps/getNiveauxDiplomeQuery";
import { getZonesGeographiquesQuery } from "./deps/getZonesGeographiquesQuery";
import {
  getRepartitionPilotageIntentionsSchema,
  StatsSchema,
} from "./getRepartitionPilotageIntentions.schema";

export interface Filters
  extends z.infer<typeof getRepartitionPilotageIntentionsSchema.querystring> {
  statut?: Exclude<DemandeStatutType, "supprimée" | "refusée">;
  user: RequestUser;
}

const formatResult = (
  result: z.infer<typeof StatsSchema>[],
  order: "asc" | "desc" = "asc",
  orderBy?: string
) => {
  return _.chain(result)
    .map((item) => ({
      ...item,
      libelle: item.libelle ?? item.code,
      placesEffectivementOccupees: item.placesEffectivementOccupees ?? 0,
    }))
    .orderBy((item) => {
      if (orderBy) return item[orderBy as keyof typeof item];
      return item.libelle;
    }, order)
    .keyBy("libelle")
    .value();
};

const getRepartitionPilotageIntentionsFactory =
  (
    deps = {
      // getCurrentCampagneQuery,
      getDomainesQuery,
      getNiveauxDiplomeQuery,
      getZonesGeographiquesQuery,
    }
  ) =>
  async (activeFilters: Filters) => {
    // const campagne = await deps.getCurrentCampagneQuery();
    // const anneeCampagne = activeFilters?.campagne ?? campagne.annee;
    const [domaines, niveauxDiplome, zonesGeographiques] = await Promise.all([
      deps.getDomainesQuery({
        filters: {
          ...activeFilters,
          campagne: "2023",
        },
      }),
      deps.getNiveauxDiplomeQuery({
        filters: {
          ...activeFilters,
          campagne: "2023",
        },
      }),
      deps.getZonesGeographiquesQuery({
        filters: {
          ...activeFilters,
          campagne: "2023",
        },
      }),
    ]);
    return {
      domaines: formatResult(
        domaines,
        activeFilters.order,
        activeFilters.orderBy
      ),
      niveauxDiplome: formatResult(
        niveauxDiplome,
        activeFilters.order,
        activeFilters.orderBy
      ),
      zonesGeographiques: formatResult(
        zonesGeographiques,
        activeFilters.order,
        activeFilters.orderBy
      ),
    };
  };

export const getRepartitionPilotageIntentionsUsecase =
  getRepartitionPilotageIntentionsFactory();
