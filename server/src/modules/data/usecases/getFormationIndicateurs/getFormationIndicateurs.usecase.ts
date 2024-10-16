import Boom from "@hapi/boom";

import {
  getEffectifs,
  getEtablissements,
  getFormation,
  getSoldePlacesTransformee,
  getTauxIJ,
  getTauxPressions,
} from "./dependencies";
import { getTauxRemplissages } from "./dependencies/getTauxRemplissage.dep";
import { QueryFilters } from "./getFormationIndicateurs.schema";

const getFormationIndicateursFactory =
  (
    deps = {
      getFormation,
      getTauxIJ,
      getEffectifs,
      getEtablissements,
      getTauxPressions,
      getTauxRemplissages,
      getSoldePlacesTransformee,
    }
  ) =>
  async (
    cfd: string,
    { codeAcademie, codeRegion, codeDepartement }: QueryFilters
  ) => {
    const [
      formation,
      tauxIJ,
      effectifs,
      etablissements,
      tauxPressions,
      tauxRemplissages,
      soldePlacesTransformee,
    ] = await Promise.all([
      deps.getFormation({ cfd }),
      deps.getTauxIJ({ cfd, codeRegion }),
      deps.getEffectifs({ cfd, codeRegion, codeDepartement, codeAcademie }),
      deps.getEtablissements({
        cfd,
        codeRegion,
        codeDepartement,
        codeAcademie,
      }),
      deps.getTauxPressions({
        cfd,
        codeRegion,
        codeAcademie,
        codeDepartement,
      }),
      deps.getTauxRemplissages({
        cfd,
        codeRegion,
        codeAcademie,
        codeDepartement,
      }),
      deps.getSoldePlacesTransformee({
        cfd,
        codeRegion,
        codeAcademie,
        codeDepartement,
      }),
    ]);

    if (!formation) {
      throw Boom.notFound(`La formation avec le cfd ${cfd} est inconnue`);
    }

    return {
      ...formation,
      tauxIJ,
      effectifs,
      etablissements,
      tauxPressions,
      tauxRemplissages,
      soldePlacesTransformee,
    };
  };

export const getFormationIndicateursUseCase = getFormationIndicateursFactory();
