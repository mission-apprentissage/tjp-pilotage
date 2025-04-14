import {hasPermission, hasRole} from 'shared';
import {PermissionEnum} from 'shared/enum/permissionEnum';
import {RoleEnum} from 'shared/enum/roleEnum';
import type { CampagneType } from 'shared/schema/campagneSchema';
import type { UserType } from 'shared/schema/userSchema';
import {isAdmin, isUserNational} from 'shared/security/securityUtils';
import { isCampagneEnCours, isCampagneTerminee } from 'shared/utils/campagneUtils';
import {isStatutDemandeValidee, isStatutRefusee} from 'shared/utils/statutDemandeUtils';
import { isTypeAjustement } from 'shared/utils/typeDemandeUtils';

import {feature} from '@/utils/feature';

import type {DemandeIntention} from './permissionsIntentionUtils';

export const canCreateDemande = ({
  user,
  campagne,
} : {
  user?: UserType,
  campagne: CampagneType;
}) => {
  if(feature.saisieDisabled) return false;
  if(!isCampagneEnCours(campagne)) return false;
  if(isUserNational({user})) return true;
  if(!hasPermission(user?.role, PermissionEnum["intentions/ecriture"])) return false;
  return true;
};

export const canEditDemande = ({
  demande,
  user,
} : {
  demande: DemandeIntention,
  user?: UserType
}): boolean => {
  if(feature.saisieDisabled) return false;
  if(!demande.canEdit) return false;
  if(!isCampagneEnCours(demande?.campagne)) return false;
  if(!hasPermission(user?.role, "intentions/ecriture")) return false;
  return isAdmin({user}) ||
    (
      !isStatutDemandeValidee(demande.statut) &&
      !isStatutRefusee(demande.statut)
    );
};

export const canDeleteDemande = ({ demande, user, } : { demande: DemandeIntention; user?: UserType }) =>
  canEditDemande({user, demande}) &&
  !hasRole({ user, role: RoleEnum["expert_region"] }) &&
  !hasRole({ user, role: RoleEnum["region"] });


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
}) =>  (
  !isAlreadyImported &&
  !isLoading &&
  isCampagneTerminee(campagne) &&
  hasPermission(user?.role, "intentions/ecriture")
);

export const canCorrectDemande = ({
  demande,
  user,
} : {
  demande?: DemandeIntention,
  user?: UserType
}) =>
  feature.correction &&
  demande &&
  isStatutDemandeValidee(demande.statut) &&
  hasPermission(user?.role, "intentions/ecriture") &&
  isCampagneTerminee(demande?.campagne) &&
  !hasRole({user, role: RoleEnum["perdir"]}) &&
  !isTypeAjustement(demande.typeDemande);

