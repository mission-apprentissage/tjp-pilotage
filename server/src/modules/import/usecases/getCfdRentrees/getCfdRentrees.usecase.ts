/**
 * Récupère les années d'enseignement constatées pour une formation diplôme (cfd) et un dispositif donnés.
 *
 * Fichiers rawData utilisés :
 * - "nMef" : données des dispositifs et MEF associés au cfd (FORMATION_DIPLOME, DISPOSITIF_FORMATION, MEF_STAT_11, LIBELLE_LONG, ANNEE_DISPOSITIF, DUREE_DISPOSITIF)
 * - "constat_[year]" : données des constats de rentrée pour l'année spécifiée (Mef Bcp 11, UAI, Nombre d'élèves : Total)
 *
 * Cette fonction :
 * 1. Récupère tous les nMef pour le cfd (via rawData type "nMef")
 * 2. Transforme les données en dispositifs avec années d'enseignement et MEF correspondants
 * 3. Filtre pour trouver le dispositif spécifié par son code
 * 4. Pour chaque année du dispositif, cherche les constats de rentrée correspondants (via rawData type "constat_[year]")
 * 5. Groupe les constats par établissement (UAI)
 * 6. Enrichit les données avec l'effectif issu du constat de rentrée (si disponible)
 *
 * Retourne un objet contenant la liste des enseignements avec détails par établissement et année,
 * ou undefined si le dispositif n'existe pas.
 */

import { chain } from "lodash-es";

import { inject } from "@/utils/inject";

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
        }))
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
            }[]
          ),
        }))
        .value();

      return {
        enseignements,
      };
    }
);
