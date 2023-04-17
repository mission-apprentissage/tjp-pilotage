import _ from "lodash";

import { dependencies } from "./dependencies.di";

export type Mefs = {
  cfd: string;
  dispositifId: string;
  voie: "scolaire" | "apprentissage";
  uai: string;
  annees: {
    mefstat: string;
    libelle: string;
    annee: number;
    effectif: number;
  }[];
};

export const getCfdUaisFactory =
  ({
    findNMefs = dependencies.findNMefs,
    findContratRentrees = dependencies.findContratRentrees,
  }) =>
  async ({ cfd }: { cfd: string }): Promise<Mefs[]> => {
    const nMefs = await findNMefs({ cfd });
    const dispositifs = _.chain(nMefs)
      .orderBy("annee")
      .groupBy("DISPOSITIF_FORMATION")
      .value();

    return (
      await Promise.all(
        Object.entries(dispositifs).map(
          async ([dispositifId, dispositifNMefs]) => {
            const chain1 = dispositifNMefs.map(async (nMef) => {
              return (
                await findContratRentrees({
                  mefStat11: nMef.MEF_STAT_11,
                })
              ).map((constat) => ({
                libelle: nMef.LIBELLE_LONG,
                annee: parseInt(nMef.ANNEE_DISPOSITIF),
                constat,
              }));
            });

            const chain2 = await Promise.all(chain1);

            return _.chain(chain2)
              .flatMap()
              .groupBy((v) => v.constat["Numéro d'établissement"])
              .entries()
              .map(([uai, annees]) => ({
                uai,
                cfd,
                voie: "scolaire" as const,
                dispositifId,
                annees: annees.map(({ constat, annee, libelle }) => ({
                  mefstat: constat["Mef Bcp 11"],
                  libelle,
                  annee,
                  effectif: parseInt(constat["Nombre d'élèves"]) ?? undefined,
                })),
              }))
              .value();
          }
        )
      )
    ).flat();
  };

export const getCfdUais = getCfdUaisFactory({});
