import _ from "lodash";
import { RoleEnum } from "shared";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import type { TypeAvisType } from "shared/enum/typeAvisEnum";
import { TypeAvisEnum } from "shared/enum/typeAvisEnum";
import type { UserType } from 'shared/schema/userSchema';
import { hasRole, isAdmin } from 'shared/security/securityUtils';

import type { Demande } from "@/app/(wrapped)/demandes/types";
import { isOldDemande } from "@/utils/permissionsDemandeUtils";

const possibleStatuts: Array<DemandeStatutType> =
  Object.values(DemandeStatutEnum).filter((statut) => (
    statut !== DemandeStatutEnum["supprimée"] &&
    statut !== DemandeStatutEnum["brouillon"]
  ));

export const formatStatut = (statut?: DemandeStatutType): string =>  _.capitalize(statut ?? "");

export const getOrderStatut = (statut?: DemandeStatutType): number => {
  switch (statut) {
  case DemandeStatutEnum["brouillon"]:
    return 0;
  case DemandeStatutEnum["proposition"]:
    return 1;
  case DemandeStatutEnum["dossier incomplet"]:
  case DemandeStatutEnum["dossier complet"]:
    return 2;
  case DemandeStatutEnum["projet de demande"]:
    return 3;
  case DemandeStatutEnum["prêt pour le vote"]:
    return 4;
  case DemandeStatutEnum["demande validée"]:
  case DemandeStatutEnum["refusée"]:
    return 5;
  case DemandeStatutEnum["supprimée"]:
    return 1000;
  default:
    return 0;
  }
};

export const getStepWorkflow = (statut?: DemandeStatutType): number => {
  switch (statut) {
  case DemandeStatutEnum["proposition"]:
  case DemandeStatutEnum["dossier incomplet"]:
  case DemandeStatutEnum["dossier complet"]:
    return 1;
  case DemandeStatutEnum["projet de demande"]:
    return 2;
  case DemandeStatutEnum["prêt pour le vote"]:
    return 3;
  case DemandeStatutEnum["demande validée"]:
  case DemandeStatutEnum["refusée"]:
    return 4;
  case DemandeStatutEnum["brouillon"]:
  case DemandeStatutEnum["supprimée"]:
  default:
    return 0;
  }
};

const canChangeAllStatuts = ({
  user
}: {
  user?: UserType
}) => isAdmin({ user });

export const isChangementStatutAvisDisabled = ({
  demande,
  user
}: {
  demande?: Demande,
  user?: UserType
}): boolean => {
  if(isOldDemande({demande, user})) return true;
  if(hasRole({ user, role: RoleEnum["perdir"] })) return true;
  if(canChangeAllStatuts({user})) return false;
  switch (demande?.statut) {
  case DemandeStatutEnum["demande validée"]:
  case DemandeStatutEnum["refusée"]:
    return true;
  case DemandeStatutEnum["brouillon"]:
  case DemandeStatutEnum["proposition"]:
  case DemandeStatutEnum["dossier complet"]:
  case DemandeStatutEnum["dossier incomplet"]:
  case DemandeStatutEnum["projet de demande"]:
  case DemandeStatutEnum["prêt pour le vote"]:
  default:
    return false;
  }
};

export const getStepWorkflowAvis = (typeAvis: TypeAvisType): number => {
  switch (typeAvis) {
  case TypeAvisEnum["préalable"]:
    return 1;
  case TypeAvisEnum["consultatif"]:
    return 2;
  case TypeAvisEnum["final"]:
    return 3;
  default:
    return 0;
  }
};

export const getTypeAvis = (statut?: DemandeStatutType): TypeAvisType => {
  switch (getStepWorkflow(statut)) {
  case 2:
    return TypeAvisEnum["consultatif"];
  case 3:
  case 4:
    return TypeAvisEnum["final"];
  case 0:
  case 1:
  default:
    return TypeAvisEnum["préalable"];
  }
};


export const getPossibleNextStatuts = ({
  statut,
  user
}: {
  statut?: DemandeStatutType,
  user?: UserType
}): Array<DemandeStatutType> =>
  canChangeAllStatuts({ user }) ?
    possibleStatuts :
    possibleStatuts.filter((possibleStatut) => {
      const seuilActuel = getStepWorkflow(statut);
      const seuilMax = seuilActuel + 1;
      const seuilCible = getStepWorkflow(possibleStatut);

      return statut !== possibleStatut &&
        getOrderStatut(statut) < getOrderStatut(possibleStatut) &&
        seuilCible >= seuilActuel &&
        seuilCible <= seuilMax;
    });

export const getOrderedStatutsOptions = (): Array<DemandeStatutType> =>
  possibleStatuts
    .sort((a, b) => b.localeCompare(a))
    .sort((a, b) => getOrderStatut(a) - getOrderStatut(b));

