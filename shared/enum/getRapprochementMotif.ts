export const getRapprochementMotif = (
  key: "statut" | "campagne" | "rentrée" | "niveau" |
       "apprentissageOK" | "apprentissage" | "colorationOK" |
       "fermeture" | "fermetureOK" | "horsFermetureKO" | "horsFermetureOK"
): string => {

  const motifRapprochementList = {
    "statut": "Cette demande n’est pas validée. Nous n’avons pas fait le rapprochement avec le constat de rentrée",
    "campagne": "Cette demande est issue d'une campagne en cours. Nous n’avons pas fait le rapprochement avec le constat de rentrée",
    "rentrée": "Cette demande concerne une rentrée scolaire future (données non disponibles)",
    "niveau": "Ce type de diplôme n’est pas présent dans le constat de rentrée",
    "apprentissageOK": "Cette demande concerne des effectifs en apprentissage. La formation est bien présente dans le constat de rentrée en voie scolaire, mais nous ne pouvons pas vérifier les effectifs en apprentissage",
    "apprentissage": "Cette demande concerne des effectifs en apprentissage ; cette formation n’existe pas dans le constat de rentrée en voie scolaire",
    "colorationOK": "Cette demande concerne une coloration de places. La formation est bien présente dans le constat de rentrée mais nous ne pouvons pas vérifier les places colorées réellement occupées",
    "fermeture": "Cette demande concerne une fermeture mais nous avons trouvé des effectifs en entrée",
    "fermetureOK": "Cette demande concerne une fermeture. Nous n’avons pas trouvé d’effectifs en entrée",
    "horsFermetureKO": "Cette demande n’a pas pu être rapprochée du constat de rentrée, veuillez vérifier l'UAI et/ou le Code Diplôme et apporter les corrections nécessaires pour que le rapprochement s’opère",
    "horsFermetureOK": "La formation de cet établissement est bien présente dans le constat de rentrée"
  };

  return motifRapprochementList[key];
};
