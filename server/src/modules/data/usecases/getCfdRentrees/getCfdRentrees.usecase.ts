import { inject } from "injecti";
import _ from "lodash";

import { findConstatRentrees } from "./findConstatRentrees.dep";
import { findNMefs } from "./findNMefs.dep";

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

export type CfdDispositif = {
  cfd: string;
  dispositifId: string;
  dureeDispositif: number;
  anneeDebutConstate: number;
  anneesDispositif: AnneeDispositif[];
  enseignements: {
    voie: "scolaire" | "apprentissage";
    uai: string;
    anneesEnseignement: AnneeEnseignement[];
  }[];
};

export const [getCfdDispositifs] = inject(
  {
    findNMefs,
    findConstatRentrees,
  },
  (deps) =>
    async ({ cfd }: { cfd: string }) => {
      const nMefs = await deps.findNMefs({ cfd });
      const dispositifs = _.chain(nMefs)
        .orderBy("ANNEE_DISPOSITIF")
        .groupBy("DISPOSITIF_FORMATION")
        .entries()
        .map(([key, nMef]) => ({
          cfd,
          dispositifId: key,
          dureeDispositif: parseInt(nMef[0].DUREE_DISPOSITIF) ?? undefined,
          anneesDispositif: nMef.map((item) => ({
            mefstat: item.MEF_STAT_11,
            libelleDispositif: item.LIBELLE_LONG,
            annee: parseInt(item.ANNEE_DISPOSITIF) ?? undefined,
          })),
        }))
        .value();

      return dispositifs;
    }
);

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
export const [getCfdRentreesS] = inject(
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
    }): Promise<CfdDispositif[]> => {
      const nMefs = await deps.findNMefs({ cfd });
      const dispositifs = _.chain(nMefs)
        .orderBy("ANNEE_DISPOSITIF")
        .groupBy("DISPOSITIF_FORMATION")
        .value();

      const promises = Object.entries(dispositifs).map(
        async ([dispositifId, dispositifNMefs]) => {
          const chain1 = dispositifNMefs.map((nMef) =>
            deps.findConstatRentrees({
              mefStat11: nMef.MEF_STAT_11,
              year,
            })
          );

          const chain2 = await Promise.all(chain1);

          const anneeDebutConstate = chain2.findIndex((nMef) =>
            nMef.some((constat) => constat)
          );

          const enseignements = _.chain(chain2)
            .flatMap()
            .groupBy((v) => v["Numéro d'établissement"])
            .entries()
            .map(([uai, annees]) => ({
              uai,
              cfd,
              voie: "scolaire" as const,
              dispositifId,
              anneeDebutConstate,
              anneesEnseignement: dispositifNMefs.map((dis) => {
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

          return {
            cfd,
            dispositifId,
            dureeDispositif:
              parseInt(dispositifNMefs[0].DUREE_DISPOSITIF) ?? undefined,
            anneeDebutConstate,
            anneesDispositif: dispositifNMefs.map((item) => ({
              mefstat: item.MEF_STAT_11,
              libelleDispositif: item.LIBELLE_LONG,
            })),
            enseignements,
          };
        }
      );
      return await Promise.all(promises);
    }
);
