import type {Role} from 'shared';
import {hasPermission, hasRole, isUserInRegionsExperimentation2024, RoleEnum} from 'shared';
import type {CampagneType} from 'shared/schema/campagneSchema';


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
  if(campagne?.annee !== "2025") return isNotPerdirPartOfExpe({ user, campagne });
  const isCampagneRegionale = campagne?.codeRegion;
  if(isCampagneRegionale) {
    const isCampagneRegionaleEnCours = campagne?.hasCampagneRegionEnCours;
    const isCampagneRegionaleOfUser = user?.codeRegion === campagne?.codeRegion;
    const isCampagneWithSaisiePerdir = campagne?.withSaisiePerdir;
    return isCampagneRegionaleEnCours && isCampagneRegionaleOfUser && isCampagneWithSaisiePerdir;
  }
  return true;
};

export const isNotPerdirPartOfExpe = ({
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
  if(campagne?.annee === "2024") return isUserInRegionsExperimentation2024({ user });
  return true;
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
  if(!hasPermission(user?.role, "intentions-perdir/ecriture")) return false;
  if(hasRole({ user, role: RoleEnum["perdir"] })) return isPerdirPartOfExpe({ user, campagne });
  return isNotPerdirPartOfExpe({ user, campagne });
};
