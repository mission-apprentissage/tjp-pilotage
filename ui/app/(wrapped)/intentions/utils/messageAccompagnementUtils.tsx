import type { CampagneType } from "shared/schema/campagneSchema";


const CAMPAGNE_UNIQUEMENT_MODIFICATION = `La création de nouvelles demandes n'est plus possible
  pour la campagne $ANNEE_CAMPAGNE, vous pouvez uniquement modifier une demande existante.
  Toute nouvelle demande devra être créée sur la $CURRENT_ANNEE_CAMPAGNE.
`;

const PAS_DE_CURRENT_CAMPAGNE_REGIONALE_EN_COURS = `La création de nouvelles demandes n'est plus possible
  pour la campagne $ANNEE_CAMPAGNE, vous pouvez uniquement modifier une demande existante.
  Une campagne régionale doit d'abord être créée par l'administrateur avant de pouvoir soumettre une nouvelle demande.
`;

const PAS_DE_CAMPAGNE_REGIONALE_EN_COURS = `Pour la campagne $ANNEE_CAMPAGNE, une campagne régionale
  doit d'abord être créée par l'administrateur avant de pouvoir soumettre une nouvelle demande.
`;

export const getMessageAccompagnementCampagne = ({
  campagne,
  currentCampagne
} : {
  campagne: CampagneType;
  currentCampagne?: CampagneType;
}) => {
  if(campagne.id !== currentCampagne?.id && currentCampagne?.codeRegion)
    return CAMPAGNE_UNIQUEMENT_MODIFICATION
      .replace("$ANNEE_CAMPAGNE", campagne.annee)
      .replace("$CURRENT_ANNEE_CAMPAGNE", currentCampagne?.annee ? `campagne ${currentCampagne.annee}`: "dernière campagne en cours");
  if(campagne.id !== currentCampagne?.id && !campagne.codeRegion)
    return PAS_DE_CAMPAGNE_REGIONALE_EN_COURS
      .replace("$ANNEE_CAMPAGNE", campagne.annee);
  if(campagne.id === currentCampagne?.id && !campagne.codeRegion)
    return PAS_DE_CURRENT_CAMPAGNE_REGIONALE_EN_COURS
      .replace("$ANNEE_CAMPAGNE", campagne.annee);
  return undefined;
};
