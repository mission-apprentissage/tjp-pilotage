import { z } from "zod";

const OptionSchema = z.object({
  label: z.coerce.string(),
  value: z.coerce.string(),
});

const EtablissementLineSchema = z.object({
  libelleEtablissement: z.string().optional(),
  uai: z.string(),
  rentreeScolaire: z.string().optional(),
  secteur: z.string().optional(),
  commune: z.string().optional(),
  departement: z.string().optional(),
  codeRegion: z.string().optional(),
  cfd: z.string(),
  libelleFormation: z.string(),
  codeNiveauDiplome: z.string(),
  libelleFamille: z.string().optional(),
  codeDispositif: z.string().optional(),
  libelleDispositif: z.string().optional(),
  libelleNiveauDiplome: z.string().optional(),
  anneeDebut: z.coerce.number().optional(),
  premiersVoeux: z.coerce.number().optional(),
  capacite: z.coerce.number().optional(),
  effectif: z.coerce.number().optional(),
  effectif1: z.coerce.number().optional(),
  effectif2: z.coerce.number().optional(),
  effectif3: z.coerce.number().optional(),
  tauxPression: z.coerce.number().optional(),
  tauxRemplissage: z.coerce.number().optional(),
  tauxPoursuite: z.coerce.number().optional(),
  tauxInsertion: z.coerce.number().optional(),
  positionQuadrant: z.string().optional(),
  tauxDevenirFavorable: z.coerce.number().optional(),
  tauxPoursuiteEtablissement: z.number().optional(),
  tauxInsertionEtablissement: z.number().optional(),
  tauxDevenirFavorableEtablissement: z.number().optional(),
  valeurAjoutee: z.coerce.number().optional(),
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
  continuumEtablissement: z
    .object({
      cfd: z.string(),
      libelleFormation: z.string().optional(),
    })
    .optional(),
});

export const getEtablissementsSchema = {
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
    secteur: z.array(z.string()).optional(),
    uai: z.array(z.string()).optional(),
    cpc: z.array(z.string()).optional(),
    cpcSecteur: z.array(z.string()).optional(),
    cpcSousSecteur: z.array(z.string()).optional(),
    libelleFiliere: z.array(z.string()).optional(),
    order: z.enum(["asc", "desc"]).optional(),
    orderBy: EtablissementLineSchema.keyof().optional(),
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
        etablissements: z.array(OptionSchema),
        cpcs: z.array(OptionSchema),
        cpcSecteurs: z.array(OptionSchema),
        cpcSousSecteurs: z.array(OptionSchema),
        libelleFilieres: z.array(OptionSchema),
      }),
      etablissements: z.array(EtablissementLineSchema),
    }),
  },
};
