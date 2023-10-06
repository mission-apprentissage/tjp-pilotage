import { inject } from "injecti";
import _ from "lodash";

import { findConstatRentrees } from "./findConstatRentrees.dep";
import { getCfdDispositifs } from "./getCfdDispositifs.dep";

export type AnneeEnseignement = {
  mefstat: string;
  libelle: string;
  annee: number;
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
      dispositifId,
      year,
    }: {
      cfd: string;
      dispositifId: string;
      year: string;
    }): Promise<
      | {
          anneeDebutConstate: number;
          enseignements: {
            voie: "scolaire" | "apprentissage";
            uai: string;
            anneesEnseignement: AnneeEnseignement[];
          }[];
        }
      | undefined
    > => {
      const dispositifs = await deps.getCfdDispositifs({ cfd });
      const dispositif = dispositifs.find(
        (item) => item.dispositifId === dispositifId
      );

      if (!dispositif) return;

      const chain1 = dispositif.anneesDispositif.map((anneeDispositif) =>
        deps.findConstatRentrees({ mefStat11: anneeDispositif.mefstat, year })
      );

      const chain2 = await Promise.all(chain1);

      const anneeDebutConstate = chain2.findIndex((nMef) =>
        nMef.some((constat) => constat)
      );

      const enseignements = await _.chain(chain2)
        .flatMap()
        .groupBy((v) => v["Numéro d'établissement"])
        .entries()
        .map(([uai, annees]) => ({
          uai,
          cfd,
          voie: "scolaire" as const,
          dispositifId: dispositif.dispositifId,
          anneeDebutConstate,
          anneesEnseignement: dispositif.anneesDispositif.map(
            (anneeDispositif) => {
              const constat = annees.find(
                (constat) => constat["Mef Bcp 11"] === anneeDispositif.mefstat
              );
              return {
                libelle: anneeDispositif.libelleDispositif,
                mefstat: anneeDispositif.mefstat,
                annee: anneeDispositif.annee,
                effectif: constat
                  ? parseInt(constat?.["Nombre d'élèves"])
                  : undefined,
                constatee: !!constat,
              };
            }
          ),
        }))
        .value();

      return {
        anneeDebutConstate,
        enseignements,
      };
    }
);
