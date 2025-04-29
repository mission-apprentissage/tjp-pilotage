import { hasRole } from "shared";
import type { CampagneType } from "shared/schema/campagneSchema";
import type { UserType } from "shared/schema/userSchema";
import { isCampagneEnAttente, isCampagneTerminee } from "shared/utils/campagneUtils";

import { canCreateDemande } from "./permissionsDemandeUtils";


export const CAMPAGNE_SANS_SAISIE_PERDIR = `
  La saisie de demande n'est pas autorisée pour les chefs d'établissement pour la campagne $ANNEE_CAMPAGNE.
`;

export const CAMPAGNE_UNIQUEMENT_MODIFICATION = `La création de nouvelles demandes n'est plus possible
  pour la campagne $ANNEE_CAMPAGNE, vous pouvez uniquement modifier une demande existante.
  Toute nouvelle demande devra être créée sur la $CURRENT_ANNEE_CAMPAGNE.
`;

export const PAS_DE_CAMPAGNE_REGIONALE_EN_COURS = `Pour la campagne $ANNEE_CAMPAGNE, une campagne régionale
  doit d'abord être créée par l'administrateur avant de pouvoir soumettre une nouvelle demande.
`;

export const CAMPAGNE_TERMINEE = `La campagne $ANNEE_CAMPAGNE est terminée, il n'est plus possible de saisir des demandes sur cette campagne.`;
export const CAMPAGNE_EN_ATTENTE = `La campagne $ANNEE_CAMPAGNE n'a pas encore débutée et est en attente, la campagne débutera prochainement`;

export const getMessageAccompagnementCampagne = ({
  user,
  campagne,
  currentCampagne
} : {
  user?: UserType;
  campagne: CampagneType;
  currentCampagne: CampagneType;
}) => {
  if(canCreateDemande({user, campagne})) return undefined;
  if(isCampagneEnAttente(campagne))
    return CAMPAGNE_EN_ATTENTE
      .replace("$ANNEE_CAMPAGNE", campagne.annee);
  if(isCampagneTerminee(campagne))
    return CAMPAGNE_TERMINEE
      .replace("$ANNEE_CAMPAGNE", campagne.annee);
  if(campagne.id !== currentCampagne?.id && campagne?.codeRegion)
    return CAMPAGNE_UNIQUEMENT_MODIFICATION
      .replace("$ANNEE_CAMPAGNE", campagne.annee)
      .replace("$CURRENT_ANNEE_CAMPAGNE", currentCampagne?.annee ? `campagne ${currentCampagne.annee}`: "dernière campagne en cours");
  if(campagne.id !== currentCampagne?.id && !campagne.codeRegion)
    return PAS_DE_CAMPAGNE_REGIONALE_EN_COURS
      .replace("$ANNEE_CAMPAGNE", campagne.annee);
  if(hasRole({user, role: "perdir"}) && !campagne.withSaisiePerdir)
    return CAMPAGNE_SANS_SAISIE_PERDIR
      .replace("$ANNEE_CAMPAGNE", campagne.annee);
  return undefined;
};
