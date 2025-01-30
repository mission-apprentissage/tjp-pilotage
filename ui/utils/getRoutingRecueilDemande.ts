
import { CODES_REGIONS_EXPE_2024 } from "shared";

export const isUserPartOfExpe = ({
  user,
  campagne
}:
{
  user?: {
    codeRegion?: string
  },
  campagne?: {
    annee: string
  }
}) => {
  if(campagne?.annee === "2023") return false;
  if(campagne?.annee === "2024") {
    return CODES_REGIONS_EXPE_2024.includes(user?.codeRegion ?? "");
  }
  return true;
};

export const getRoutingSaisieRecueilDemande = ({
  campagne,
  user,
  suffix = ""
} : {
  campagne?: {
    annee: string
  },
  user?: {
    codeRegion?: string
  }
  suffix?: string;
}) => {
  if(isUserPartOfExpe({ user, campagne })) {
    return `/intentions/perdir/saisie${suffix ? `/${suffix}` : ""}`;
  }
  return `/intentions/saisie${suffix ? `/${suffix}` : ""}`;
};

export const getRoutingSyntheseRecueilDemande = ({
  campagne,
  user,
  suffix = ""
} : {
  campagne?: {
    annee: string
  },
  user?: {
    codeRegion?: string
  },
  suffix?: string;
}) => {
  if(isUserPartOfExpe({ user, campagne })) {
    return `/intentions/perdir/synthese${suffix ? `/${suffix}` : ""}`;
  }
  return `/intentions/synthese${suffix ? `/${suffix}` : ""}`;
};

