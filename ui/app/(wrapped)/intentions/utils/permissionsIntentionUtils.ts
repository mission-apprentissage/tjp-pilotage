import type {Role} from 'shared';
import {hasPermission, hasRole} from 'shared';
import { CampagneStatutEnum } from 'shared/enum/campagneStatutEnum';
import type {DemandeStatutType} from 'shared/enum/demandeStatutEnum';
import {DemandeStatutEnum} from 'shared/enum/demandeStatutEnum';
import type {DemandeTypeType} from 'shared/enum/demandeTypeEnum';
import type { CampagneType } from 'shared/schema/campagneSchema';
import { isTypeAjustement } from 'shared/utils/typeDemandeUtils';

import {feature} from '@/utils/feature';


type User = { role?: Role }
type Intention = { campagne: CampagneType, statut: DemandeStatutType, typeDemande: DemandeTypeType, canEdit: boolean }

export const canCreateIntention = ({ user, campagne } : { user?: User, campagne: CampagneType }) => {
  const isCampagneEnCours = campagne.statut === CampagneStatutEnum["en cours"];
  const isPerdir = hasRole({ user, role: "perdir" });

  if(isPerdir) {
    const canPerdirEdit = !campagne.hasCampagneRegionEnCours ||
     (campagne.hasCampagneRegionEnCours && campagne?.withSaisiePerdir === true);

    return (
      !feature.saisieDisabled &&
      canPerdirEdit &&
      isCampagneEnCours &&
      hasPermission(user?.role, "intentions-perdir/ecriture")
    );
  }
  return (
    !feature.saisieDisabled &&
    isCampagneEnCours &&
    hasPermission(user?.role, "intentions-perdir/ecriture")
  );
};

export const canEditIntention = ({
  intention,
  user,
} : {
  intention: Intention,
  user?: User
}) => {
  const isCampagneEnCours = intention.campagne?.statut === CampagneStatutEnum["en cours"];
  const canUserEditIntention = intention.canEdit;
  const canEditStatut = (
    intention.statut !== DemandeStatutEnum["demande validée"] &&
    intention.statut !== DemandeStatutEnum["refusée"]
  );
  const isPerdir = hasRole({ user, role: "perdir" });

  if(isPerdir) {
    const canPerdirEdit = !intention.campagne.hasCampagneRegionEnCours ||
     (intention.campagne.hasCampagneRegionEnCours && intention.campagne?.withSaisiePerdir === true);

    const canPerdirEditStatut = canEditStatut && (
      intention.statut === DemandeStatutEnum["brouillon"] ||
      intention.statut === DemandeStatutEnum["proposition"] ||
      intention.statut === DemandeStatutEnum["dossier incomplet"]
    );

    return (
      !feature.saisieDisabled &&
      canUserEditIntention &&
      canPerdirEdit &&
      canPerdirEditStatut &&
      isCampagneEnCours &&
      hasPermission(user?.role, "intentions-perdir/ecriture")
    );
  }

  return (
    !feature.saisieDisabled &&
    canUserEditIntention &&
    canEditStatut &&
    isCampagneEnCours &&
    hasPermission(user?.role, "intentions-perdir/ecriture")
  );
};

export const canDeleteIntention = ({ user } : { user?: User }) =>  (
  hasPermission(user?.role, "intentions-perdir/ecriture") &&
    !hasRole({ user, role: "expert_region" }) &&
    !hasRole({ user, role: "region" })
);

export const canImportIntention = ({
  isAlreadyImported,
  isLoading,
  user,
  campagne
} : {
  isAlreadyImported: boolean,
  isLoading: boolean,
  user?: User,
  campagne?: CampagneType
}) =>  (
  !isAlreadyImported &&
  !isLoading &&
  campagne?.statut === CampagneStatutEnum["terminée"] &&
  hasPermission(user?.role, "intentions-perdir/ecriture")
);

export const canShowCorrectionButtonIntention = ({
  intention,
  user,
} : {
  intention: Intention,
  user?: User
}) =>
  feature.correction &&
  intention.statut === DemandeStatutEnum["demande validée"] &&
  hasPermission(user?.role, "intentions/ecriture") &&
  !isTypeAjustement(intention.typeDemande);

