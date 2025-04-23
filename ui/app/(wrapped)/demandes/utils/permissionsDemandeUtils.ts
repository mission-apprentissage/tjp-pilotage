import {hasPermission, hasRole, isUserInRegionsExperimentation2024} from 'shared';
import type {DemandeStatutType} from 'shared/enum/demandeStatutEnum';
import {DemandeStatutEnum} from 'shared/enum/demandeStatutEnum';
import type {TypeDemandeType} from 'shared/enum/demandeTypeEnum';
import {PermissionEnum} from 'shared/enum/permissionEnum';
import {RoleEnum} from 'shared/enum/roleEnum';
import type { CampagneType } from 'shared/schema/campagneSchema';
import type { UserType } from 'shared/schema/userSchema';
import {isAdmin, isUserNational} from 'shared/security/securityUtils';
import { isCampagneEnCours, isCampagneTerminee } from 'shared/utils/campagneUtils';
import {isStatutDemandeValidee, isStatutRefusee} from 'shared/utils/statutDemandeUtils';
import { isTypeAjustement } from 'shared/utils/typeDemandeUtils';

import {feature} from '@/utils/feature';
import {isUserPartOfExpe} from '@/utils/isPartOfExpe';


export type Demande = {
  campagne: CampagneType,
  statut: DemandeStatutType,
  typeDemande: TypeDemandeType,
  canEdit: boolean,
  isOldDemande: boolean
}

export const isOldDemande = ({
  demande,
  campagne,
  user
}:{
  demande?: Demande
  campagne?: CampagneType
  user?: UserType
}) => {
  if(
    (demande?.isOldDemande) ||
    (campagne?.annee === "2023" || (
      campagne?.annee === "2024" &&
      !isUserInRegionsExperimentation2024({ user })
    ))
  ) return true;
  return false;
};

const canCreateOldDemande  = ({
  user,
  campagne,
} : {
  user?: UserType,
  campagne: CampagneType,
}): boolean => {
  if(feature.saisieDisabled) return false;
  if(!isCampagneEnCours(campagne)) return false;
  if(isUserNational({user})) return true;
  if(campagne?.annee === "2023" || (
    campagne?.annee === "2024" &&
    !isUserInRegionsExperimentation2024({ user })
  )) return false;
  if(!hasPermission(user?.role, PermissionEnum["demande/ecriture"])) return false;
  return true;
};

export const canCreateDemande = ({
  user,
  campagne,
} : {
  user?: UserType,
  campagne: CampagneType,
}): boolean => {
  if(isOldDemande({ user, campagne })) return canCreateOldDemande({ user, campagne });
  else {
    if(feature.saisieDisabled) return false;
    if(!isCampagneEnCours(campagne)) return false;
    if(isUserNational({user})) return true;
    if(!hasPermission(user?.role, PermissionEnum["demande/ecriture"])) return false;
    if(!isUserPartOfExpe({ user, campagne })) return false;
    if(campagne.annee !== "2023" && campagne.annee !== "2024") {
      const isCampagneRegionale = campagne.codeRegion;
      const isCampagneRegionaleOfUser = isCampagneRegionale && (user?.codeRegion === campagne.codeRegion);
      if(!isCampagneRegionaleOfUser) return false;
      return hasRole({ user, role: RoleEnum["perdir"] }) ? !!campagne.withSaisiePerdir : true;
    }
    return true;
  }
};

export const canEditDemandeStatut = ({
  demande,
  user
} : {
  demande: Demande,
  user?: UserType
}) => {
  const editableStatutsPerdir: Array<DemandeStatutType> = [
    DemandeStatutEnum["brouillon"],
    DemandeStatutEnum["proposition"],
    DemandeStatutEnum["dossier incomplet"]
  ];
  const editableStatuts: Array<DemandeStatutType> = [
    ...editableStatutsPerdir,
    DemandeStatutEnum["dossier complet"],
    DemandeStatutEnum["projet de demande"],
    DemandeStatutEnum["prêt pour le vote"],
  ];
  const editableStatutsAdmin: Array<DemandeStatutType> = [
    ...editableStatuts,
    DemandeStatutEnum["demande validée"],
    DemandeStatutEnum["refusée"],
  ];

  if(hasRole({ user, role: RoleEnum["perdir"] })) return editableStatutsPerdir.includes(demande.statut);
  if(hasRole({ user, role: RoleEnum["admin"] }) || hasRole({ user, role: RoleEnum["admin_region"] })) return editableStatutsAdmin.includes(demande.statut);
  else return editableStatuts.includes(demande.statut);
};

const canEditOldDemande = ({
  demande,
  user
} : {
  demande: Demande,
  user?: UserType
}): boolean => {
  if(feature.saisieDisabled) return false;
  if(!demande.canEdit) return false;
  if(!isCampagneEnCours(demande?.campagne)) return false;
  if(!hasPermission(user?.role, "demande/ecriture")) return false;
  return isAdmin({user}) ||
    (
      !isStatutDemandeValidee(demande.statut) &&
      !isStatutRefusee(demande.statut)
    ) && canCreateDemande({ user, campagne: demande.campagne });
};

export const canEditDemande = ({
  demande,
  user
} : {
  demande: Demande,
  user?: UserType
}): boolean => {
  if(isOldDemande({demande, user})) return canEditOldDemande({ demande: demande, user });
  if (!canEditDemandeStatut({ demande, user })) return false;
  if (!demande.canEdit) return false;
  return canCreateDemande({ user, campagne: demande.campagne });
};

export const canDeleteDemande = ({ demande, user, } : { demande: Demande; user?: UserType }): boolean => (
  canEditDemande({ demande, user }) &&
  !hasRole({ user, role: RoleEnum["expert_region"] }) &&
  !hasRole({ user, role: RoleEnum["region"] })
);

export const canImportDemande = ({
  isAlreadyImported,
  isLoading,
  user,
  campagne
} : {
    isAlreadyImported: boolean,
    isLoading: boolean,
    user?: UserType,
    campagne?: CampagneType
  }) => {
  return (
    !isAlreadyImported &&
    !isLoading &&
    isCampagneTerminee(campagne) &&
    hasPermission(user?.role, PermissionEnum["demande/ecriture"])
  );
};

export const canCorrectDemande = ({
  demande,
  user,
} : {
  demande?: Demande,
  user?: UserType
}): boolean =>
  feature.correction &&
  !!demande &&
  hasPermission(user?.role, PermissionEnum["demande/ecriture"]) &&
  isCampagneTerminee(demande?.campagne) &&
  isStatutDemandeValidee(demande.statut) &&
  !hasRole({user, role: RoleEnum["perdir"]}) &&
  !isTypeAjustement(demande.typeDemande);

export const canCheckDemande = ({
  demande,
  checkedDemandes,
  user
}:{
  demande: Demande,
  checkedDemandes: { statut: DemandeStatutType, demandes: Array<string> } | undefined,
  user?: UserType
}) => {
  if(!hasPermission(user?.role, PermissionEnum["demande/ecriture"])) return false;
  if(!canEditDemandeStatut({ demande, user })) return false;
  return !checkedDemandes?.demandes ||
    checkedDemandes?.demandes.length === 0 ||
    checkedDemandes?.statut === demande.statut;
};

