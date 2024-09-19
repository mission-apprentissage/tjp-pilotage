import { ScopeEnum } from "shared";

import { Filters } from "../getRepartitionPilotageIntentions.usecase";
import { getAcademiesQuery } from "./getAcademiesQuery";
import { getDepartementsQuery } from "./getDepartementsQuery";
import { getRegionsQuery } from "./getRegionsQuery";

export const getZonesGeographiquesQuery = async ({
  filters,
}: {
  filters: Filters;
}) => {
  switch (filters.scope) {
    case ScopeEnum["département"]:
      return getDepartementsQuery({
        filters: { ...filters, codeDepartement: undefined },
      });
    case ScopeEnum["académie"]:
      return getAcademiesQuery({
        filters: { ...filters, codeAcademie: undefined },
      });
    case ScopeEnum["région"]:
    default:
      return getRegionsQuery({
        filters: { ...filters, codeRegion: undefined },
      });
  }
};
