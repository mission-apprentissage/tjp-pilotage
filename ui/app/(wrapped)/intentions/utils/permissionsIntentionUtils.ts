import {hasPermission, hasRole} from 'shared';
import { CampagneStatutEnum } from 'shared/enum/campagneStatutEnum';
import type {DemandeStatutType} from 'shared/enum/demandeStatutEnum';
import {DemandeStatutEnum} from 'shared/enum/demandeStatutEnum';
import type {DemandeTypeType} from 'shared/enum/demandeTypeEnum';
import type { CampagneType } from 'shared/schema/campagneSchema';
import type { UserType } from 'shared/schema/userSchema';
import { isTypeAjustement } from 'shared/utils/typeDemandeUtils';

import {feature} from '@/utils/feature';
import { isUserPartOfExpe} from '@/utils/isPartOfExpe';


type Intention = { campagne: CampagneType, statut: DemandeStatutType, typeDemande: DemandeTypeType, canEdit: boolean }

export const canCreateIntention = ({ user, campagne } : { user?: UserType, campagne: CampagneType }) => {
  return !feature.saisieDisabled && isUserPartOfExpe({ user, campagne }) && campagne.statut === CampagneStatutEnum["en cours"];
};

export const canEditIntention = ({
  intention,
  user,
} : {
  intention: Intention,
  user?: UserType
}) => {
  if(!isUserPartOfExpe({ user, campagne: intention.campagne })) return false;
  const isCampagneEnCours = intention.campagne?.statut === CampagneStatutEnum["en cours"];
  const canUserEditIntention = intention.canEdit;
  const canEditStatut = (
    intention.statut !== DemandeStatutEnum["demande validée"] &&
    intention.statut !== DemandeStatutEnum["refusée"]
  );

  if(hasRole({ user, role: "perdir" })) {
    const canPerdirEditStatut = canEditStatut && (
      intention.statut === DemandeStatutEnum["brouillon"] ||
      intention.statut === DemandeStatutEnum["proposition"] ||
      intention.statut === DemandeStatutEnum["dossier incomplet"]
    );

    return (
      !feature.saisieDisabled &&
      canUserEditIntention &&
      canPerdirEditStatut &&
      isCampagneEnCours
    );
  }

  return (
    !feature.saisieDisabled &&
    canUserEditIntention &&
    canEditStatut &&
    isCampagneEnCours
  );
};

export const canDeleteIntention = ({ intention, user } : { intention: Intention; user?: UserType; }) =>
  canEditIntention({ intention, user }) &&
  !hasRole({ user, role: "expert_region" }) &&
  !hasRole({ user, role: "region" });

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
  campagne?.statut === CampagneStatutEnum["terminée"] &&
  hasPermission(user?.role, "intentions-perdir/ecriture")
);

export const canCorrectIntention = ({
  intention,
  user,
} : {
  intention: Intention,
  user?: UserType
}) =>
  feature.correction &&
  isUserPartOfExpe({ user, campagne: intention.campagne }) &&
  intention.statut === DemandeStatutEnum["demande validée"] &&
  !isTypeAjustement(intention.typeDemande);

