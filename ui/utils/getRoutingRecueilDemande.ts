
import type { Role } from "shared";
import { hasPermission } from "shared";
import {PermissionEnum} from 'shared/enum/permissionEnum';


const ROUTE_DEMANDES = "/demandes";

export const getRoutingSaisieRecueilDemande = ({
  user,
  suffix = ""
} : {
  user?: {
    codeRegion?: string
    role?: Role
  }
  suffix?: string;
}) => {
  if(!hasPermission(user?.role, PermissionEnum["demande/ecriture"]) && !hasPermission(user?.role, PermissionEnum["demande/lecture"])) return "/";
  return `${ROUTE_DEMANDES}/saisie${suffix ? `/${suffix}` : ""}`;
};

export const getRoutingSyntheseRecueilDemande = ({
  user,
  suffix = ""
} : {
  user?: {
    codeRegion?: string,
    role?: Role
  },
  suffix?: string;
}) => {
  if(!hasPermission(user?.role, PermissionEnum["demande/ecriture"]) && !hasPermission(user?.role, PermissionEnum["demande/lecture"])) return "/";
  return `${ROUTE_DEMANDES}/synthese${suffix ? `/${suffix}` : ""}`;
};

