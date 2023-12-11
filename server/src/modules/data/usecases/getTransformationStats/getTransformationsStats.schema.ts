import { z } from "zod";

const OptionSchema = z.object({
  label: z.coerce.string(),
  value: z.coerce.string(),
});

const ScopedStatsTransfoSchema = z.object({
  libelle: z.string().optional(),
  libelleAcademie: z.string().optional(),
  libelleRegion: z.string().optional(),
  countDemande: z.coerce.number(),
  differenceCapaciteScolaire: z.coerce.number(),
  differenceCapaciteApprentissage: z.coerce.number(),
  placesTransformees: z.coerce.number(),
  placesOuvertesScolaire: z.coerce.number(),
  placesOuvertesApprentissage: z.coerce.number(),
  placesOuvertes: z.coerce.number(),
  placesFermeesScolaire: z.coerce.number(),
  placesFermeesApprentissage: z.coerce.number(),
  placesFermees: z.coerce.number(),
  ratioOuverture: z.coerce.number(),
  ratioFermeture: z.coerce.number(),
  tauxTransformation: z.coerce.number(),
  effectif: z.coerce.number(),
});

const StatsTransfoSchema = z.object({
  national: ScopedStatsTransfoSchema,
  regions: z.record(
    z.string(),
    ScopedStatsTransfoSchema.merge(
      z.object({
        codeRegion: z.string().optional(),
      })
    )
  ),
  academies: z.record(
    z.string(),
    ScopedStatsTransfoSchema.merge(
      z.object({
        codeAcademie: z.string().optional(),
      })
    )
  ),
  departements: z.record(
    z.string(),
    ScopedStatsTransfoSchema.merge(
      z.object({
        codeDepartement: z.string().optional(),
      })
    )
  ),
});

export const getTransformationStatsSchema = {
  querystring: z.object({
    rentreeScolaire: z.string().optional(),
    codeNiveauDiplome: z.array(z.string()).optional(),
    CPC: z.array(z.string()).optional(),
    filiere: z.array(z.string()).optional(),
    order: z.enum(["asc", "desc"]).optional(),
    orderBy: ScopedStatsTransfoSchema.keyof().optional(),
  }),
  response: {
    200: z.object({
      submitted: StatsTransfoSchema,
      draft: StatsTransfoSchema,
      all: StatsTransfoSchema,
      filters: z.object({
        rentreesScolaires: z.array(OptionSchema),
        regions: z.array(OptionSchema),
        academies: z.array(OptionSchema),
        departements: z.array(OptionSchema),
        CPCs: z.array(OptionSchema),
        filieres: z.array(OptionSchema),
        diplomes: z.array(OptionSchema),
      }),
    }),
  },
};
