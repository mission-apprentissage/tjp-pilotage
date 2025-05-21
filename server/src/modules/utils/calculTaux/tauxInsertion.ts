const seuil = 20;

type DonneesTauxInsertion = {
  nbInsertion6mois: number;
  nbSortants: number;
};

export const getTauxInsertion = ({
  nbInsertion6mois,
  nbSortants,
}: DonneesTauxInsertion): number | undefined => {
  if (nbInsertion6mois && nbSortants >= seuil) {
    return (nbInsertion6mois / nbSortants);
  }
  return undefined;
};
