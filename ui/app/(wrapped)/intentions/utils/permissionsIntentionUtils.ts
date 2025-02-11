import {hasPermission, hasRole, RoleEnum} from 'shared';
import type {DemandeStatutType} from 'shared/enum/demandeStatutEnum';
import type {DemandeTypeType} from 'shared/enum/demandeTypeEnum';
import type { CampagneType } from 'shared/schema/campagneSchema';
import type { UserType } from 'shared/schema/userSchema';
import { isCampagneEnCours, isCampagneTerminee } from 'shared/utils/campagneUtils';
import { isStatutBrouillon, isStatutDemandeValidee, isStatutDossierIncomplet, isStatutProposition,isStatutRefusee } from 'shared/utils/statutDemandeUtils';

import {feature} from '@/utils/feature';
import { isUserPartOfExpe} from '@/utils/isPartOfExpe';


type Intention = { campagne: CampagneType, statut: DemandeStatutType, typeDemande: DemandeTypeType, canEdit: boolean }

export const canCreateIntention = ({ user, campagne } : { user?: UserType, campagne: CampagneType }) => {
  return !feature.saisieDisabled && isUserPartOfExpe({ user, campagne }) && isCampagneEnCours(campagne);
};

export const canEditIntention = ({
  intention,
  user,
} : {
  intention: Intention,
  user?: UserType
}) => {
  if(!isUserPartOfExpe({ user, campagne: intention.campagne })) return false;
  const canUserEditIntention = intention.canEdit;
  const canEditStatut = (
    !isStatutDemandeValidee(intention.statut) &&
    !isStatutRefusee(intention.statut)
  );

  if(hasRole({ user, role: RoleEnum["perdir"] })) {
    const canPerdirEditStatut = canEditStatut && (
      isStatutBrouillon(intention.statut) ||
      isStatutProposition(intention.statut) ||
      isStatutDossierIncomplet(intention.statut)
    );

    return (
      !feature.saisieDisabled &&
      canUserEditIntention &&
      canPerdirEditStatut &&
      isCampagneEnCours(intention.campagne)
    );
  }

  return (
    !feature.saisieDisabled &&
    canUserEditIntention &&
    canEditStatut &&
    isCampagneEnCours(intention.campagne)
  );
};

export const canDeleteIntention = ({ intention, user } : { intention: Intention; user?: UserType; }) =>
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
  hasPermission(user?.role, "intentions-perdir/ecriture")
);

export const canCorrectIntention = ({
  intention,
  user,
} : {
  intention?: Intention,
  user?: UserType
}) =>
  feature.correction &&
  intention &&
  hasPermission(user?.role, "intentions-perdir/ecriture") &&
  isCampagneTerminee(intention?.campagne) &&
  isStatutDemandeValidee(intention.statut);
  // !isTypeAjustement(intention.typeDemande);
