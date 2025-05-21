const seuil = 20;

type DonneesTauxPoursuite = {
  nbPoursuite: number;
  effectifSortie: number;
};

export const getTauxPoursuite = ({
  nbPoursuite,
  effectifSortie,
}: DonneesTauxPoursuite): number | undefined => {
  if (nbPoursuite && effectifSortie >= seuil) {
    return (nbPoursuite / effectifSortie);
  }
  return undefined;
};
