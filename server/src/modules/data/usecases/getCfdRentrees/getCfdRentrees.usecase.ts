import { inject } from "injecti";
import _ from "lodash";

import { findConstatRentrees } from "./findConstatRentrees.dep";
import { findNMefs } from "./findNMefs.dep";

export type CfdRentrees = {
  cfd: string;
  dispositifId: string;
  voie: "scolaire" | "apprentissage";
  uai: string;
  anneeDebutConstate: number;
  annees: {
    mefstat: string;
    libelle: string;
    annee: number;
    effectif?: number;
    constatee: boolean;
  }[];
};

export const [getCfdRentrees, getCfdRentreesFactory] = inject(
  {
    findNMefs,
    findConstatRentrees,
  },
  (deps) =>
    async ({
      cfd,
      year,
    }: {
      cfd: string;
      year: string;
    }): Promise<CfdRentrees[]> => {
      const nMefs = await deps.findNMefs({ cfd });
      const dispositifs = _.chain(nMefs)
        .orderBy("ANNEE_DISPOSITIF")
        .groupBy("DISPOSITIF_FORMATION")
        .value();

      const promises = Object.entries(dispositifs).map(
        async ([dispositifId, dispositifNMefs]) => {
          const chain1 = dispositifNMefs.map(
            async (nMef) =>
              await deps.findConstatRentrees({
                mefStat11: nMef.MEF_STAT_11,
                year,
              })
          );

          const chain2 = await Promise.all(chain1);

          const anneeDebutConstate = chain2.findIndex((nMef) =>
            nMef.some((constat) => constat)
          );

          return _.chain(chain2)
            .flatMap()
            .groupBy((v) => v["Numéro d'établissement"])
            .entries()
            .map(([uai, annees]) => ({
              uai,
              cfd,
              voie: "scolaire" as const,
              dispositifId,
              anneeDebutConstate,
              annees: dispositifNMefs.map((dis) => {
                const constat = annees.find(
                  (constat) => constat["Mef Bcp 11"] === dis.MEF_STAT_11
                );
                return {
                  libelle: dis.LIBELLE_LONG,
                  mefstat: dis.MEF_STAT_11,
                  annee: parseInt(dis.ANNEE_DISPOSITIF),
                  effectif: constat
                    ? parseInt(constat?.["Nombre d'élèves"])
                    : undefined,
                  constatee: !!constat,
                };
              }),
            }))
            .value();
        }
      );
      return (await Promise.all(promises)).flat();
    }
);
