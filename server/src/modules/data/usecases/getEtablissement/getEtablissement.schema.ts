import { z } from "zod";

export const getEtablissementSchema = {
  params: z.object({ uai: z.string() }),
  response: {
    200: z.object({
      uai: z.string(),
      rentreeScolaire: z.string(),
      libelleEtablissement: z.string().optional(),
      valeurAjoutee: z.coerce.number().optional(),
      codeRegion: z.string().optional(),
      libelleRegion: z.string().optional(),
      formations: z.array(
        z.object({
          cfd: z.string(),
          codeNiveauDiplome: z.string(),
          libelleDiplome: z.string(),
          dispositifId: z.string().optional(),
          libelleDispositif: z.string().optional(),
          libelleNiveauDiplome: z.string().optional(),
          effectif: z.coerce.number().optional(),
          tauxPression: z.coerce.number().optional(),
          tauxInsertion6mois: z.coerce.number().optional(),
          tauxPoursuiteEtudes: z.coerce.number().optional(),
          tauxDevenirFavorable: z.coerce.number().optional(),
          positionCadran: z.string().optional(),
          CPC: z.string().optional(),
          CPCSecteur: z.string().optional(),
          CPCSousSecteur: z.string().optional(),
          libelleFiliere: z.string().optional(),
          continuum: z
            .object({
              cfd: z.string(),
              libelle: z.string().optional(),
            })
            .optional(),
        })
      ),
    }),
  },
};
