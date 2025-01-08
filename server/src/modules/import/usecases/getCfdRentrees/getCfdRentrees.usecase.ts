// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import { chain } from "lodash-es";

import { findConstatRentrees } from "./findConstatRentrees.dep";
import { getCfdDispositifs } from "./getCfdDispositifs.dep";

export type AnneeEnseignement = {
  mefstat: string;
  libelle: string;
  effectif?: number;
  constatee: boolean;
};

export type AnneeDispositif = {
  mefstat: string;
  libelleDispositif: string;
};

export const [getCfdRentrees] = inject(
  {
    getCfdDispositifs,
    findConstatRentrees,
  },
  (deps) =>
    async ({
      cfd,
      codeDispositif,
      year,
    }: {
      cfd: string;
      codeDispositif: string;
      year: string;
    }): Promise<
      | {
          anneeDebutConstate?: number;
          enseignements: {
            voie: "scolaire" | "apprentissage";
            uai: string;
            anneesEnseignement: AnneeEnseignement[];
          }[];
        }
      | undefined
    > => {
      const dispositifs = await deps.getCfdDispositifs({ cfd });
      const dispositif = dispositifs.find((item) => item.codeDispositif === codeDispositif);

      if (!dispositif) return;

      const anneesDispositifAvecConstats = await Promise.all(
        Object.values(dispositif.anneesDispositif).map(async (anneeDispositif) => ({
          constats: await deps.findConstatRentrees({
            mefStat11: anneeDispositif.mefstat,
            year,
          }),
          ...anneeDispositif,
        })),
      );

      const enseignements = await chain(anneesDispositifAvecConstats)
        .map(({ constats }) => constats)
        .flatMap()
        .groupBy((v) => v["UAI"])
        .entries()
        .map(([uai, annees]) => ({
          uai,
          cfd,
          voie: "scolaire" as const,
          codeDispositif: dispositif.codeDispositif,
          anneesEnseignement: Object.values(dispositif.anneesDispositif).reduce(
            (acc, anneeDispositif) => {
              const constat = annees.find((constat) => constat["Mef Bcp 11"] === anneeDispositif.mefstat);
              acc[anneeDispositif.annee] = {
                libelle: anneeDispositif.libelleDispositif,
                mefstat: anneeDispositif.mefstat,
                effectif: constat ? parseInt(constat?.["Nombre d'élèves : Total"] ?? "0") : undefined,
                constatee: !!constat,
              };
              return acc;
            },
            [] as {
              libelle: string;
              mefstat: string;
              effectif?: number;
              constatee: boolean;
            }[],
          ),
        }))
        .value();

      return {
        enseignements,
      };
    },
);
