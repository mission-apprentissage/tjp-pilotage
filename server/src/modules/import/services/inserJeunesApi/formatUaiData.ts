
export type IJData = {
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

export type IJUaiData = {
  ensemble: Record<string, IJDataWithValeurAjoutee>; // Valeurs possible pour ensemble: "ensemble", "apprentis", "voieprosco"
  apprentissage: Record<string, IJData>;
  scolaire: Record<string, IJData>;
}

export type IJDataWithValeurAjoutee = IJData & { valeur_ajoutee_6_mois?: number }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatUaiData = (rawData: any): IJUaiData => {
  return rawData.data.reduce(
    (
      acc: IJUaiData,
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
        return {
          ...acc,
          ["ensemble"]: {
            ...acc.ensemble,
            [ensemble]: {
              ...acc.ensemble[ensemble],
              [cur.id_mesure]: cur.valeur_mesure,
            },
          },
        };
      }

      if (mefstat11) {
        return {
          ...acc,
          scolaire: {
            ...acc.scolaire,
            [mefstat11]: {
              ...acc.scolaire[mefstat11],
              [cur.id_mesure]: cur.valeur_mesure,
            },
          },
        };
      }

      if (cfd) {
        return {
          ...acc,
          apprentissage: {
            ...acc.apprentissage,
            [cfd]: {
              ...acc.apprentissage[cfd],
              [cur.id_mesure]: cur.valeur_mesure,
            },
          },
        };
      }
      return acc;
    },
    { scolaire: {}, apprentissage: {}, ensemble: {} } as IJUaiData
  );
};
