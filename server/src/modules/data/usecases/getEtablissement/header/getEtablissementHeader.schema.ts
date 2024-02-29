import { z } from "zod";

const informationsSchema = z.object({
  libelleEtablissement: z.string(),
  adresse: z.string().optional(),
  commune: z.string().optional(),
  codePostal: z.string().optional(),
  libelleDepartement: z.string().optional(),
  codeDepartement: z.string().optional(),
  isScolaire: z.boolean(),
  isApprentissage: z.boolean(),
  secteur: z.string().optional(),
});

const filieresSchema = z.array(
  z.object({
    icon: z.string(),
    name: z.string(),
  })
);

const indicateurSchema = z.object({
  value: z.number(),
  compareTo: z
    .object({
      value: z.string(),
      direction: z.enum(["up", "down"]),
      color: z.enum(["green", "red"]),
    })
    .optional(),
});

const indicateursSchema = z.object({
  millesime: z.string(),
  valeurAjoutee: indicateurSchema,
  tauxPoursuite: indicateurSchema,
  tauxEmploi6mois: indicateurSchema,
  tauxDevenir: indicateurSchema,
});

export const getEtablissementHeaderSchema = {
  params: z.object({
    uai: z.string(),
  }),
  response: {
    200: z.object({
      informations: informationsSchema.optional(),
      filieres: filieresSchema,
      indicateurs: indicateursSchema,
    }),
  },
};

export type GetEtablissementHeaderType = z.infer<
  (typeof getEtablissementHeaderSchema)["response"]["200"]
>;
