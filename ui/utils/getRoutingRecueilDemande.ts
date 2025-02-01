
import type { Role } from "shared";
import { isUserInRegionsExperimentation2024 , RoleEnum } from "shared";
import type { CampagneType } from "shared/schema/campagneSchema";

export const isPerdirPartOfExpe = ({
  user,
  campagne
}:
{
  user?: {
    codeRegion?: string
    role?: Role
  },
  campagne?: CampagneType
}) => {
  const isPerdir = user?.role === RoleEnum["perdir"];
  if(!isPerdir) return false;
  const isPartOfExpe = isUserPartOfExpe({ user, campagne });
  if(isPartOfExpe) {
    if (campagne?.annee === "2025") {
      const isCampagneRegionale = campagne?.hasCampagneRegionEnCours;
      const isCampagneRegionaleOfUser = user?.codeRegion === campagne?.codeRegion;
      return isCampagneRegionale && isCampagneRegionaleOfUser && campagne.withSaisiePerdir;
    }
    return true;
  }
  return false;
};

export const isUserPartOfExpe = ({
  user,
  campagne
}:
{
  user?: {
    codeRegion?: string
    role?: Role
  },
  campagne?: CampagneType
}) => {
  if(campagne?.annee === "2023") return false;
  if(campagne?.annee === "2024") {
    return isUserInRegionsExperimentation2024({ user });
  }
  return true;
};

export const getRoutingSaisieRecueilDemande = ({
  campagne,
  user,
  suffix = ""
} : {
  campagne?:CampagneType,
  user?: {
    codeRegion?: string
    role?: Role
  }
  suffix?: string;
}) => {
  const isPerdir = user?.role === RoleEnum["perdir"];
  if(isPerdir && !isPerdirPartOfExpe({ user, campagne })) return "/";
  if(isUserPartOfExpe({ user, campagne }) || isPerdirPartOfExpe({ user, campagne })) {
    return `/intentions/perdir/saisie${suffix ? `/${suffix}` : ""}`;
  }
  return `/intentions/saisie${suffix ? `/${suffix}` : ""}`;
};

export const getRoutingSyntheseRecueilDemande = ({
  campagne,
  user,
  suffix = ""
} : {
  campagne?: CampagneType,
  user?: {
    codeRegion?: string,
    role?: Role
  },
  suffix?: string;
}) => {
  const isPerdir = user?.role === RoleEnum["perdir"];
  if(isPerdir && !isPerdirPartOfExpe({ user, campagne })) return "/";
  if(isUserPartOfExpe({ user, campagne }) || isPerdirPartOfExpe({ user, campagne })) {
    return `/intentions/perdir/synthese${suffix ? `/${suffix}` : ""}`;
  }
  return `/intentions/synthese${suffix ? `/${suffix}` : ""}`;
};

