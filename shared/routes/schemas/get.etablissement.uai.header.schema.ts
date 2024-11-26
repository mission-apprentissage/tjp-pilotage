import { z } from "zod";

const informationsSchema = z.object({
  libelleEtablissement: z.string(),
  uai: z.string(),
  adresse: z.string().optional(),
  commune: z.string().optional(),
  codePostal: z.string().optional(),
  libelleDepartement: z.string().optional(),
  codeDepartement: z.string().optional(),
  codeRegion: z.string().optional(),
  isScolaire: z.boolean(),
  isApprentissage: z.boolean(),
  secteur: z.string().optional(),
});

const nsfsSchema = z.array(
  z.object({
    codeNsf: z.string().optional(),
    libelleNsf: z.string().optional(),
    nbFormations: z.number(),
  })
);

const compareToSchema = z
  .object({
    value: z.string(),
    direction: z.enum(["up", "down", "equal"]),
    description: z.string().optional(),
  })
  .optional();

export type CompareTo = z.infer<typeof compareToSchema>;

const indicateurSchema = z
  .object({
    value: z.number(),
    compareTo: compareToSchema,
  })
  .optional();

export type Indicateur = z.infer<typeof indicateurSchema>;

const indicateursSchema = z.object({
  millesime: z.string(),
  valeurAjoutee: indicateurSchema,
  tauxPoursuite: indicateurSchema,
  tauxEmploi6mois: indicateurSchema,
  tauxDevenir: indicateurSchema,
});

export type Indicateurs = z.infer<typeof indicateursSchema>;

export const getHeaderEtablissementSchema = {
  params: z.object({
    uai: z.string(),
  }),
  response: {
    200: z.object({
      informations: informationsSchema.optional(),
      indicateurs: indicateursSchema,
      nsfs: nsfsSchema,
    }),
  },
};

export type GetHeaderEtablissementType = z.infer<(typeof getHeaderEtablissementSchema)["response"]["200"]>;
