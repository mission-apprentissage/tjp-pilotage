import { z } from "zod";


const OptionSchema = z.object({
  label: z.coerce.string(),
  value: z.coerce.string(),
});
const FormationSchema = z.object({
  cfd: z.string(),
  codeNiveauDiplome: z.string(),
  libelleDiplome: z.string(),
  dispositifId: z.string().optional(),
  libelleDispositif: z.string().optional(),
  libelleNiveauDiplome: z.string().optional(),
  effectif: z.coerce.number().optional(),
  tauxPression: z.coerce.number().optional(),
  tauxInsertion: z.coerce.number().optional(),
  tauxPoursuite: z.coerce.number().optional(),
  tauxDevenirFavorable: z.coerce.number().optional(),
  positionQuadrant: z.string().optional(),
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
});

export const getEtablissementSchema = {
  querystring: z.object({
    uai: z.string(),
    codeNiveauDiplome: z.array(z.string()).optional(),
    libelleFiliere: z.array(z.string()).optional(),
    order: z.enum(["asc", "desc"]).optional(),
    orderBy: FormationSchema.keyof().optional(),
  }),
  response: {
    200: z.object({
      uai: z.string(),
      rentreeScolaire: z.string(),
      libelleEtablissement: z.string().optional(),
      valeurAjoutee: z.coerce.number().optional(),
      codeRegion: z.string().optional(),
      libelleRegion: z.string().optional(),
      formations: z.array(FormationSchema),
    }),
  },
};
