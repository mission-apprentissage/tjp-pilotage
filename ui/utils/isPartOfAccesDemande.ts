import type {Role} from 'shared';
import {hasPermission, hasRole, isUserInRegionsExperimentation2024, RoleEnum} from 'shared';
import { PermissionEnum } from 'shared/enum/permissionEnum';
import type {CampagneType} from 'shared/schema/campagneSchema';

export const isPerdirPartOfAccesDemande = ({
  user,
  campagne
}:
{
  user?: {
    codeRegion?: string
    role?: Role
  },
  campagne?: CampagneType
}): boolean => {
  if(campagne?.annee === "2023") return false;
  if(campagne?.annee === "2024") return isUserInRegionsExperimentation2024({ user });
  const isCampagneRegionale = !!campagne?.codeRegion;
  if(isCampagneRegionale) {
    const isCampagneRegionaleOfUser = user?.codeRegion === campagne?.codeRegion;
    return isCampagneRegionaleOfUser;
  }
  return true;
};


export const isUserPartOfAccesDemande = ({
  user,
  campagne
}:
{
  user?: {
    codeRegion?: string
    role?: Role
  },
  campagne?: CampagneType
}): boolean => {
  if(
    !hasPermission(user?.role, PermissionEnum["demande/lecture"]) &&
    !hasPermission(user?.role, PermissionEnum["demande-avis/lecture"]) &&
    !hasPermission(user?.role, PermissionEnum["demande-statut/lecture"])
  ) return false;
  if(hasRole({ user, role: RoleEnum["perdir"] })) return isPerdirPartOfAccesDemande({ user, campagne });
  return true;
};
