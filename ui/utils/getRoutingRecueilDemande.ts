
import type { Role } from "shared";
import { RoleEnum } from "shared";
import type { CampagneType } from "shared/schema/campagneSchema";

import { isPerdirPartOfExpe, isUserPartOfExpe } from "./isPartOfExpe";

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
  const isPerdir = user?.role === RoleEnum["perdir"];
  if(isPerdir && !isPerdirPartOfExpe({ user, campagne })) return "/";
  return isUserPartOfExpe({ user, campagne }) ?
    `/intentions/perdir/synthese${suffix ? `/${suffix}` : ""}` :
    `/intentions/synthese${suffix ? `/${suffix}` : ""}`;
};

