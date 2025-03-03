
import type { Role } from "shared";
import { hasPermission } from "shared";
import {PermissionEnum} from 'shared/enum/permissionEnum';
import type { CampagneType } from "shared/schema/campagneSchema";

import { isUserPartOfExpe } from "./isPartOfExpe";

const ROUTE_HORS_EXPE = "/intentions";
const ROUTE_EXPE = "/intentions/perdir";

export const getRoutingSaisieRecueilDemande = ({
  campagne,
  demande,
  user,
  suffix = ""
} : {
  campagne?:CampagneType,
  demande?: {
    isIntention: boolean
  },
  user?: {
    codeRegion?: string
    role?: Role
  }
  suffix?: string;
}) => {
  if(!hasPermission(user?.role, PermissionEnum["intentions/ecriture"]) && !hasPermission(user?.role, PermissionEnum["intentions/lecture"])) return "/";
  if(demande && demande.isIntention === false) return `${ROUTE_HORS_EXPE}/saisie${suffix ? `/${suffix}` : ""}`;
  return isUserPartOfExpe({ user, campagne }) ?
    `${ROUTE_EXPE}/saisie${suffix ? `/${suffix}` : ""}` :
    `${ROUTE_HORS_EXPE}/saisie${suffix ? `/${suffix}` : ""}`;
};

export const getRoutingSyntheseRecueilDemande = ({
  campagne,
  demande,
  user,
  suffix = ""
} : {
  campagne?: CampagneType,
  demande?: {
    isIntention: boolean
  },
  user?: {
    codeRegion?: string,
    role?: Role
  },
  suffix?: string;
}) => {
  if(!hasPermission(user?.role, PermissionEnum["intentions/ecriture"]) && !hasPermission(user?.role, PermissionEnum["intentions/lecture"])) return "/";
  if(demande && demande.isIntention === false) return `${ROUTE_HORS_EXPE}/synthese${suffix ? `/${suffix}` : ""}`;
  return isUserPartOfExpe({ user, campagne }) ?
    `${ROUTE_EXPE}/synthese${suffix ? `/${suffix}` : ""}` :
    `${ROUTE_HORS_EXPE}/synthese${suffix ? `/${suffix}` : ""}`;
};

