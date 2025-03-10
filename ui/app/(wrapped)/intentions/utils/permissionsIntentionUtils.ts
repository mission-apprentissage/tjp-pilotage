import {hasPermission, hasRole, isUserNational, RoleEnum} from 'shared';
import type {DemandeStatutType} from 'shared/enum/demandeStatutEnum';
import type {DemandeTypeType} from 'shared/enum/demandeTypeEnum';
import { PermissionEnum } from 'shared/enum/permissionEnum';
import type { CampagneType } from 'shared/schema/campagneSchema';
import type { UserType } from 'shared/schema/userSchema';
import { isCampagneEnCours, isCampagneTerminee } from 'shared/utils/campagneUtils';
import { isStatutBrouillon, isStatutDemandeValidee, isStatutDossierIncomplet, isStatutProposition,isStatutRefusee } from 'shared/utils/statutDemandeUtils';
import { isTypeAjustement } from 'shared/utils/typeDemandeUtils';

import {feature} from '@/utils/feature';
import { isUserPartOfExpe} from '@/utils/isPartOfExpe';

import { canEditDemande } from './permissionsDemandeUtils';

export type DemandeIntention = {
  campagne: CampagneType,
  statut: DemandeStatutType,
  typeDemande: DemandeTypeType,
  canEdit: boolean,
  isIntention: boolean
}

export const canCreateIntention = ({
  user,
  campagne
} : {
  user?: UserType,
  campagne: CampagneType
}) => {
  if(isUserNational({user}) && isCampagneEnCours(campagne)) return true;
  const isCampagneRegionale = !!campagne?.codeRegion;
  const withSaisiePerdir = hasRole({ user, role: RoleEnum["perdir"] }) ? !!campagne?.withSaisiePerdir : true;
  return !feature.saisieDisabled &&
    hasPermission(user?.role, PermissionEnum["intentions-perdir/ecriture"]) &&
    isUserPartOfExpe({ user, campagne }) &&
    isCampagneEnCours(campagne) &&
    isCampagneRegionale &&
    withSaisiePerdir;
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

export const canEditIntention = ({
  intention,
  user,
} : {
  intention: DemandeIntention,
  user?: UserType
}): boolean => {
  // Si l'utilisateur n'est pas autorisé à éditer les intentions
  if(!isUserPartOfExpe({ user, campagne: intention.campagne })) return false;
  const canUserEditIntention = intention.canEdit;
  const canEditStatut = (
    !isStatutDemandeValidee(intention.statut) &&
    !isStatutRefusee(intention.statut)
  );
  // Si l'utilisateur est PERDIR,
  if(hasRole({ user, role: RoleEnum["perdir"] })) {
    // On vérifie si la demande est dans un statut qui peut être modifié par le PERDIR
    const canPerdirEditStatut = canEditStatut && (
      isStatutBrouillon(intention.statut) ||
      isStatutProposition(intention.statut) ||
      isStatutDossierIncomplet(intention.statut)
    );

    // Si une campagne est régionale, on vérifie si l'utilisateur est bien dans la région de la campagne et quel celle-ci autorise la saisie PERDIR
    const isCampagneRegionale = !!intention.campagne?.codeRegion;
    const isCampagneRegionaleOfUser = user?.codeRegion === intention.campagne?.codeRegion;
    const withSaisiePerdir = (
      isCampagneRegionale && isCampagneRegionaleOfUser
    ) ? !!intention.campagne?.withSaisiePerdir : true;

    // Si la saisie n'est pas désactivée,
    // si l'utilisateur peut modifier la demande,
    // si le statut de la demande peut être modifié par le PERDIR,
    // si la campagne autorise la saisie PERDIR
    return (
      !feature.saisieDisabled &&
      hasPermission(user?.role, PermissionEnum["intentions-perdir/ecriture"]) &&
      canUserEditIntention &&
      canPerdirEditStatut &&
      withSaisiePerdir
    );
  }

  // Si l'utilisateur n'est pas PERDIR,
  // si la saisie n'est pas désactivée,
  // si l'utilisateur peut modifier la demande,
  // si le statut de la demande peut être modifié par l'utilisateur
  return (
    !feature.saisieDisabled &&
    hasPermission(user?.role, PermissionEnum["intentions-perdir/ecriture"]) &&
    canUserEditIntention &&
    canEditStatut &&
    isCampagneEnCours(intention.campagne)
  );
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
  return !checkedIntentions?.intentions ||
    checkedIntentions?.intentions.length === 0 ||
    checkedIntentions?.statut === intention.statut;
};
