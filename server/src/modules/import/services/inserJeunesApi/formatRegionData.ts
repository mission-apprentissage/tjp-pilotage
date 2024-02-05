enum Keys {
  cfds = "cfds",
  meftstats = "meftstats",
}

export type IjRegionData = {
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
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatRegionData = (rawData: any): IjRegionData => {
  return rawData.data.reduce(
    (
      acc: IjRegionData,
      cur: {
        id_mesure: string;
        valeur_mesure: number;
        dimensions: {
          id_mefstat11?: string;
          id_formation_apprentissage?: string;
          ensemble?: string;
        }[];
        filiere: "voie_pro_sco_educ_nat" | "apprentissage";
      }
    ) => {
      const ensemble = cur.dimensions[0].ensemble;
      const mefstat11 = cur.dimensions[0].id_mefstat11;
      const cfd = cur.dimensions[0].id_formation_apprentissage;

      if (ensemble) {
        return acc;
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

      if (cfd) {
        return {
          ...acc,
          cfds: {
            ...acc.cfds,
            [cfd]: {
              ...acc.cfds[cfd],
              [cur.id_mesure]: cur.valeur_mesure,
            },
          },
        };
      }
      return acc;
    },
    { meftstats: {}, cfds: {} } as IjRegionData
  );
};
