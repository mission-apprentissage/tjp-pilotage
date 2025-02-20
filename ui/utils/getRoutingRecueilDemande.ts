
import type { Role } from "shared";
import { hasPermission } from "shared";
import type { CampagneType } from "shared/schema/campagneSchema";

import { isUserPartOfExpe } from "./isPartOfExpe";

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
  if(!hasPermission(user?.role, "intentions/ecriture") && !hasPermission(user?.role, "intentions/lecture")) return "/";
  return isUserPartOfExpe({ user, campagne }) ?
    `/intentions/perdir/saisie${suffix ? `/${suffix}` : ""}` :
    `/intentions/saisie${suffix ? `/${suffix}` : ""}`;
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
  if(!hasPermission(user?.role, "intentions/ecriture") && !hasPermission(user?.role, "intentions/lecture")) return "/";
  return isUserPartOfExpe({ user, campagne }) ?
    `/intentions/perdir/synthese${suffix ? `/${suffix}` : ""}` :
    `/intentions/synthese${suffix ? `/${suffix}` : ""}`;
};

