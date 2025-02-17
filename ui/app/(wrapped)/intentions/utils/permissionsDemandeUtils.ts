import {hasPermission, hasRole} from 'shared';
import {RoleEnum} from 'shared/enum/roleEnum';
import type { CampagneType } from 'shared/schema/campagneSchema';
import type { UserType } from 'shared/schema/userSchema';
import { isCampagneEnCours, isCampagneTerminee } from 'shared/utils/campagneUtils';
import {isStatutDemandeValidee, isStatutRefusee} from 'shared/utils/statutDemandeUtils';
import { isTypeAjustement } from 'shared/utils/typeDemandeUtils';

import {feature} from '@/utils/feature';

import type {DemandeIntention} from './permissionsIntentionUtils';

export const canCreateDemande = ({
  user,
  campagne,
  currentCampagne
} : {
  user?: UserType,
  campagne: CampagneType;
  currentCampagne: CampagneType
}) => {
  const isCampagneRegionale = campagne?.codeRegion;
  if(isCampagneRegionale) {
    const isCampagneRegionaleEnCours = campagne?.hasCampagneRegionEnCours;
    const isCampagneRegionaleOfUser = user?.codeRegion === campagne?.codeRegion;
    const isCampagneWithSaisiePerdir = campagne?.withSaisiePerdir;
    return !feature.saisieDisabled &&
      isCampagneEnCours(campagne) &&
      currentCampagne.id === campagne.id &&
      hasPermission(user?.role, "intentions/ecriture") &&
      isCampagneRegionaleEnCours && isCampagneRegionaleOfUser && isCampagneWithSaisiePerdir;
  }

  return !feature.saisieDisabled &&
    isCampagneEnCours(campagne) &&
    currentCampagne.id === campagne.id &&
    hasPermission(user?.role, "intentions/ecriture");
};

export const canEditDemande = ({
  demande,
  user,
} : {
  demande: DemandeIntention,
  user?: UserType
}): boolean => {
  const canUserEditDemande = demande.canEdit;
  const canEditStatut = (
    !isStatutDemandeValidee(demande.statut) &&
    !isStatutRefusee(demande.statut)
  );

  console.log(canUserEditDemande);

  return (
    !feature.saisieDisabled &&
    canUserEditDemande &&
    canEditStatut &&
    isCampagneEnCours(demande?.campagne) &&
    hasPermission(user?.role, "intentions/ecriture")
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
  !isTypeAjustement(demande.typeDemande);

