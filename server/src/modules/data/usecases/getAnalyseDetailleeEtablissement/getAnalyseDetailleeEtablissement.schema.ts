import { z } from "zod";

const OptionSchema = z.object({
  label: z.string(),
  value: z.string(),
  ordreFormation: z.string(),
  nbOffres: z.coerce.number(),
});

const ChiffresIjSchema = z.record(
  z.string(), // millesimeSortie
  z.object({
    millesimeSortie: z.string(),
    voie: z.string(),
    cfd: z.string(),
    codeDispositif: z.string().optional(),
    tauxPoursuite: z.coerce.number().optional(),
    tauxInsertion: z.coerce.number().optional(),
    tauxDevenirFavorable: z.coerce.number().optional(),
    effectifSortie: z.coerce.number().optional(),
    nbSortants: z.coerce.number().optional(),
    nbPoursuiteEtudes: z.coerce.number().optional(),
    nbInsertion6mois: z.coerce.number().optional(),
  })
);

const ChiffresEntreeSchema = z.record(
  z.string(), // rentreeScolaire
  z.object({
    rentreeScolaire: z.string(),
    voie: z.string(),
    uai: z.string(),
    cfd: z.string(),
    codeDispositif: z.coerce.string().optional(),
    capacite: z.coerce.number().optional(),
    premiersVoeux: z.coerce.number().optional(),
    effectifEntree: z.coerce.number().optional(),
    effectifAnnee1: z.coerce.number().optional(),
    effectifAnnee2: z.coerce.number().optional(),
    effectifAnnee3: z.coerce.number().optional(),
    tauxPression: z.coerce.number().optional(),
    tauxPressionNational: z.coerce.number().optional(),
    tauxPressionRegional: z.coerce.number().optional(),
    tauxPressionDepartemental: z.coerce.number().optional(),
    tauxRemplissage: z.coerce.number().optional(),
  })
);

const FormationSchema = z.object({
  offre: z.string(),
  libelleNiveauDiplome: z.string().optional(),
  libelleFormation: z.string(),
  voie: z.string(),
  libelleDispositif: z.string().optional(),
  cfd: z.string(),
  codeDispositif: z.string().optional(),
  codeNiveauDiplome: z.string(),
  ordreFormation: z.string().optional(),
});

export const getAnalyseDetailleeEtablissementSchema = {
  querystring: z.object({
    uai: z.string(),
    codeNiveauDiplome: z.array(z.string()).optional(),
  }),
  response: {
    200: z.object({
      formations: z.record(
        z.string(), // offre
        FormationSchema
      ),
      chiffresIj: z.record(
        z.string(), // offre
        ChiffresIjSchema
      ),
      chiffresEntree: z.record(
        z.string(), // offre
        ChiffresEntreeSchema
      ),
      filters: z.object({
        diplomes: z.array(OptionSchema),
      }),
    }),
  },
};
