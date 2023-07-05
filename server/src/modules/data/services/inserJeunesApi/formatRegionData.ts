export type IjRegionData = {
  meftstats: Record<
    string,
    Record<
      "scolaire" | "apprentissage",
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
    >
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
        dimensions: { id_mefstat11?: string; ensemble?: string }[];
        filiere: "voie_pro_sco_educ_nat" | "apprentissage";
      }
    ) => {
      const filiere = cur.filiere;
      const voie = (
        {
          voie_pro_sco_educ_nat: "scolaire",
          apprentissage: "apprentissage",
        } as const
      )[filiere];

      if (voie === "scolaire") {
        const ensemble = cur.dimensions[0].ensemble;
        const mefstat11 = cur.dimensions[0].id_mefstat11;

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
                [voie]: {
                  ...acc.meftstats[mefstat11]?.[voie],
                  [cur.id_mesure]: cur.valeur_mesure,
                },
              },
            },
          };
        }
      }
      return acc;
    },
    { meftstats: {} } as IjRegionData
  );
};
