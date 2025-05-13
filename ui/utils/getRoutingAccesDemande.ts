
import type { Role } from "shared";
import type { CampagneType } from "shared/schema/campagneSchema";

import { isUserPartOfAccesDemande } from "./isPartOfAccesDemande";
import { isUserPartOfSaisieDemande } from "./isPartOfSaisieDemande";


const ROUTE_DEMANDES = "/demandes";
const formatSuffix = (suffix: string) => suffix ? `/${suffix}` : "";

export const getRoutingAccessSaisieDemande = ({
  user,
  campagne,
  suffix = "",
} : {
  user?: {
    codeRegion?: string
    role?: Role
  };
  campagne?: CampagneType;
  suffix?: string;
}) => {
  if(!isUserPartOfAccesDemande({user, campagne})) return "/";
  if(!isUserPartOfSaisieDemande({user, campagne})) return `${ROUTE_DEMANDES}/saisie`;
  return `${ROUTE_DEMANDES}/saisie${formatSuffix(suffix)}`;
};

export const getRoutingAccesSyntheseDemande = ({
  user,
  campagne,
  suffix = ""
} : {
  user?: {
    codeRegion?: string
    role?: Role
  };
  campagne?: CampagneType;
  suffix?: string;
}) => {
  if(!isUserPartOfAccesDemande({user, campagne})) return "/";
  return `${ROUTE_DEMANDES}/synthese${formatSuffix(suffix)}`;
};

