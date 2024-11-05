import { PositionQuadrantZodType } from "shared/enum/positionQuadrantEnum";
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
  effectifEntree: z.coerce.number().optional(),
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
  libelleNsf: z.string().optional(),
  continuum: z
    .object({
      cfd: z.string(),
      libelleFormation: z.string().optional(),
    })
    .optional(),
  positionQuadrant: z.string().optional(),
  typeFamille: z.string().optional(),
  isHistoriqueCoExistant: z.coerce.boolean().optional(),
  // CFD de l'éventuelle formation renovant la formation actuelle
  formationRenovee: z.string().optional(),
  // Flag indiquant si la formation est renovée
  isFormationRenovee: z.coerce.boolean().optional(),
  dateFermeture: z.string().optional(),
});

export const getFormationSchema = {
  querystring: z.object({
    cfd: z.array(z.string()).optional(),
    codeRegion: z.array(z.string()).optional(),
    codeAcademie: z.array(z.string()).optional(),
    codeDepartement: z.array(z.string()).optional(),
    commune: z.array(z.string()).optional(),
    codeNiveauDiplome: z.array(z.string()).optional(),
    codeDispositif: z.array(z.string()).optional(),
    cfdFamille: z.array(z.string()).optional(),
    rentreeScolaire: z.array(z.string()).optional(),
    codeNsf: z.array(z.string()).optional(),
    positionQuadrant: z.array(PositionQuadrantZodType).optional(),
    search: z.string().optional(),
    withEmptyFormations: z.string().optional(),
    withAnneeCommune: z.string().optional(),
    order: z.enum(["asc", "desc"]).optional(),
    orderBy: FormationLineSchema.keyof().optional(),
    offset: z.coerce.number().optional(),
    limit: z.coerce.number().default(10000000).optional(),
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
        libellesNsf: z.array(OptionSchema),
        positionsQuadrant: z.array(OptionSchema),
      }),
      formations: z.array(FormationLineSchema),
    }),
  },
};
