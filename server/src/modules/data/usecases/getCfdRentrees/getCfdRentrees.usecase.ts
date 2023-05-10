import _ from "lodash";

import { dependencies } from "./dependencies.di";

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

export const getCfdRentreesFactory =
  ({
    findNMefs = dependencies.findNMefs,
    findConstatRentrees = dependencies.findContratRentrees,
  }) =>
  async ({ cfd }: { cfd: string }): Promise<CfdRentrees[]> => {
    const nMefs = await findNMefs({ cfd });
    const dispositifs = _.chain(nMefs)
      .orderBy("ANNEE_DISPOSITIF")
      .groupBy("DISPOSITIF_FORMATION")
      .value();

    return (
      await Promise.all(
        Object.entries(dispositifs).map(
          async ([dispositifId, dispositifNMefs]) => {
            const chain1 = dispositifNMefs.map(
              async (nMef) =>
                await findConstatRentrees({ mefStat11: nMef.MEF_STAT_11 })
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
        )
      )
    ).flat();
  };

export const getCfdRentrees = getCfdRentreesFactory({});
