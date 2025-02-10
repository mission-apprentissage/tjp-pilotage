import {hasPermission, hasRole} from 'shared';
import { CampagneStatutEnum } from 'shared/enum/campagneStatutEnum';
import type {DemandeStatutType} from 'shared/enum/demandeStatutEnum';
import {DemandeStatutEnum} from 'shared/enum/demandeStatutEnum';
import type {DemandeTypeType} from 'shared/enum/demandeTypeEnum';
import {RoleEnum} from 'shared/enum/roleEnum';
import type { CampagneType } from 'shared/schema/campagneSchema';
import type { UserType } from 'shared/schema/userSchema';
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
  campagne.statut === CampagneStatutEnum["en cours"] &&
  hasPermission(user?.role, "intentions/ecriture");

export const canEditDemande = ({
  demande,
  user,
} : {
  demande: Demande,
  user?: UserType
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
  campagne?.statut === CampagneStatutEnum["terminée"] &&
  hasPermission(user?.role, "intentions/ecriture")
);

export const canCorrectDemande = ({
  demande,
  user,
} : {
  demande: Demande,
  user?: UserType
}) =>
  feature.correction &&
  demande.statut === DemandeStatutEnum["demande validée"] &&
  hasPermission(user?.role, "intentions/ecriture") &&
  !isTypeAjustement(demande.typeDemande);

