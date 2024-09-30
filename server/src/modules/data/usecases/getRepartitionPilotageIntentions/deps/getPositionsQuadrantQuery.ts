import {
  Filters,
  Repartition,
} from "../getRepartitionPilotageIntentions.usecase";
import { getDenominateurQuery } from "./getDenominateurQuery";
import { getNumerateurQuery } from "./getNumerateurQuery";

export const getPositionsQuadrantQuery = async ({
  filters,
}: {
  filters: Filters;
}): Promise<Repartition> => {
  const [numerateur, denominateur] = await Promise.all([
    getNumerateurQuery({
      filters: {
        ...filters,
      },
    }),
    getDenominateurQuery({
      filters: {
        ...filters,
      },
    }),
  ]);

  return {
    numerateur,
    denominateur,
    groupBy: {
      code: "positionQuadrant",
      libelle: "positionQuadrant",
    },
  };
};
