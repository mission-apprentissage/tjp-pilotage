import type { CampagneType } from "shared/schema/campagneSchema";


const CAMPAGNE_UNIQUEMENT_MODIFICATION = `La création de nouvelles demandes n'est plus possible
  pour la campagne $ANNEE_CAMPAGNE, vous pouvez uniquement modifier une demande existante.
  Toute nouvelle demande devra être créée sur la dernière campagne en cours.
`;

const PAS_DE_CAMPAGNE_REGIONALE_EN_COURS = `Pour la campagne $ANNEE_CAMPAGNE, une campagne régionale
  doit d'abord être créée par l'administrateur avant de pouvoir soumettre une nouvelle demande
  Cliquez pour en savoir plus sur les campagnes régionales.
`;

export const getMessageAccompagnementCampagne = ({
  campagne,
  currentCampagne
} : {
  campagne: CampagneType;
  currentCampagne?: CampagneType;
}) => {
  if(!campagne.codeRegion) return PAS_DE_CAMPAGNE_REGIONALE_EN_COURS.replace("$ANNEE_CAMPAGNE", campagne.annee);
  if(campagne.id !== currentCampagne?.id && !campagne.codeRegion) return CAMPAGNE_UNIQUEMENT_MODIFICATION.replace("$ANNEE_CAMPAGNE", campagne.annee);
  return undefined;
};
