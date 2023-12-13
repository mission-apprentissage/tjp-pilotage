import { z } from "zod";

export const ScopeEnum = z.enum([
  "regions",
  "academies",
  "departements",
  "national",
]);

export type Scope = z.infer<typeof ScopeEnum>;

const ScopedStatsTransfoSchema = z.object({
  key: z.string(),
  libelle: z.string(),
  code: z.string(),
  placesTransformees: z.number(),
  effectif: z.number(),
  tauxTransformation: z.number(),
});

const QuerySchema = z.object({
  rentreeScolaire: z.string().optional(),
  codeNiveauDiplome: z.array(z.string()).optional(),
  CPC: z.array(z.string()).optional(),
  filiere: z.array(z.string()).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: ScopedStatsTransfoSchema.keyof().optional(),
  scope: ScopeEnum.default("national"),
});

export type QuerySchema = z.infer<typeof QuerySchema>;

const StatsTransfoSchema = z.record(
  z.string(),
  ScopedStatsTransfoSchema.extend({
    code: z.string().optional(),
    libelle: z.string().optional(),
  })
);

export const getScopedTauxTransformationSchema = {
  querystring: QuerySchema,
  response: {
    200: StatsTransfoSchema,
  },
};
