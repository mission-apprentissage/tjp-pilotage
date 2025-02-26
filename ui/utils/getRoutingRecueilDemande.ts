
import type { Role } from "shared";
import { hasPermission } from "shared";
import {PermissionEnum} from 'shared/enum/permissionEnum';
import type { CampagneType } from "shared/schema/campagneSchema";

import { isUserPartOfExpe } from "./isPartOfExpe";

const ROUTE_HORS_EXPE = "/intentions";
const ROUTE_EXPE = "/intentions/perdir";

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
  if(!hasPermission(user?.role, PermissionEnum["intentions/ecriture"]) && !hasPermission(user?.role, PermissionEnum["intentions/lecture"])) return "/";
  return isUserPartOfExpe({ user, campagne }) ?
    `${ROUTE_EXPE}/saisie${suffix ? `/${suffix}` : ""}` :
    `${ROUTE_HORS_EXPE}/saisie${suffix ? `/${suffix}` : ""}`;
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
  if(!hasPermission(user?.role, PermissionEnum["intentions/ecriture"]) && !hasPermission(user?.role, PermissionEnum["intentions/lecture"])) return "/";
  return isUserPartOfExpe({ user, campagne }) ?
    `${ROUTE_EXPE}/synthese${suffix ? `/${suffix}` : ""}` :
    `${ROUTE_HORS_EXPE}/synthese${suffix ? `/${suffix}` : ""}`;
};

