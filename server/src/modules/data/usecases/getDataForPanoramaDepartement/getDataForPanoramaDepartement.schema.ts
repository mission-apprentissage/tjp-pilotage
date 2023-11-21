import { z } from "zod";

export const getDataForPanoramaDepartementSchema = {
  querystring: z.object({
    codeDepartement: z.string(),
  }),
  response: {
    200: z.object({
      formations: z.array(
        z.object({
          codeFormationDiplome: z.string(),
          libelleDiplome: z.string(),
          codeNiveauDiplome: z.string(),
          libelleNiveauDiplome: z.string().optional(),
          dispositifId: z.string().optional(),
          libelleDispositif: z.string().optional(),
          nbEtablissement: z.coerce.number(),
          effectif: z.coerce.number().optional(),
          effectifPrecedent: z.coerce.number().optional(),
          tauxRemplissage: z.coerce.number().optional(),
          tauxPression: z.coerce.number().optional(),
          tauxInsertion6mois: z.coerce.number(),
          tauxInsertion6moisPrecedent: z.coerce.number().optional(),
          tauxPoursuiteEtudes: z.coerce.number(),
          tauxPoursuiteEtudesPrecedent: z.coerce.number().optional(),
          tauxDevenirFavorable: z.coerce.number(),
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
