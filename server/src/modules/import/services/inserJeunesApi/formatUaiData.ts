enum Keys {
  cfds = "cfds",
  meftstats = "meftstats",
}

export type R = {
  [k in Keys]: Record<
    string,
    {
      nb_annee_term: number;
      nb_en_emploi_12_mois: number;
      nb_en_emploi_18_mois: number;
      nb_en_emploi_24_mois: number;
      nb_en_emploi_6_mois: number;
      nb_poursuite_etudes: number;
      nb_sortant: number;
      taux_emploi_12_mois: number;
      taux_emploi_18_mois: number;
      taux_emploi_24_mois: number;
      taux_emploi_6_mois: number;
      taux_poursuite_etudes: number;
    }
  >;
} & { [s: string]: { valeur_ajoutee_6_mois: number } };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatUaiData = (rawData: any): R => {
  return rawData.data.reduce(
    (
      acc: R,
      cur: {
        id_mesure: string;
        valeur_mesure: number;
        dimensions: {
          id_mefstat11?: string;
          ensemble?: string;
          id_formation_apprentissage?: string;
        }[];
      }
    ) => {
      const ensemble = cur.dimensions[0].ensemble;
      const mefstat11 = cur.dimensions[0].id_mefstat11;
      const id_formation_apprentissage =
        cur.dimensions[0].id_formation_apprentissage;

      if (ensemble) {
        return {
          ...acc,
          [ensemble]: {
            ...acc["ensemble"],
            [cur.id_mesure]: cur.valeur_mesure,
          },
        };
      }

      if (mefstat11) {
        return {
          ...acc,
          meftstats: {
            ...acc.meftstats,
            [mefstat11]: {
              ...acc.meftstats[mefstat11],
              [cur.id_mesure]: cur.valeur_mesure,
            },
          },
        };
      }

      if (id_formation_apprentissage) {
        return {
          ...acc,
          cfds: {
            ...acc.cfds,
            [id_formation_apprentissage]: {
              ...acc.cfds[id_formation_apprentissage],
              [cur.id_mesure]: cur.valeur_mesure,
            },
          },
        };
      }
      return acc;
    },
    { meftstats: {}, cfds: {} } as R
  );
};
