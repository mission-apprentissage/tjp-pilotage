import { z } from "zod";

import { voie } from "../../enum/voieEnum";
import { FormationSpecifiqueFlagsSchema } from "../../schema/formationSpecifiqueFlagsSchema";

const EtablissementSchema = z.object({
  uai: z.string(),
  libelleEtablissement: z.string(),
  codeRegion: z.string(),
  codeAcademie: z.string(),
  codeDepartement: z.string(),
});

const OptionSchema = z.object({
  label: z.string(),
  value: z.string(),
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
    tauxPoursuiteRegional: z.coerce.number().optional(),
    tauxInsertionRegional: z.coerce.number().optional(),
    tauxDevenirFavorable: z.coerce.number().optional(),
    effectifSortie: z.coerce.number().optional(),
    nbSortants: z.coerce.number().optional(),
    nbPoursuiteEtudes: z.coerce.number().optional(),
    nbInsertion6mois: z.coerce.number().optional(),
    positionQuadrant: z.string().optional(),
    continuum: z
      .object({
        cfd: z.string(),
        libelleFormation: z.string().optional(),
      })
      .optional(),
  }),
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
    effectifs: z.array(z.coerce.string().optional()).optional(),
    tauxPression: z.coerce.number().optional(),
    tauxPressionNational: z.coerce.number().optional(),
    tauxPressionRegional: z.coerce.number().optional(),
    tauxPressionDepartemental: z.coerce.number().optional(),
    tauxRemplissage: z.coerce.number().optional(),
    dateOuverture: z.coerce.number(),
  }),
);

export const FormationSchema = z.object({
  offre: z.string(),
  libelleNiveauDiplome: z.string().optional(),
  libelleFormation: z.string(),
  voie: voie,
  libelleDispositif: z.string().optional(),
  cfd: z.string(),
  codeDispositif: z.string().optional(),
  codeNiveauDiplome: z.string(),
  typeFamille: z.string().optional(),
  dateOuverture: z.date().optional(),
  formationSpecifique: FormationSpecifiqueFlagsSchema,
});

const OffreSchema = z.string();

export const getAnalyseDetailleeEtablissementSchema = {
  params: z.object({
    uai: z.string(),
  }),
  response: {
    200: z.object({
      etablissement: EtablissementSchema,
      formations: z.record(OffreSchema, FormationSchema),
      chiffresIJ: z.record(OffreSchema, ChiffresIjSchema),
      chiffresEntree: z.record(OffreSchema, ChiffresEntreeSchema),
      statsSortie: z.object({
        tauxPoursuite: z.coerce.number().optional(),
        tauxInsertion: z.coerce.number().optional(),
      }),
      filters: z.object({
        diplomes: z.array(OptionSchema),
        voies: z.array(voie),
      }),
    }),
  },
};
