const seuil = 20;

type DonneesTauxDevenirFavorable = {
  nbPoursuite: number;
  nbInsertion6mois: number;
  effectifSortie: number;
};

export const getTauxDevenirFavorable = ({
  nbPoursuite,
  nbInsertion6mois,
  effectifSortie,
}: DonneesTauxDevenirFavorable): number | undefined => {
  if (nbPoursuite && nbInsertion6mois && effectifSortie >= seuil) {
    return ((nbPoursuite + nbInsertion6mois) / effectifSortie);
  }
  return undefined;
};
