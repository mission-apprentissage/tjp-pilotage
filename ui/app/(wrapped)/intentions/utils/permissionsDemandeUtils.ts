import {hasPermission, hasRole} from 'shared';
import { CampagneStatutEnum } from 'shared/enum/campagneStatutEnum';
import type {DemandeStatutType} from 'shared/enum/demandeStatutEnum';
import {DemandeStatutEnum} from 'shared/enum/demandeStatutEnum';
import type {DemandeTypeType} from 'shared/enum/demandeTypeEnum';
import type { CampagneType } from 'shared/schema/campagneSchema';
import type {Role} from 'shared/security/permissions';
import { isTypeAjustement } from 'shared/utils/typeDemandeUtils';

import {feature} from '@/utils/feature';


type User = { role?: Role }
type Demande = {
   campagne: CampagneType,
   statut: DemandeStatutType,
   typeDemande: DemandeTypeType,
   canEdit: boolean
}

export const canCreateDemande = ({ user, campagne } : { user?: User, campagne: CampagneType }) =>
  !feature.saisieDisabled &&
  campagne.statut === CampagneStatutEnum["en cours"] &&
  hasPermission(user?.role, "intentions/ecriture");


export const canEditDemande = ({
  demande,
  user,
} : {
  demande: Demande,
  user?: User
}) => {
  const isCampagneEnCours = demande.campagne?.statut === CampagneStatutEnum["en cours"];
  const canUserEditDemande = demande.canEdit;
  const canEditStatut = (
    demande.statut !== DemandeStatutEnum["demande validée"] &&
    demande.statut !== DemandeStatutEnum["refusée"]
  );

  return (
    !feature.saisieDisabled &&
    canUserEditDemande &&
    canEditStatut &&
    isCampagneEnCours &&
    hasPermission(user?.role, "intentions/ecriture")
  );
};

export const canDeleteDemande = ({ user } : { user?: User }) =>  (
  hasPermission(user?.role, "intentions/ecriture") &&
    !hasRole({ user, role: "expert_region" }) &&
    !hasRole({ user, role: "region" })
);

export const canImportDemande = ({
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
  hasPermission(user?.role, "intentions/ecriture")
);

export const canShowCorrectionButtonDemande = ({
  demande,
  user,
} : {
  demande: Demande,
  user?: User
}) =>
  feature.correction &&
  demande.statut === DemandeStatutEnum["demande validée"] &&
  hasPermission(user?.role, "intentions/ecriture") &&
  !isTypeAjustement(demande.typeDemande);

