import {hasPermission, hasRole, isUserInRegionsExperimentation2024, isUserNational, RoleEnum} from 'shared';
import type {DemandeStatutType} from 'shared/enum/demandeStatutEnum';
import {DemandeStatutEnum } from 'shared/enum/demandeStatutEnum';
import type {DemandeTypeType} from 'shared/enum/demandeTypeEnum';
import { PermissionEnum } from 'shared/enum/permissionEnum';
import type { CampagneType } from 'shared/schema/campagneSchema';
import type { UserType } from 'shared/schema/userSchema';
import { isCampagneEnCours, isCampagneTerminee } from 'shared/utils/campagneUtils';
import { isStatutDemandeValidee } from 'shared/utils/statutDemandeUtils';
import { isTypeAjustement } from 'shared/utils/typeDemandeUtils';

import {feature} from '@/utils/feature';
import { isUserPartOfExpe} from '@/utils/isPartOfExpe';

import { canCreateDemande, canEditDemande } from './permissionsDemandeUtils';

export type DemandeIntention = {
  campagne: CampagneType,
  statut: DemandeStatutType,
  typeDemande: DemandeTypeType,
  canEdit: boolean,
  isIntention: boolean
}

export const canCreateDemandeIntention = ({
  user,
  campagne,
} : {
  user?: UserType,
  campagne: CampagneType,
}): boolean => {
  if(campagne?.annee === "2023" || (
    campagne?.annee === "2024" &&
    !isUserInRegionsExperimentation2024({ user })
  )) return canCreateDemande({ user, campagne });
  return canCreateIntention({ user, campagne });
};

/**
 * Vérifie si l'utilisateur peut créer une intention
 *
 * - Si la saisie n'est pas désactivée
 * - Si la campagne est en cours
 * - Si l'utilisateur est national
 * - On autorise la création
 * OU
 * - Si la saisie n'est pas désactivée
 * - Si la campagne est en cours
 * - Si l'utilisateur a les droits sur l'édition des intentions en général
 * - Si l'utilisateur fait partie de l'expérimentation
 * - Si la campa
 * - Si l'utilisateur est un PERDIR
 *  - Si la campagne est régionale
 *  - Si l'utilisateur est bien dans la région de la campagne
 *  - Si celle-ci autorise la saisie PERDIR
 *  - On autorise la création
 */
export const canCreateIntention = ({
  user,
  campagne
} : {
  user?: UserType,
  campagne: CampagneType
}) => {
  if(feature.saisieDisabled) return false;
  if(!isCampagneEnCours(campagne)) return false;
  if(isUserNational({user})) return true;
  if(!hasPermission(user?.role, PermissionEnum["intentions-perdir/ecriture"])) return false;
  if(!isUserPartOfExpe({ user, campagne })) return false;
  if(hasRole({ user, role: RoleEnum["perdir"] })) {
    const isCampagneRegionale = campagne?.codeRegion;
    const isCampagneRegionaleOfUser = user?.codeRegion === campagne?.codeRegion;
    const withSaisiePerdir = (
      isCampagneRegionale && isCampagneRegionaleOfUser
    ) ? campagne?.withSaisiePerdir : true;

    return !!withSaisiePerdir;
  }
  return true;
};

export const canEditIntentionStatut = ({
  intention,
  user
} : {
  intention: DemandeIntention,
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

  if(hasRole({ user, role: RoleEnum["perdir"] })) return editableStatutsPerdir.includes(intention.statut);
  if(hasRole({ user, role: RoleEnum["admin"] }) || hasRole({ user, role: RoleEnum["admin_region"] })) return editableStatutsAdmin.includes(intention.statut);
  else return editableStatuts.includes(intention.statut);
};

export const canEditDemandeIntention = ({
  demandeIntention,
  user
} : {
  demandeIntention: DemandeIntention,
  user?: UserType
}): boolean => {
  if(demandeIntention.isIntention) return canEditIntention({ intention: demandeIntention, user });
  return canEditDemande({ demande: demandeIntention, user });
};

/**
 * Vérifie si on peut modifier une intention :
 *
 * - Si l'utilisateur a les droits sur l'édition des intentions en général
 *    - si l'utilisateur peut éditer cette intention
 *    - si l'utilisateur peut éditer le statut de l'intention
 *    - si l'utilisateur est un perdir
 *      - si la campagne est régionale,
 *      - si l'utilisateur est bien dans la région de la campagne
 *      - si celle-ci autorise la saisie PERDIR
 *      - si la saisie n'est pas désactivée
 */
export const canEditIntention = ({
  intention,
  user,
} : {
  intention: DemandeIntention,
  user?: UserType
}): boolean => {
  if (!canEditIntentionStatut({ intention, user })) return false;
  if (!intention.canEdit) return false;
  return canCreateIntention({ user, campagne: intention.campagne });

  // Si l'utilisateur est PERDIR,
  if(hasRole({ user, role: RoleEnum["perdir"] })) {
    // Si une campagne est régionale, on vérifie si l'utilisateur est bien dans la région de la campagne et quel celle-ci autorise la saisie PERDIR
    const isCampagneRegionale = !!intention.campagne?.codeRegion;
    const isCampagneRegionaleOfUser = user?.codeRegion === intention.campagne?.codeRegion;
    const withSaisiePerdir = (
      isCampagneRegionale && isCampagneRegionaleOfUser
    ) ? !!intention.campagne?.withSaisiePerdir : true;

    // si la campagne autorise la saisie PERDIR
    return withSaisiePerdir;
  }
  return true;
};

export const canDeleteIntention = ({ intention, user } : { intention: DemandeIntention; user?: UserType; }) =>
  canEditIntention({ intention, user }) &&
  !hasRole({ user, role: RoleEnum["expert_region"] }) &&
  !hasRole({ user, role: RoleEnum["region"] });

export const canImportIntention = ({
  isAlreadyImported,
  isLoading,
  user,
  campagne
} : {
  isAlreadyImported: boolean,
  isLoading: boolean,
  user?: UserType,
  campagne?: CampagneType
}) =>  (
  !isAlreadyImported &&
  !isLoading &&
  isCampagneTerminee(campagne) &&
  hasPermission(user?.role, PermissionEnum["intentions-perdir/ecriture"])
);

export const canCorrectIntention = ({
  intention,
  user,
} : {
  intention?: DemandeIntention,
  user?: UserType
}) =>
  feature.correction &&
  intention &&
  hasPermission(user?.role, PermissionEnum["intentions-perdir/ecriture"]) &&
  isCampagneTerminee(intention?.campagne) &&
  isStatutDemandeValidee(intention.statut) &&
  !hasRole({user, role: RoleEnum["perdir"]}) &&
  !isTypeAjustement(intention.typeDemande);

export const canCheckIntention = ({
  intention,
  checkedIntentions,
  user
}:{
  intention: DemandeIntention,
  checkedIntentions: { statut: DemandeStatutType, intentions: Array<string> } | undefined,
  user?: UserType
}) => {
  if(!hasPermission(user?.role, PermissionEnum["intentions-perdir/ecriture"])) return false;
  if(!canEditIntentionStatut({ intention, user })) return false;
  return !checkedIntentions?.intentions ||
    checkedIntentions?.intentions.length === 0 ||
    checkedIntentions?.statut === intention.statut;
};
