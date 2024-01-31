import { z } from "zod";

const OptionSchema = z.object({
  label: z.coerce.string(),
  value: z.coerce.string(),
});

export const FormationLineSchema = z.object({
  cfd: z.string(),
  libelleFormation: z.string(),
  rentreeScolaire: z.string().optional(),
  codeNiveauDiplome: z.string(),
  libelleFamille: z.string().optional(),
  codeDispositif: z.string().optional(),
  libelleDispositif: z.string().optional(),
  libelleNiveauDiplome: z.string().optional(),
  nbEtablissement: z.coerce.number().optional(),
  anneeDebut: z.coerce.number().optional(),
  effectif: z.coerce.number().optional(),
  effectif1: z.coerce.number().optional(),
  effectif2: z.coerce.number().optional(),
  effectif3: z.coerce.number().optional(),
  tauxRemplissage: z.coerce.number().optional(),
  tauxPression: z.coerce.number().optional(),
  tauxInsertion: z.coerce.number().optional(),
  tauxPoursuite: z.coerce.number().optional(),
  tauxDevenirFavorable: z.coerce.number().optional(),
  cpc: z.string().optional(),
  cpcSecteur: z.string().optional(),
  cpcSousSecteur: z.string().optional(),
  libelleFiliere: z.string().optional(),
  continuum: z
    .object({
      cfd: z.string(),
      libelleFormation: z.string().optional(),
    })
    .optional(),
  positionQuadrant: z.string().optional(),
  typeFamille: z.string().optional(),
  isHistoriqueCoExistant: z.coerce.boolean().optional(),
  formationRenovee: z.string().optional(),
});

export const getFormationSchema = {
  querystring: z.object({
    cfd: z.array(z.string()).optional(),
    codeRegion: z.array(z.string()).optional(),
    codeAcademie: z.array(z.string()).optional(),
    codeDepartement: z.array(z.string()).optional(),
    commune: z.array(z.string()).optional(),
    codeDiplome: z.array(z.string()).optional(),
    codeDispositif: z.array(z.string()).optional(),
    cfdFamille: z.array(z.string()).optional(),
    rentreeScolaire: z.array(z.string()).optional(),
    cpc: z.array(z.string()).optional(),
    cpcSecteur: z.array(z.string()).optional(),
    cpcSousSecteur: z.array(z.string()).optional(),
    libelleFiliere: z.array(z.string()).optional(),
    order: z.enum(["asc", "desc"]).optional(),
    orderBy: FormationLineSchema.keyof().optional(),
    withEmptyFormations: z.coerce.boolean().optional(),
    withAnneeCommune: z.string().optional(),
    offset: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
  }),
  response: {
    200: z.object({
      count: z.coerce.number(),
      filters: z.object({
        regions: z.array(OptionSchema),
        academies: z.array(OptionSchema),
        departements: z.array(OptionSchema),
        communes: z.array(OptionSchema),
        diplomes: z.array(OptionSchema),
        dispositifs: z.array(OptionSchema),
        familles: z.array(OptionSchema),
        formations: z.array(OptionSchema),
        cpcs: z.array(OptionSchema),
        cpcSecteurs: z.array(OptionSchema),
        cpcSousSecteurs: z.array(OptionSchema),
        libelleFilieres: z.array(OptionSchema),
      }),
      formations: z.array(FormationLineSchema),
    }),
  },
};