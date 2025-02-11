import {hasPermission, hasRole} from 'shared';
import type {DemandeStatutType} from 'shared/enum/demandeStatutEnum';
import type {DemandeTypeType} from 'shared/enum/demandeTypeEnum';
import {RoleEnum} from 'shared/enum/roleEnum';
import type { CampagneType } from 'shared/schema/campagneSchema';
import type { UserType } from 'shared/schema/userSchema';
import { isCampagneEnCours, isCampagneTerminee } from 'shared/utils/campagneUtils';
import {isStatutDemandeValidee, isStatutRefusee} from 'shared/utils/statutDemandeUtils';
import { isTypeAjustement } from 'shared/utils/typeDemandeUtils';

import {feature} from '@/utils/feature';

type Demande = {
   campagne: CampagneType,
   statut: DemandeStatutType,
   typeDemande: DemandeTypeType,
   canEdit: boolean
}

export const canCreateDemande = ({ user, campagne } : { user?: UserType, campagne: CampagneType }) =>
  !feature.saisieDisabled &&
  isCampagneEnCours(campagne) &&
  hasPermission(user?.role, "intentions/ecriture");

export const canEditDemande = ({
  demande,
  user,
} : {
  demande: Demande,
  user?: UserType
}) => {
  const canUserEditDemande = demande.canEdit;
  const canEditStatut = (
    !isStatutDemandeValidee(demande.statut) &&
    !isStatutRefusee(demande.statut)
  );

  return (
    !feature.saisieDisabled &&
    canUserEditDemande &&
    canEditStatut &&
    isCampagneEnCours(demande?.campagne) &&
    hasPermission(user?.role, "intentions/ecriture")
  );
};

export const canDeleteDemande = ({ demande, user, } : { demande: Demande; user?: UserType }) =>
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
  demande?: Demande,
  user?: UserType
}) =>
  feature.correction &&
  demande &&
  isStatutDemandeValidee(demande.statut) &&
  hasPermission(user?.role, "intentions/ecriture") &&
  isCampagneTerminee(demande?.campagne) &&
  !isTypeAjustement(demande.typeDemande);

