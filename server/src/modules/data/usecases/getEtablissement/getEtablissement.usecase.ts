import * as Boom from "@hapi/boom";

import { getEtablissementQuery } from "./getEtablissement.query";

const getEtablissementFactory = (
  deps = {
    getEtablissementQuery,
  }
) =>
  async ({ uai }: { uai: string }) => {
    const etablissement = await deps.getEtablissementQuery({
      uai,
    });

    if (!etablissement) {
      throw Boom.notFound(`L'établissement avec l'uai ${uai} n'existe pas dans l'application.`);
    }

    return {
      value: etablissement?.uai ?? uai,
      label:
      etablissement?.libelleEtablissement &&
      etablissement?.commune &&
      `${etablissement.libelleEtablissement} - ${etablissement.commune}`,
      commune: etablissement?.commune,
    };
  };

export const getEtablissementUsecase = getEtablissementFactory();
